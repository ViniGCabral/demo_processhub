import React, { useEffect, useRef } from "react";
import BpmnViewer from "bpmn-js/lib/Viewer";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

interface BpmnIoViewerProps {
  xml: string;
  highlightedElementId?: string | null;
  modifiedElementIds?: string[];
}

export function BpmnIoViewer({ xml, highlightedElementId, modifiedElementIds = [] }: BpmnIoViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    let disposed = false;
    host.innerHTML = "";
    const mountNode = document.createElement("div");
    mountNode.className = "w-full h-full";
    host.appendChild(mountNode);

    const viewer = new BpmnViewer({
      container: mountNode,
      keyboard: {
        bindTo: window,
      },
    });
    viewerRef.current = viewer;

    const loadBpmn = async () => {
      try {
        await viewer.importXML(xml);
        if (disposed) return;
        const canvas = viewer.get("canvas") as any;
        canvas.zoom("fit-viewport", "auto");

        // Apply markers for AI modified or highlighted elements
        modifiedElementIds.forEach((id) => {
          try {
            canvas.addMarker(id, "ai-bpmn-modified");
          } catch {
            // Element might not exist in current XML
          }
        });

        if (highlightedElementId) {
          try {
            canvas.addMarker(highlightedElementId, "ai-bpmn-focused");
          } catch {
            // Ignore if element not found
          }
        }
      } catch (err) {
        if (!disposed) {
          console.error("Failed to render BPMN", err);
        }
      }
    };

    loadBpmn();

    return () => {
      disposed = true;
      viewerRef.current = null;
      try {
        viewer.destroy();
      } catch {
        // Ignore cleanup errors on unmount
      }
      host.innerHTML = "";
    };
  }, [xml]);

  // Update markers dynamically when highlightedElementId or modifiedElementIds change
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    try {
      const canvas = viewer.get("canvas") as any;
      const elementRegistry = viewer.get("elementRegistry") as any;
      if (!canvas || !elementRegistry) return;

      elementRegistry.forEach((el: any) => {
        canvas.removeMarker(el.id, "ai-bpmn-focused");
        canvas.removeMarker(el.id, "ai-bpmn-modified");
      });

      modifiedElementIds.forEach((id) => {
        if (elementRegistry.get(id)) {
          canvas.addMarker(id, "ai-bpmn-modified");
        }
      });

      if (highlightedElementId && elementRegistry.get(highlightedElementId)) {
        canvas.addMarker(highlightedElementId, "ai-bpmn-focused");
      }
    } catch {
      // Viewer may still be importing XML
    }
  }, [highlightedElementId, modifiedElementIds]);

  return (
    <div className="w-full h-full relative bg-white">
      <style>{`
        .ai-bpmn-focused .djs-visual > :first-child {
          stroke: #EA580C !important;
          stroke-width: 3px !important;
          fill: #FFF7ED !important;
          filter: drop-shadow(0 0 10px rgba(234, 88, 12, 0.45));
        }
        .ai-bpmn-modified .djs-visual > :first-child {
          stroke: #10B981 !important;
          stroke-width: 2.5px !important;
          fill: #ECFDF5 !important;
        }
      `}</style>
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
