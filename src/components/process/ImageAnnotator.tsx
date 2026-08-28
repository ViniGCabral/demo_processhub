import { useState, useRef, useCallback, useEffect } from "react";
import { 
  Square, ArrowUpRight, Eye, MousePointer, Trash2, X, Check, Undo2, 
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────
export interface Annotation {
  id: string;
  type: "rectangle" | "arrow" | "blur";
  x: number;
  y: number;
  width: number;
  height: number;
  endX?: number;
  endY?: number;
  color?: string;
  strokeWidth?: number;
}

type Tool = "select" | "rectangle" | "arrow" | "blur";

interface ImageAnnotatorProps {
  imageSrc: string;
  annotations: Annotation[];
  onAnnotationsChange: (annotations: Annotation[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  "hsl(0, 84%, 60%)",
  "hsl(221, 83%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(262, 83%, 58%)",
];

// ─── Draw annotations on canvas ──────────────────────────────────
function drawAnnotations(
  ctx: CanvasRenderingContext2D,
  annotations: Annotation[],
  scale: number
) {
  for (const ann of annotations) {
    const sx = ann.x * scale;
    const sy = ann.y * scale;
    const sw = ann.width * scale;
    const sh = ann.height * scale;
    const color = ann.color || COLORS[0];
    const lw = (ann.strokeWidth || 3) * scale;

    if (ann.type === "rectangle") {
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.setLineDash([]);
      ctx.strokeRect(sx, sy, sw, sh);
    } else if (ann.type === "arrow") {
      const ex = (ann.endX ?? ann.x) * scale;
      const ey = (ann.endY ?? ann.y) * scale;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lw;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      const angle = Math.atan2(ey - sy, ex - sx);
      const headLen = 14 * scale;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - headLen * Math.cos(angle - Math.PI / 6), ey - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(ex - headLen * Math.cos(angle + Math.PI / 6), ey - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    } else if (ann.type === "blur") {
      const region = ctx.getImageData(sx, sy, Math.max(1, sw), Math.max(1, sh));
      const pxSize = Math.max(8, Math.round(12 * scale));
      for (let py = 0; py < region.height; py += pxSize) {
        for (let px = 0; px < region.width; px += pxSize) {
          const i = (py * region.width + px) * 4;
          const r = region.data[i], g = region.data[i + 1], b = region.data[i + 2];
          for (let dy = 0; dy < pxSize && py + dy < region.height; dy++) {
            for (let dx = 0; dx < pxSize && px + dx < region.width; dx++) {
              const j = ((py + dy) * region.width + (px + dx)) * 4;
              region.data[j] = r;
              region.data[j + 1] = g;
              region.data[j + 2] = b;
            }
          }
        }
      }
      ctx.putImageData(region, sx, sy);
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 1 * scale;
      ctx.setLineDash([4 * scale, 4 * scale]);
      ctx.strokeRect(sx, sy, sw, sh);
      ctx.setLineDash([]);
    }
  }
}

// ─── View-only annotated image ───────────────────────────────────
export function AnnotatedImage({
  imageSrc,
  annotations,
  className,
}: {
  imageSrc: string;
  annotations: Annotation[];
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      if (annotations.length > 0) {
        drawAnnotations(ctx, annotations, 1);
      }
    };
    img.src = imageSrc;
  }, [imageSrc, annotations]);

  if (annotations.length === 0) {
    return (
      <img
        src={imageSrc}
        alt="Step illustration"
        className={cn("w-full rounded-lg border border-border/60 shadow-sm", className)}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full rounded-lg border border-border/60 shadow-sm", className)}
      style={{ display: "block" }}
    />
  );
}

// ─── Annotator Canvas (inner component) ──────────────────────────
function AnnotatorCanvas({
  imageSrc,
  annotations,
  setAnnotations,
  tool,
  color,
  selectedId,
  setSelectedId,
  history,
  setHistory,
}: {
  imageSrc: string;
  annotations: Annotation[];
  setAnnotations: (a: Annotation[]) => void;
  tool: Tool;
  color: string;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  history: Annotation[][];
  setHistory: React.Dispatch<React.SetStateAction<Annotation[][]>>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentPoint, setCurrentPoint] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);

  // Load image
  useEffect(() => {
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imgRef.current = img;
        // Use viewport dimensions for reliable sizing (container may not have height yet)
        const maxW = window.innerWidth * 0.85;
        const maxH = window.innerHeight * 0.72;
        const s = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
        setScale(s);
        canvas.width = img.naturalWidth * s;
        canvas.height = img.naturalHeight * s;
        setReady(true);
      };
      img.src = imageSrc;
    }, 150);
    return () => clearTimeout(timer);
  }, [imageSrc]);

  // Redraw
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !ready) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawAnnotations(ctx, annotations, scale);

    if (selectedId) {
      const sel = annotations.find(a => a.id === selectedId);
      if (sel) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        if (sel.type === "arrow") {
          const ex = (sel.endX ?? sel.x) * scale;
          const ey = (sel.endY ?? sel.y) * scale;
          ctx.strokeRect(
            Math.min(sel.x * scale, ex) - 4, Math.min(sel.y * scale, ey) - 4,
            Math.abs(ex - sel.x * scale) + 8, Math.abs(ey - sel.y * scale) + 8
          );
        } else {
          ctx.strokeRect(sel.x * scale - 4, sel.y * scale - 4, sel.width * scale + 8, sel.height * scale + 8);
        }
        ctx.setLineDash([]);
      }
    }
  }, [annotations, scale, selectedId, ready]);

  useEffect(() => { redraw(); }, [redraw]);

  // Live preview
  useEffect(() => {
    if (!drawing || !ready) return;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawAnnotations(ctx, annotations, scale);

    const sx = startPoint.x * scale, sy = startPoint.y * scale;
    const cx = currentPoint.x * scale, cy = currentPoint.y * scale;

    if (tool === "rectangle") {
      ctx.strokeStyle = color; ctx.lineWidth = 3 * scale; ctx.setLineDash([]);
      ctx.strokeRect(sx, sy, cx - sx, cy - sy);
    } else if (tool === "arrow") {
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3 * scale; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(cx, cy); ctx.stroke();
      const angle = Math.atan2(cy - sy, cx - sx); const hl = 14 * scale;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx - hl * Math.cos(angle - Math.PI / 6), cy - hl * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(cx - hl * Math.cos(angle + Math.PI / 6), cy - hl * Math.sin(angle + Math.PI / 6));
      ctx.closePath(); ctx.fill();
    } else if (tool === "blur") {
      ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.strokeRect(sx, sy, cx - sx, cy - sy); ctx.setLineDash([]);
      ctx.fillStyle = "rgba(0,0,0,0.15)"; ctx.fillRect(sx, sy, cx - sx, cy - sy);
    }
  }, [drawing, currentPoint, startPoint, tool, color, annotations, scale, ready]);

  const getCoords = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ready) return;
    if (tool === "select") {
      const pos = getCoords(e);
      const clicked = [...annotations].reverse().find(a => {
        if (a.type === "arrow") {
          return pos.x >= Math.min(a.x, a.endX ?? a.x) - 10 && pos.x <= Math.max(a.x, a.endX ?? a.x) + 10
            && pos.y >= Math.min(a.y, a.endY ?? a.y) - 10 && pos.y <= Math.max(a.y, a.endY ?? a.y) + 10;
        }
        return pos.x >= a.x && pos.x <= a.x + a.width && pos.y >= a.y && pos.y <= a.y + a.height;
      });
      setSelectedId(clicked?.id || null);
      return;
    }
    const pos = getCoords(e);
    setDrawing(true); setStartPoint(pos); setCurrentPoint(pos); setSelectedId(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => { if (drawing) setCurrentPoint(getCoords(e)); };

  const handleMouseUp = () => {
    if (!drawing) return;
    setDrawing(false);
    const x = Math.min(startPoint.x, currentPoint.x), y = Math.min(startPoint.y, currentPoint.y);
    const w = Math.abs(currentPoint.x - startPoint.x), h = Math.abs(currentPoint.y - startPoint.y);
    if (tool !== "arrow" && (w < 5 || h < 5)) return;
    if (tool === "arrow" && Math.hypot(w, h) < 10) return;

    const newAnn: Annotation = {
      id: `ann-${Date.now()}`, type: tool as "rectangle" | "arrow" | "blur",
      x: tool === "arrow" ? startPoint.x : x, y: tool === "arrow" ? startPoint.y : y,
      width: w, height: h,
      endX: tool === "arrow" ? currentPoint.x : undefined,
      endY: tool === "arrow" ? currentPoint.y : undefined,
      color: tool !== "blur" ? color : undefined, strokeWidth: 3,
    };
    const next = [...annotations, newAnn];
    setAnnotations(next);
    setHistory(prev => [...prev, next]);
  };

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full" style={{ minHeight: 300 }}>
      <canvas
        ref={canvasRef}
        className={cn(
          "rounded-lg shadow-sm border border-border/40",
          tool === "select" ? "cursor-default" : "cursor-crosshair",
          !ready && "opacity-0"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => drawing && handleMouseUp()}
      />
    </div>
  );
}

