import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Canvas as FabricCanvas,
  Rect,
  Circle,
  Line,
  FabricText,
  Group,
  FabricObject,
  Polygon,
} from "fabric";
import { BPMNElement, BPMNConnection, BPMNElementType, BPMNPhase, EditorMode } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

// Extend FabricObject to include custom data
interface CustomFabricObject extends FabricObject {
  customData?: { id: string; type: string };
}

interface BPMNCanvasProps {
  mode: EditorMode;
  elements: BPMNElement[];
  connections: BPMNConnection[];
  phases?: BPMNPhase[];
  zoom: number;
  onElementsChange: (elements: BPMNElement[]) => void;
  onConnectionsChange: (connections: BPMNConnection[]) => void;
  onSelectionChange: (elementId: string | null) => void;
  selectedElementId: string | null;
}

const GRID_SIZE = 20;
const MIN_CANVAS_WIDTH = 1100;
const MIN_CANVAS_HEIGHT = 960;

// Default phase definitions (fallback)
const DEFAULT_PHASES: BPMNPhase[] = [
  { id: 1, label: "[1] ANÁLISE INICIAL", y: 120, height: 180, color: "#E8F5E9" },
  { id: 2, label: "[2] CÁLCULO DO FRETE", y: 320, height: 250, color: "#E3F2FD" },
  { id: 3, label: "[3] COMPARAÇÃO & SELEÇÃO", y: 590, height: 200, color: "#FFF8E1" },
  { id: 4, label: "[4] REGISTRO & FINALIZAÇÃO", y: 810, height: 120, color: "#FCE4EC" },
];

function getElementDimensions(type: BPMNElementType): { width: number; height: number } {
  if (type.includes("event")) {
    return { width: 40, height: 40 };
  }
  if (type.includes("gateway")) {
    return { width: 50, height: 50 };
  }
  if (type === "task" || type.includes("task")) {
    return { width: 120, height: 60 };
  }
  if (type === "sub-process" || type === "call-activity") {
    return { width: 140, height: 80 };
  }
  if (type === "data-object" || type === "data-store") {
    return { width: 40, height: 50 };
  }
  if (type === "text-annotation") {
    return { width: 100, height: 40 };
  }
  if (type === "group") {
    return { width: 200, height: 150 };
  }
  if (type === "pool") {
    return { width: 600, height: 200 };
  }
  if (type === "lane") {
    return { width: 500, height: 100 };
  }
  return { width: 100, height: 60 };
}

function createFabricElement(element: BPMNElement): FabricObject | null {
  const {
    type,
    x,
    y,
    width,
    height,
    label,
    fillColor = "#FFFFFF",
    strokeColor = "#1976D2",
  } = element;

  let shape: FabricObject;

  // Events - Circles
  if (type.includes("event")) {
    const isEnd = type.includes("end");
    const isIntermediate = type === "intermediate-event";

    shape = new Circle({
      radius: width / 2,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: isEnd ? 4 : isIntermediate ? 3 : 2,
      originX: "center",
      originY: "center",
      shadow: {
        color: "rgba(0,0,0,0.08)",
        blur: 4,
        offsetX: 0,
        offsetY: 2,
      } as any,
    });
  }
  // Gateways - Diamonds
  else if (type.includes("gateway")) {
    shape = new Rect({
      width: width * 0.7,
      height: height * 0.7,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: 2,
      angle: 45,
      originX: "center",
      originY: "center",
      shadow: {
        color: "rgba(0,0,0,0.08)",
        blur: 4,
        offsetX: 0,
        offsetY: 2,
      } as any,
    });
  }
  // Activities - Rounded Rectangles
  else if (type.includes("task") || type === "sub-process" || type === "call-activity") {
    shape = new Rect({
      width,
      height,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: 2,
      rx: 8,
      ry: 8,
      originX: "center",
      originY: "center",
      shadow: {
        color: "rgba(0,0,0,0.08)",
        blur: 4,
        offsetX: 0,
        offsetY: 2,
      } as any,
    });
  }
  // Data Objects
  else if (type === "data-object" || type === "data-store") {
    shape = new Rect({
      width,
      height,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: 1,
      originX: "center",
      originY: "center",
    });
  }
  // Text Annotation
  else if (type === "text-annotation") {
    shape = new Rect({
      width,
      height,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      strokeDashArray: [5, 3],
      originX: "center",
      originY: "center",
    });
  }
  // Group
  else if (type === "group") {
    shape = new Rect({
      width,
      height,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      strokeDashArray: [10, 5],
      rx: 10,
      ry: 10,
      originX: "center",
      originY: "center",
    });
  }
  // Pools and Lanes
  else if (type === "pool" || type === "lane") {
    shape = new Rect({
      width,
      height,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: 2,
      originX: "center",
      originY: "center",
    });
  } else {
    shape = new Rect({
      width,
      height,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: 2,
      originX: "center",
      originY: "center",
    });
  }

  // Add label (word wrap for tasks)
  const maxLabelWidth = type.includes("task") ? width - 10 : width;
  const textLabel = new FabricText(label || "", {
    fontSize: 11,
    fontFamily: "Inter, system-ui, sans-serif",
    fill: "#272727",
    originX: "center",
    originY: "center",
    textAlign: "center",
    width: maxLabelWidth,
  });

  // Create group with shape and label
  const group = new Group([shape, textLabel], {
    left: x,
    top: y,
    originX: "center",
    originY: "center",
  }) as CustomFabricObject;

  group.customData = { id: element.id, type: element.type };

  return group;
}

