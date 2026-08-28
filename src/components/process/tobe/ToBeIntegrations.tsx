import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, X, Search, Filter } from "lucide-react";
import { ViewEditToggle } from "./ViewEditToggle";

interface PayloadField {
  name: string;
  dataType: string;
}

interface Integration {
  id: string;
  system: string;
  integrationName: string;
  description: string;
  triggeredAt: string;
  type: string;
  sent: PayloadField[];
  received: PayloadField[];
}

const initialIntegrations: Integration[] = [
  {
    id: "1",
    system: "SAP ERP",
    integrationName: "Material & requester validation",
    description: "Checks whether the requested material exists in SAP and whether the requester has permission to request it. Triggered at the Auto-Validate Request Data step.",
    triggeredAt: "Auto-Validate Request Data",
    type: "GET / Read",
    sent: [
      { name: "Material code", dataType: "string" },
      { name: "Requester employee ID", dataType: "string" },
    ],
    received: [
      { name: "Material exists", dataType: "boolean" },
      { name: "Requester has permission", dataType: "boolean" },
      { name: "Validation error message", dataType: "string" },
    ],
  },
  {
    id: "2",
    system: "SAP ERP",
    integrationName: "Material master data lookup",
    description: "Retrieves full material details from SAP master data to pre-fill and enrich the purchase request form fields. Triggered at the Enrich from Master Data step.",
    triggeredAt: "Enrich from Master Data",
    type: "GET / Read",
    sent: [
      { name: "Material code", dataType: "string" },
      { name: "Plant location", dataType: "string" },
    ],
    received: [
      { name: "Material description", dataType: "string" },
      { name: "Unit price", dataType: "decimal" },
      { name: "Material category", dataType: "string" },
      { name: "Unit of measure", dataType: "string" },
      { name: "Stock level", dataType: "number" },
    ],
  },
  {
    id: "3",
    system: "Workday",
    integrationName: "Requester spending limit check",
    description: "Fetches the requester's spending limit and available budget from Workday to confirm whether the request qualifies for auto-approval (≤ $5K threshold).",
    triggeredAt: "Auto-Approve Request",
    type: "GET / Read",
    sent: [
      { name: "Requester employee ID", dataType: "string" },
      { name: "Cost center", dataType: "string" },
    ],
    received: [
      { name: "Spending limit", dataType: "decimal" },
      { name: "Budget available", dataType: "decimal" },
      { name: "Approval level", dataType: "string" },
    ],
  },
  {
    id: "4",
    system: "SAP ERP",
    integrationName: "Purchase order creation",
    description: "Creates the purchase order in SAP once the request has been approved, either automatically or by the manager. Returns the generated PO number.",
    triggeredAt: "Create Purchase Order",
    type: "POST / Write",
    sent: [
      { name: "Material code", dataType: "string" },
      { name: "Quantity", dataType: "number" },
      { name: "Cost center", dataType: "string" },
      { name: "Requester employee ID", dataType: "string" },
      { name: "Total value", dataType: "decimal" },
    ],
    received: [
      { name: "Purchase order number", dataType: "string" },
      { name: "PO creation status", dataType: "string" },
      { name: "Expected delivery date", dataType: "date" },
    ],
  },
  {
    id: "5",
    system: "Microsoft Graph API",
    integrationName: "Requester status notification",
    description: "Sends an email to the requester via Microsoft Graph (Outlook) informing them that the process is complete and providing the generated purchase order number.",
    triggeredAt: "Send Notification",
    type: "POST / Write",
    sent: [
      { name: "Requester email", dataType: "string" },
      { name: "Purchase order number", dataType: "string" },
      { name: "Request status", dataType: "string" },
      { name: "Expected delivery date", dataType: "date" },
    ],
    received: [
      { name: "Message delivery status", dataType: "string" },
      { name: "Message ID", dataType: "string" },
    ],
  },
];

let nextId = 6;

