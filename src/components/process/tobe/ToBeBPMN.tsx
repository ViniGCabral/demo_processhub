import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewEditToggle } from "./ViewEditToggle";

// ─── Lane definitions ───
const lanes = [
  { id: "requester",    label: "Requester",      y: 0,   h: 130 },
  { id: "system",       label: "System (Auto)",  y: 130, h: 230 },
  { id: "manager",      label: "Manager",        y: 360, h: 130 },
  { id: "supply",       label: "Supply Chain",   y: 490, h: 130 },
];

const LANE_HEADER_W = 40;
const TOTAL_H = 620;
const TOTAL_W = 1500;

// ─── Node definitions ───
// x,y = top-left corner of bounding box
interface BpmnNode {
  id: string;
  type: "start" | "end" | "end-terminate" | "task" | "gateway-x" | "gateway-plus";
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  responsible?: string;
  sla?: number;
  desc?: string;
}

const nodes: BpmnNode[] = [
  // ── Requester lane (y: 0–130, center ≈ 65) ──
  { id: "start", type: "start", label: "Request\nReceived", x: 72, y: 47, w: 36, h: 36 },
  { id: "t-submit", type: "task", label: "Submit Purchase\nRequest", x: 170, y: 38, w: 140, h: 54,
    responsible: "Requester", sla: 0, desc: "Requester fills out the purchase request form with material, quantity, cost center and submits." },

  // ── System (Auto) lane (y: 130–360, main row center ≈ 210, lower row ≈ 310) ──
  { id: "t-validate", type: "task", label: "Auto-Validate\nRequest Data", x: 170, y: 185, w: 140, h: 54,
    responsible: "System (Auto)", sla: 0.5, desc: "Automatically validate request fields, check for duplicates and verify requester permissions." },
  { id: "g-valid", type: "gateway-x", label: "Request\nvalid?", x: 370, y: 192, w: 40, h: 40 },
  { id: "t-return", type: "task", label: "Return to\nRequester", x: 370, y: 290, w: 140, h: 54,
    responsible: "System (Auto)", sla: 0, desc: "Send validation error details back to requester for correction." },
  { id: "end-returned", type: "end", label: "Returned", x: 540, y: 299, w: 36, h: 36 },
  { id: "t-enrich", type: "task", label: "Enrich from\nMaster Data", x: 490, y: 185, w: 140, h: 54,
    responsible: "System (Auto)", sla: 1, desc: "Pull material descriptions, pricing and supplier info from SAP master data." },
  { id: "g-value", type: "gateway-x", label: "Request\nvalue?", x: 690, y: 192, w: 40, h: 40 },
  { id: "t-auto-approve", type: "task", label: "Auto-Approve\nRequest", x: 800, y: 185, w: 140, h: 54,
    responsible: "System (Auto)", sla: 0, desc: "Requests under threshold are automatically approved and routed to fulfillment." },

  // ── Manager lane (y: 360–490, center ≈ 425) ──
  { id: "t-manager", type: "task", label: "Manager\nApproval", x: 800, y: 398, w: 140, h: 54,
    responsible: "Department Head", sla: 24, desc: "Manager reviews request, checks budget availability and approves or rejects." },

  // ── Supply Chain lane (y: 490–620, center ≈ 555) ──
  { id: "g-merge", type: "gateway-x", label: "", x: 990, y: 535, w: 40, h: 40 },
  { id: "t-create-po", type: "task", label: "Create Purchase\nOrder", x: 1080, y: 528, w: 140, h: 54,
    responsible: "Procurement Analyst", sla: 4, desc: "Generate PO in SAP with approved request details and send to supplier." },
  { id: "t-notify", type: "task", label: "Send\nNotification", x: 1270, y: 528, w: 140, h: 54,
    responsible: "System (Auto)", sla: 0, desc: "Notify requester, budget owner and procurement team about PO creation." },
  { id: "end-complete", type: "end-terminate", label: "Process\nComplete", x: 1430, y: 537, w: 36, h: 36 },
];

// ─── Edge definitions with explicit waypoints ───
interface BpmnEdge {
  from: string;
  to: string;
  label?: string;
  labelSide?: "left" | "right";
  waypoints: [number, number][];
}

function cx(n: BpmnNode) { return n.x + n.w / 2; }
function cy(n: BpmnNode) { return n.y + n.h / 2; }
function nd(id: string) { return nodes.find(n => n.id === id)!; }