// ─── Main Annotator Dialog ───────────────────────────────────────
export function ImageAnnotator({
  imageSrc,
  annotations: initialAnnotations,
  onAnnotationsChange,
  isOpen,
  onClose,
}: ImageAnnotatorProps) {
  const { language } = useLanguage();

  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
  const [tool, setTool] = useState<Tool>("rectangle");
  const [color, setColor] = useState(COLORS[0]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<Annotation[][]>([initialAnnotations]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setAnnotations(initialAnnotations);
      setHistory([initialAnnotations]);
      setSelectedId(null);
      setTool("rectangle");
    }
  }, [isOpen]);

  const handleUndo = () => {
    if (history.length <= 1) return;
    const prev = history.slice(0, -1);
    setHistory(prev);
    setAnnotations(prev[prev.length - 1]);
    setSelectedId(null);
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    const next = annotations.filter(a => a.id !== selectedId);
    setAnnotations(next);
    setHistory(prev => [...prev, next]);
    setSelectedId(null);
  };

  const handleClearAll = () => {
    setAnnotations([]);
    setHistory(prev => [...prev, []]);
    setSelectedId(null);
  };

  const handleSave = () => {
    onAnnotationsChange(annotations);
    onClose();
  };

  const toolsList: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: "select", icon: <MousePointer className="h-4 w-4" />, label: language === "PT" ? "Selecionar" : "Select" },
    { id: "rectangle", icon: <Square className="h-4 w-4" />, label: language === "PT" ? "Retângulo" : "Rectangle" },
    { id: "arrow", icon: <ArrowUpRight className="h-4 w-4" />, label: language === "PT" ? "Seta" : "Arrow" },
    { id: "blur", icon: <Eye className="h-4 w-4" />, label: "Blur" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] p-0 gap-0 overflow-hidden [&>button]:hidden">
        <DialogTitle className="sr-only">
          {language === "PT" ? "Editar Imagem" : "Edit Image"}
        </DialogTitle>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card">
          <div className="flex items-center gap-1 flex-wrap">
            {toolsList.map(t => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                title={t.label}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors",
                  tool === t.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}

            <div className="w-px h-5 bg-border mx-1.5" />

            {(tool === "rectangle" || tool === "arrow") && (
              <>
                <div className="flex items-center gap-1">
                  <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 transition-transform",
                        color === c ? "border-foreground scale-125" : "border-transparent hover:scale-110"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="w-px h-5 bg-border mx-1.5" />
              </>
            )}

            <button onClick={handleUndo} disabled={history.length <= 1}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
              <Undo2 className="h-4 w-4" />
            </button>
            {selectedId && (
              <button onClick={handleDeleteSelected}
                className="p-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button onClick={handleClearAll} disabled={annotations.length === 0}
              className="px-2 py-1 rounded-md text-[12px] text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
              {language === "PT" ? "Limpar" : "Clear"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8">
              <X className="h-4 w-4 mr-1" />
              {language === "PT" ? "Cancelar" : "Cancel"}
            </Button>
            <Button variant="corporate" size="sm" onClick={handleSave} className="h-8">
              <Check className="h-4 w-4 mr-1" />
              {language === "PT" ? "Salvar" : "Save"}
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="p-4 bg-muted/30 flex-1" style={{ minHeight: "65vh", maxHeight: "80vh", overflow: "auto" }}>
          <AnnotatorCanvas
            imageSrc={imageSrc}
            annotations={annotations}
            setAnnotations={setAnnotations}
            tool={tool}
            color={color}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            history={history}
            setHistory={setHistory}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