function drawArrow(canvas: FabricCanvas, x1: number, y1: number, x2: number, y2: number) {
  const headlen = 10;
  const angle = Math.atan2(y2 - y1, x2 - x1);

  const arrowHead = new Polygon(
    [
      { x: 0, y: 0 },
      { x: -headlen, y: headlen / 2 },
      { x: -headlen, y: -headlen / 2 },
    ],
    {
      left: x2,
      top: y2,
      fill: "#1976D2",
      stroke: "#1976D2",
      strokeWidth: 1,
      angle: (angle * 180) / Math.PI,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
    }
  );

  canvas.add(arrowHead);
}

export function BPMNCanvas({
  mode,
  elements,
  connections,
  phases,
  zoom,
  onElementsChange,
  onSelectionChange,
}: BPMNCanvasProps) {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const phaseList = phases && phases.length ? phases : DEFAULT_PHASES;

  const canvasSize = useMemo(() => {
    const paddingRight = 280; // legend + breathing room
    const paddingBottom = 140;

    const maxElX = elements.reduce((acc, el) => Math.max(acc, el.x + (el.width || 0) / 2), 0);
    const maxElY = elements.reduce((acc, el) => Math.max(acc, el.y + (el.height || 0) / 2), 0);
    const maxPhaseY = phaseList.reduce((acc, p) => Math.max(acc, p.y + p.height), 0);

    return {
      width: Math.max(MIN_CANVAS_WIDTH, Math.ceil(maxElX + paddingRight)),
      height: Math.max(MIN_CANVAS_HEIGHT, Math.ceil(Math.max(maxElY, maxPhaseY) + paddingBottom)),
    };
  }, [elements, phaseList]);

  // Space-to-pan in editor mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") setIsSpacePressed(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setIsSpacePressed(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const canPan = mode === "viewer" || isSpacePressed;

  const panStateRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const handlePanMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      if (!canPan) return;
      if (e.button !== 0) return;

      panStateRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        scrollLeft: containerRef.current.scrollLeft,
        scrollTop: containerRef.current.scrollTop,
      };
      setIsPanning(true);
      e.preventDefault();
    },
    [canPan]
  );

  const handlePanMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    if (!panStateRef.current.active) return;

    const dx = e.clientX - panStateRef.current.startX;
    const dy = e.clientY - panStateRef.current.startY;

    containerRef.current.scrollLeft = panStateRef.current.scrollLeft - dx;
    containerRef.current.scrollTop = panStateRef.current.scrollTop - dy;
  }, []);

  const handlePanMouseUp = useCallback(() => {
    if (!panStateRef.current.active) return;
    panStateRef.current.active = false;
    setIsPanning(false);
  }, []);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: MIN_CANVAS_WIDTH,
      height: MIN_CANVAS_HEIGHT,
      backgroundColor: "#FFFFFF",
      selection: mode === "editor",
    });

    fabricRef.current = canvas;

    return () => {
      canvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep canvas dimensions in sync with content bounds
  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.setWidth(canvasSize.width);
    fabricRef.current.setHeight(canvasSize.height);
    fabricRef.current.renderAll();
  }, [canvasSize.height, canvasSize.width]);

  // Update canvas mode
  useEffect(() => {
    if (!fabricRef.current) return;

    fabricRef.current.selection = mode === "editor";
    fabricRef.current.forEachObject((obj) => {
      const customObj = obj as CustomFabricObject;
      if (customObj.customData?.id) {
        obj.selectable = mode === "editor";
        obj.evented = mode === "editor";
      }
    });

    fabricRef.current.renderAll();
  }, [mode]);

  // Render diagram
  useEffect(() => {
    if (!fabricRef.current) return;

    // Clear canvas
    fabricRef.current.clear();
    fabricRef.current.backgroundColor = "#FFFFFF";

    // Draw phase backgrounds and labels
    phaseList.forEach((phase) => {
      const phaseBg = new Rect({
        left: 60,
        top: phase.y,
        width: canvasSize.width - 80,
        height: phase.height,
        fill: phase.color,
        stroke: "#E0E0E0",
        strokeWidth: 1,
        rx: 8,
        ry: 8,
        selectable: false,
        evented: false,
        opacity: 0.4,
      });
      fabricRef.current?.add(phaseBg);

      const phaseLabel = new FabricText(phase.label, {
        left: 25,
        top: phase.y + phase.height / 2,
        fontSize: 11,
        fontFamily: "Inter, system-ui, sans-serif",
        fontWeight: "600",
        fill: "#424242",
        angle: -90,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
      });
      fabricRef.current?.add(phaseLabel);
    });

    // Draw grid (subtle)
    for (let i = 0; i < canvasSize.width / GRID_SIZE; i++) {
      fabricRef.current.add(
        new Line([i * GRID_SIZE, 0, i * GRID_SIZE, canvasSize.height], {
          stroke: "#F5F5F5",
          strokeWidth: 1,
          selectable: false,
          evented: false,
        })
      );
    }
    for (let i = 0; i < canvasSize.height / GRID_SIZE; i++) {
      fabricRef.current.add(
        new Line([0, i * GRID_SIZE, canvasSize.width, i * GRID_SIZE], {
          stroke: "#F5F5F5",
          strokeWidth: 1,
          selectable: false,
          evented: false,
        })
      );
    }

    // Draw connections
    connections.forEach((connection) => {
      const sourceEl = elements.find((e) => e.id === connection.sourceId);
      const targetEl = elements.find((e) => e.id === connection.targetId);

      if (!sourceEl || !targetEl) return;

      let x1 = sourceEl.x;
      let y1 = sourceEl.y;
      let x2 = targetEl.x;
      let y2 = targetEl.y;

      const sourceWidth = sourceEl.width / 2;
      const sourceHeight = sourceEl.height / 2;
      const targetWidth = targetEl.width / 2;
      const targetHeight = targetEl.height / 2;

      if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
        if (x2 > x1) {
          x1 += sourceWidth;
          x2 -= targetWidth;
        } else {
          x1 -= sourceWidth;
          x2 += targetWidth;
        }
      } else {
        if (y2 > y1) {
          y1 += sourceHeight;
          y2 -= targetHeight;
        } else {
          y1 -= sourceHeight;
          y2 += targetHeight;
        }
      }

      const line = new Line([x1, y1, x2, y2], {
        stroke: "#1976D2",
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      fabricRef.current?.add(line);

      drawArrow(fabricRef.current!, x1, y1, x2, y2);

      if (connection.label) {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const labelBg = new Rect({
          left: midX,
          top: midY,
          width: connection.label.length * 7 + 10,
          height: 18,
          fill: "#FFFFFF",
          stroke: "#E0E0E0",
          strokeWidth: 1,
          rx: 4,
          ry: 4,
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
        });
        fabricRef.current?.add(labelBg);

        const labelText = new FabricText(connection.label, {
          left: midX,
          top: midY,
          fontSize: 10,
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: "500",
          fill: "#424242",
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
        });
        fabricRef.current?.add(labelText);
      }
    });

    // Add elements
    elements.forEach((element) => {
      const fabricElement = createFabricElement(element);
      if (fabricElement) {
        fabricRef.current?.add(fabricElement);
      }
    });

    // Legend (top-right of the *canvas*)
    const legendX = canvasSize.width - 200;
    const legendY = 20;

    const legendBg = new Rect({
      left: legendX - 10,
      top: legendY - 5,
      width: 180,
      height: 80,
      fill: "#FFFFFF",
      stroke: "#E0E0E0",
      strokeWidth: 1,
      rx: 6,
      ry: 6,
      selectable: false,
      evented: false,
      shadow: {
        color: "rgba(0,0,0,0.08)",
        blur: 4,
        offsetX: 0,
        offsetY: 2,
      } as any,
    });
    fabricRef.current?.add(legendBg);

    const legendTitle = new FabricText(language === "PT" ? "Legenda BPMN" : "BPMN Legend", {
      left: legendX,
      top: legendY + 5,
      fontSize: 10,
      fontFamily: "Inter, system-ui, sans-serif",
      fontWeight: "600",
      fill: "#424242",
      selectable: false,
      evented: false,
    });
    fabricRef.current?.add(legendTitle);

    const legendItems = [
      { shape: "circle", color: "#C8E6C9", border: "#388E3C", label: language === "PT" ? "Evento" : "Event" },
      { shape: "rect", color: "#E3F2FD", border: "#1976D2", label: language === "PT" ? "Tarefa" : "Task" },
      { shape: "diamond", color: "#FFF9C4", border: "#F57F17", label: language === "PT" ? "Gateway" : "Gateway" },
    ];

    legendItems.forEach((item, index) => {
      const itemY = legendY + 25 + index * 18;

      if (item.shape === "circle") {
        const circle = new Circle({
          left: legendX + 8,
          top: itemY,
          radius: 6,
          fill: item.color,
          stroke: item.border,
          strokeWidth: 2,
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
        });
        fabricRef.current?.add(circle);
      } else if (item.shape === "rect") {
        const rect = new Rect({
          left: legendX + 8,
          top: itemY,
          width: 16,
          height: 10,
          fill: item.color,
          stroke: item.border,
          strokeWidth: 1,
          rx: 2,
          ry: 2,
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
        });
        fabricRef.current?.add(rect);
      } else if (item.shape === "diamond") {
        const diamond = new Rect({
          left: legendX + 8,
          top: itemY,
          width: 10,
          height: 10,
          fill: item.color,
          stroke: item.border,
          strokeWidth: 1,
          angle: 45,
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
        });
        fabricRef.current?.add(diamond);
      }

      const labelText = new FabricText(item.label, {
        left: legendX + 25,
        top: itemY,
        fontSize: 9,
        fontFamily: "Inter, system-ui, sans-serif",
        fill: "#616161",
        originX: "left",
        originY: "center",
        selectable: false,
        evented: false,
      });
      fabricRef.current?.add(labelText);
    });

    fabricRef.current.renderAll();
  }, [canvasSize.height, canvasSize.width, connections, elements, language, phaseList]);

  // Handle zoom
  useEffect(() => {
    if (!fabricRef.current) return;
    const zoomFactor = zoom / 100;
    fabricRef.current.setZoom(zoomFactor);
    fabricRef.current.renderAll();
  }, [zoom]);

  // Selection handling
  useEffect(() => {
    if (!fabricRef.current) return;

    const handleSelection = (e: any) => {
      const selected = e.selected?.[0] as CustomFabricObject | undefined;
      if (selected?.customData?.id) {
        onSelectionChange(selected.customData.id);
      }
    };

    const handleDeselection = () => {
      onSelectionChange(null);
    };

    fabricRef.current.on("selection:created", handleSelection);
    fabricRef.current.on("selection:updated", handleSelection);
    fabricRef.current.on("selection:cleared", handleDeselection);

    return () => {
      fabricRef.current?.off("selection:created", handleSelection);
      fabricRef.current?.off("selection:updated", handleSelection);
      fabricRef.current?.off("selection:cleared", handleDeselection);
    };
  }, [onSelectionChange]);

  // Handle object movement
  useEffect(() => {
    if (!fabricRef.current || mode !== "editor") return;

    const handleObjectModified = (e: any) => {
      const target = e.target as CustomFabricObject;
      if (!target?.customData?.id) return;

      const updatedElements = elements.map((el) => {
        if (el.id === target.customData?.id) {
          return {
            ...el,
            x: target.left ?? el.x,
            y: target.top ?? el.y,
          };
        }
        return el;
      });

      onElementsChange(updatedElements);
    };

    fabricRef.current.on("object:modified", handleObjectModified);

    return () => {
      fabricRef.current?.off("object:modified", handleObjectModified);
    };
  }, [elements, onElementsChange, mode]);

  // Drag and drop from palette
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const elementType = e.dataTransfer.getData("bpmn-element-type") as BPMNElementType;
      if (!elementType || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (zoom / 100);
      const y = (e.clientY - rect.top) / (zoom / 100);

      const dimensions = getElementDimensions(elementType);
      const newElement: BPMNElement = {
        id: `element-${Date.now()}`,
        type: elementType,
        x: Math.round(x / GRID_SIZE) * GRID_SIZE,
        y: Math.round(y / GRID_SIZE) * GRID_SIZE,
        width: dimensions.width,
        height: dimensions.height,
        label: "",
      };

      onElementsChange([...elements, newElement]);
    },
    [elements, onElementsChange, zoom]
  );

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-auto bg-muted/20 ${canPan ? "cursor-grab" : ""} ${isPanning ? "cursor-grabbing" : ""}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseDown={handlePanMouseDown}
      onMouseMove={handlePanMouseMove}
      onMouseUp={handlePanMouseUp}
      onMouseLeave={handlePanMouseUp}
    >
      <div
        className="relative"
        style={{
          width: canvasSize.width * (zoom / 100),
          height: canvasSize.height * (zoom / 100),
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