// Build edges with explicit routing
const edges: BpmnEdge[] = [
  // Start → Submit Purchase Request (horizontal in Requester lane)
  { from: "start", to: "t-submit", label: undefined,
    waypoints: [[cx(nd("start")) + 18, cy(nd("start"))], [170, cy(nd("t-submit"))]] },

  // Submit Purchase Request → Auto-Validate (cross lane: Requester → System)
  { from: "t-submit", to: "t-validate", label: undefined,
    waypoints: [[cx(nd("t-submit")), nd("t-submit").y + nd("t-submit").h], [cx(nd("t-submit")), cy(nd("t-validate"))], [170, cy(nd("t-validate"))]] },

  // Auto-Validate → Gateway valid?
  { from: "t-validate", to: "g-valid", label: undefined,
    waypoints: [[310, cy(nd("t-validate"))], [370, cy(nd("g-valid"))]] },

  // Gateway valid? → Enrich (Yes, horizontal)
  { from: "g-valid", to: "t-enrich", label: "Yes",
    waypoints: [[410, cy(nd("g-valid"))], [490, cy(nd("t-enrich"))]] },

  // Gateway valid? → Return to Requester (No, L-shaped: down then right)
  { from: "g-valid", to: "t-return", label: "No", labelSide: "right" as const,
    waypoints: [[cx(nd("g-valid")), 232], [cx(nd("g-valid")), cy(nd("t-return"))], [370, cy(nd("t-return"))]] },

  // Return to Requester → Returned End Event (horizontal, same lane)
  { from: "t-return", to: "end-returned", label: undefined,
    waypoints: [[510, cy(nd("t-return"))], [540, cy(nd("end-returned"))]] },

  // Enrich → Gateway value?
  { from: "t-enrich", to: "g-value", label: undefined,
    waypoints: [[630, cy(nd("t-enrich"))], [690, cy(nd("g-value"))]] },

  // Gateway value? → Auto-Approve (≤ $5K, horizontal)
  { from: "g-value", to: "t-auto-approve", label: "≤ $5K",
    waypoints: [[730, cy(nd("g-value"))], [800, cy(nd("t-auto-approve"))]] },

  // Gateway value? → Manager Approval (> $5K, downward cross lane)
  { from: "g-value", to: "t-manager", label: "> $5K", labelSide: "left" as const,
    waypoints: [[cx(nd("g-value")), 232], [cx(nd("g-value")), cy(nd("t-manager"))], [800, cy(nd("t-manager"))]] },

  // Auto-Approve → Merge Gateway (exit RIGHT, go right, then DOWN)
  { from: "t-auto-approve", to: "g-merge", label: undefined,
    waypoints: [[940, cy(nd("t-auto-approve"))], [cx(nd("g-merge")), cy(nd("t-auto-approve"))], [cx(nd("g-merge")), 535]] },

  // Manager Approval → Merge Gateway (cross lane: Manager → Supply Chain)
  { from: "t-manager", to: "g-merge", label: "Approved",
    waypoints: [[940, cy(nd("t-manager"))], [cx(nd("g-merge")), cy(nd("t-manager"))], [cx(nd("g-merge")), 535]] },

  // Merge → Create PO
  { from: "g-merge", to: "t-create-po", label: undefined,
    waypoints: [[1030, cy(nd("g-merge"))], [1080, cy(nd("t-create-po"))]] },

  // Create PO → Send Notification
  { from: "t-create-po", to: "t-notify", label: undefined,
    waypoints: [[1220, cy(nd("t-create-po"))], [1270, cy(nd("t-notify"))]] },

  // Send Notification → End Complete
  { from: "t-notify", to: "end-complete", label: undefined,
    waypoints: [[1410, cy(nd("t-notify"))], [1430, cy(nd("end-complete"))]] },
];

// ─── Rendering helpers ───

function renderArrowhead(x: number, y: number, angle: number) {
  const size = 8;
  const rad = (angle * Math.PI) / 180;
  const p1x = x - size * Math.cos(rad - 0.4);
  const p1y = y - size * Math.sin(rad - 0.4);
  const p2x = x - size * Math.cos(rad + 0.4);
  const p2y = y - size * Math.sin(rad + 0.4);
  return <polygon points={`${x},${y} ${p1x},${p1y} ${p2x},${p2y}`} fill="hsl(var(--muted-foreground))" />;
}

function getAngle(x1: number, y1: number, x2: number, y2: number) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}