export function ToBeIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newSent, setNewSent] = useState<Record<string, string>>({});
  const [newReceived, setNewReceived] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [systemFilter, setSystemFilter] = useState("all");

  const uniqueSystems = useMemo(() => {
    const systems = new Set(integrations.map(i => i.system).filter(Boolean));
    return Array.from(systems).sort();
  }, [integrations]);

  const filteredIntegrations = useMemo(() => {
    return integrations.filter(i => {
      if (systemFilter !== "all" && i.system !== systemFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        i.integrationName.toLowerCase().includes(q) ||
        i.system.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.triggeredAt.toLowerCase().includes(q) ||
        i.sent.some(f => f.name.toLowerCase().includes(q)) ||
        i.received.some(f => f.name.toLowerCase().includes(q))
      );
    });
  }, [integrations, searchQuery, systemFilter]);

  const update = (id: string, key: keyof Integration, value: any) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i));
  };

  const addIntegration = () => {
    setIntegrations(prev => [...prev, { id: String(nextId++), system: "", integrationName: "", description: "", triggeredAt: "", type: "GET / Read", sent: [], received: [] }]);
  };

  const removeIntegration = (id: string) => {
    setIntegrations(prev => prev.filter(i => i.id !== id));
  };

  const addPayloadItem = (intId: string, key: "sent" | "received") => {
    const stateMap = key === "sent" ? newSent : newReceived;
    const setStateMap = key === "sent" ? setNewSent : setNewReceived;
    const val = (stateMap[intId] || "").trim();
    if (!val) return;
    setIntegrations(prev => prev.map(i => i.id === intId ? { ...i, [key]: [...i[key], { name: val, dataType: "string" }] } : i));
    setStateMap(prev => ({ ...prev, [intId]: "" }));
  };

  const removePayloadItem = (intId: string, key: "sent" | "received", index: number) => {
    setIntegrations(prev => prev.map(i => i.id === intId ? { ...i, [key]: i[key].filter((_, idx) => idx !== index) } : i));
  };

  const typeVariant = (type: string) => type.includes("POST") ? "default" as const : "secondary" as const;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-8 py-3 flex items-center justify-between">
        <ViewEditToggle isEditMode={isEditMode} onToggle={setIsEditMode} />
        {isEditMode && (
          <Button size="sm" variant="outline" className="gap-2" onClick={addIntegration}>
            <Plus className="h-3.5 w-3.5" />
            Add Integration
          </Button>
        )}
      </div>

      <div className="p-6 overflow-auto">
        <h2 className="text-lg font-semibold text-foreground mb-1">Integrations</h2>
        <p className="text-sm text-muted-foreground mb-4">External systems connected to the TO-BE process.</p>

        {/* Search bar + system filter */}
        <div className="flex items-start gap-3 mb-5">
          <div className="max-w-sm flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search integrations..."
                className="text-sm h-9 pl-8 pr-8 bg-muted/30 border-border"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 px-0.5">{filteredIntegrations.length} of {integrations.length} integrations</p>
          </div>
          <Select value={systemFilter} onValueChange={setSystemFilter}>
            <SelectTrigger className="h-9 w-[180px] text-sm border-border bg-muted/30">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="All systems" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All systems</SelectItem>
              {uniqueSystems.map(sys => (
                <SelectItem key={sys} value={sys}>{sys}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredIntegrations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground/70 italic">No integrations match your search.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration) => (
            <Card key={integration.id} className="border-border">
              <CardHeader className="pb-3">
                {/* Row 1: Integration name (prominent) + method badge */}
                <div className="flex items-start justify-between gap-2">
                  {isEditMode ? (
                    <Input value={integration.integrationName} onChange={e => update(integration.id, "integrationName", e.target.value)} placeholder="Integration name..." className="text-sm h-8 font-semibold" />
                  ) : (
                    <span className="text-sm font-semibold text-foreground">{integration.integrationName}</span>
                  )}
                  <div className="flex items-center gap-1 shrink-0">
                    {isEditMode ? (
                      <Select value={integration.type} onValueChange={v => update(integration.id, "type", v)}>
                        <SelectTrigger className="h-7 text-[11px] w-auto min-w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET / Read">GET / Read</SelectItem>
                          <SelectItem value="POST / Write">POST / Write</SelectItem>
                          <SelectItem value="PUT / Update">PUT / Update</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={typeVariant(integration.type)} className="text-[11px]">{integration.type}</Badge>
                    )}
                    {isEditMode && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeIntegration(integration.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Description + system + triggered at */}
                <div className="mt-2 space-y-1.5">
                  {isEditMode ? (
                    <>
                      <Input
                        value={integration.description}
                        onChange={e => update(integration.id, "description", e.target.value)}
                        placeholder="Description..."
                        className="text-xs h-7"
                      />
                      <Input
                        value={integration.system}
                        onChange={e => update(integration.id, "system", e.target.value)}
                        placeholder="System name..."
                        className="text-xs h-7"
                      />
                      <Input
                        value={integration.triggeredAt}
                        onChange={e => update(integration.id, "triggeredAt", e.target.value)}
                        placeholder="Triggered at step..."
                        className="text-xs h-7"
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground leading-relaxed">{integration.description}</p>
                      <div className="flex items-center gap-3 pt-0.5">
                        <p className="text-[11px] text-muted-foreground/70">
                          <span className="font-medium text-muted-foreground">System:</span> {integration.system}
                        </p>
                        {integration.triggeredAt && (
                          <p className="text-[11px] text-muted-foreground/70">
                            <span className="font-medium text-muted-foreground">Triggered at:</span> {integration.triggeredAt}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payload Sent */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Payload Sent</p>
                  <ul className="space-y-1 mb-2">
                    {integration.sent.map((field, idx) => (
                      <li key={idx} className="text-xs text-foreground bg-muted/50 px-2 py-1 rounded flex items-center justify-between">
                        <span>{field.name}</span>
                        <span className="flex items-center gap-1.5">
                          <span className="text-muted-foreground text-[10px]">{field.dataType}</span>
                          {isEditMode && (
                            <button onClick={() => removePayloadItem(integration.id, "sent", idx)} className="text-muted-foreground hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {isEditMode && (
                    <div className="flex gap-1">
                      <Input
                        value={newSent[integration.id] || ""}
                        onChange={e => setNewSent(prev => ({ ...prev, [integration.id]: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && addPayloadItem(integration.id, "sent")}
                        placeholder="Field name"
                        className="text-xs h-7 flex-1"
                      />
                      <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => addPayloadItem(integration.id, "sent")}>+</Button>
                    </div>
                  )}
                </div>

                {/* Payload Received */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Payload Received</p>
                  <ul className="space-y-1 mb-2">
                    {integration.received.map((field, idx) => (
                      <li key={idx} className="text-xs text-foreground bg-muted/50 px-2 py-1 rounded flex items-center justify-between">
                        <span>{field.name}</span>
                        <span className="flex items-center gap-1.5">
                          <span className="text-muted-foreground text-[10px]">{field.dataType}</span>
                          {isEditMode && (
                            <button onClick={() => removePayloadItem(integration.id, "received", idx)} className="text-muted-foreground hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {isEditMode && (
                    <div className="flex gap-1">
                      <Input
                        value={newReceived[integration.id] || ""}
                        onChange={e => setNewReceived(prev => ({ ...prev, [integration.id]: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && addPayloadItem(integration.id, "received")}
                        placeholder="Field name"
                        className="text-xs h-7 flex-1"
                      />
                      <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => addPayloadItem(integration.id, "received")}>+</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