export function ToBeBPMN() {
  const [selectedId, setSelectedId] = useState<string | null>("t-validate");
  const [isEditMode, setIsEditMode] = useState(false);
  const selected = nodes.find(n => n.id === selectedId);

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-8 py-3 flex items-center justify-between">
        <ViewEditToggle isEditMode={isEditMode} onToggle={setIsEditMode} />
      </div>

      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="min-h-[500px] rounded-xl border border-border bg-muted/10 p-4 overflow-auto">
            <svg viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`} className="w-full h-auto" style={{ minWidth: 1100 }}>
              {/* Pool border */}
              <rect x="0" y="0" width={TOTAL_W} height={TOTAL_H} rx="4" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />

              {/* Lanes */}
              {lanes.map((lane, i) => (
                <g key={lane.id}>
                  {i > 0 && (
                    <line x1="0" y1={lane.y} x2={TOTAL_W} y2={lane.y} stroke="hsl(var(--border))" strokeWidth="1" />
                  )}
                  {/* Lane header */}
                  <rect x="0" y={lane.y} width={LANE_HEADER_W} height={lane.h} fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
                  <text
                    x={LANE_HEADER_W / 2}
                    y={lane.y + lane.h / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="hsl(var(--muted-foreground))"
                    transform={`rotate(-90 ${LANE_HEADER_W / 2} ${lane.y + lane.h / 2})`}
                  >
                    {lane.label}
                  </text>
                </g>
              ))}

              {/* Edges */}
              {edges.map((edge, i) => {
                const wp = edge.waypoints;
                const pathParts = [`M${wp[0][0]},${wp[0][1]}`];
                for (let j = 1; j < wp.length; j++) {
                  pathParts.push(`L${wp[j][0]},${wp[j][1]}`);
                }
                const pathD = pathParts.join(" ");

                // Arrowhead at last segment
                const last = wp[wp.length - 1];
                const prev = wp[wp.length - 2];
                const angle = getAngle(prev[0], prev[1], last[0], last[1]);

                // Label at midpoint of the first segment
                let labelX = 0, labelY = 0;
                if (edge.label) {
                  const seg0 = wp[0], seg1 = wp[1];
                  labelX = (seg0[0] + seg1[0]) / 2;
                  labelY = (seg0[1] + seg1[1]) / 2;
                  const dx = seg1[0] - seg0[0];
                  const dy = seg1[1] - seg0[1];
                  if (Math.abs(dx) > Math.abs(dy)) {
                    labelY -= 10; // horizontal: label above
                  } else if (edge.labelSide === "left") {
                    labelX -= 14; // vertical: label to the left
                  } else {
                    labelX += 14; // vertical: label to the right
                  }
                }

                return (
                  <g key={i}>
                    <path d={pathD} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                    {renderArrowhead(last[0], last[1], angle)}
                    {edge.label && (
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="500"
                        fill="hsl(var(--muted-foreground))"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const isSelected = node.id === selectedId;
                const ncx = cx(node);
                const ncy = cy(node);

                // ── Start Event ──
                if (node.type === "start") {
                  return (
                    <g key={node.id} className="cursor-pointer" onClick={() => setSelectedId(node.id)}>
                      <circle
                        cx={ncx} cy={ncy} r={18}
                        fill="hsl(var(--background))"
                        stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                        strokeWidth={isSelected ? 2.5 : 2}
                      />
                      {node.label.split("\n").map((line, li) => (
                        <text key={li} x={ncx} y={ncy + 28 + li * 13} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">
                          {line}
                        </text>
                      ))}
                    </g>
                  );
                }

                // ── End Event (thick border) ──
                if (node.type === "end") {
                  return (
                    <g key={node.id} className="cursor-pointer" onClick={() => setSelectedId(node.id)}>
                      <circle
                        cx={ncx} cy={ncy} r={18}
                        fill="hsl(var(--background))"
                        stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                        strokeWidth={3.5}
                      />
                      {node.label.split("\n").map((line, li) => (
                        <text key={li} x={ncx} y={ncy + 28 + li * 13} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">
                          {line}
                        </text>
                      ))}
                    </g>
                  );
                }

                // ── End Event Terminate (filled) ──
                if (node.type === "end-terminate") {
                  return (
                    <g key={node.id} className="cursor-pointer" onClick={() => setSelectedId(node.id)}>
                      <circle
                        cx={ncx} cy={ncy} r={18}
                        fill="hsl(var(--muted-foreground))"
                        stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                        strokeWidth={3}
                      />
                      {node.label.split("\n").map((line, li) => (
                        <text key={li} x={ncx} y={ncy + 28 + li * 13} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">
                          {line}
                        </text>
                      ))}
                    </g>
                  );
                }

                // ── Exclusive Gateway (X) ──
                if (node.type === "gateway-x") {
                  const s = node.w / 2;
                  const points = `${ncx},${ncy - s} ${ncx + s},${ncy} ${ncx},${ncy + s} ${ncx - s},${ncy}`;
                  return (
                    <g key={node.id} className="cursor-pointer" onClick={() => setSelectedId(node.id)}>
                      <polygon
                        points={points}
                        fill="hsl(var(--background))"
                        stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                        strokeWidth={isSelected ? 2 : 1.5}
                      />
                      {/* X symbol */}
                      <line x1={ncx - 7} y1={ncy - 7} x2={ncx + 7} y2={ncy + 7} stroke="hsl(var(--muted-foreground))" strokeWidth="2.5" />
                      <line x1={ncx + 7} y1={ncy - 7} x2={ncx - 7} y2={ncy + 7} stroke="hsl(var(--muted-foreground))" strokeWidth="2.5" />
                      {/* Label above */}
                      {node.label && node.label.split("\n").map((line, li, arr) => (
                        <text
                          key={li}
                          x={ncx}
                          y={ncy - s - 8 - (arr.length - 1 - li) * 12}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="500"
                          fill="hsl(var(--muted-foreground))"
                        >
                          {line}
                        </text>
                      ))}
                    </g>
                  );
                }

                // ── Parallel / Merge Gateway (+) ──
                if (node.type === "gateway-plus") {
                  const s = node.w / 2;
                  const points = `${ncx},${ncy - s} ${ncx + s},${ncy} ${ncx},${ncy + s} ${ncx - s},${ncy}`;
                  return (
                    <g key={node.id} className="cursor-pointer" onClick={() => setSelectedId(node.id)}>
                      <polygon
                        points={points}
                        fill="hsl(var(--background))"
                        stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                        strokeWidth={isSelected ? 2 : 1.5}
                      />
                      {/* + symbol */}
                      <line x1={ncx - 8} y1={ncy} x2={ncx + 8} y2={ncy} stroke="hsl(var(--muted-foreground))" strokeWidth="2.5" />
                      <line x1={ncx} y1={ncy - 8} x2={ncx} y2={ncy + 8} stroke="hsl(var(--muted-foreground))" strokeWidth="2.5" />
                    </g>
                  );
                }

                // ── Task (rounded rectangle) ──
                return (
                  <g key={node.id} className="cursor-pointer" onClick={() => setSelectedId(node.id)}>
                    <rect
                      x={node.x} y={node.y} width={node.w} height={node.h}
                      rx={7}
                      fill={isSelected ? "hsl(var(--primary) / 0.08)" : "hsl(var(--background))"}
                      stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    {node.label.split("\n").map((line, li, arr) => (
                      <text
                        key={li}
                        x={node.x + node.w / 2}
                        y={node.y + node.h / 2 + (li - (arr.length - 1) / 2) * 15}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="11"
                        fontWeight="500"
                        fill="hsl(var(--foreground))"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Properties panel */}
        {selected && selected.type === "task" && (
          <div className="w-[280px] border-l border-border p-4 space-y-5 bg-card overflow-auto">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Step Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Name</Label>
                  {isEditMode ? (
                    <Input defaultValue={selected.label.replace(/\n/g, " ")} key={selected.id + "-name"} className="text-sm h-8" />
                  ) : (
                    <p className="text-sm text-foreground">{selected.label.replace(/\n/g, " ")}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  {isEditMode ? (
                    <Textarea defaultValue={selected.desc || ""} key={selected.id + "-desc"} className="text-sm min-h-[80px]" />
                  ) : (
                    <p className="text-sm text-foreground">{selected.desc || "—"}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Responsible</Label>
                  {isEditMode ? (
                    <Select defaultValue={selected.responsible?.toLowerCase().replace(/ /g, "-") || "procurement-analyst"} key={selected.id + "-resp"}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="procurement-analyst">Procurement Analyst</SelectItem>
                        <SelectItem value="budget-owner">Budget Owner</SelectItem>
                        <SelectItem value="department-head">Department Head</SelectItem>
                        <SelectItem value="system-(auto)">System (Auto)</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-foreground">{selected.responsible || "—"}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">SLA (hours)</Label>
                  {isEditMode ? (
                    <Input type="number" defaultValue={selected.sla ?? 4} key={selected.id + "-sla"} className="text-sm h-8" />
                  ) : (
                    <p className="text-sm text-foreground">{selected.sla ?? "—"}h</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
