import React, { useEffect, useRef } from "react";
import BpmnViewer from "bpmn-js/lib/Viewer";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

interface BpmnIoViewerProps {
  xml: string;
}

export function BpmnIoViewer({ xml }: BpmnIoViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
        bindTo: window
      }
    });

    const loadBpmn = async () => {
      try {
        await viewer.importXML(xml);
        if (disposed) return;
        const canvas = viewer.get("canvas") as any;
        canvas.zoom("fit-viewport", "auto");
      } catch (err) {
        if (!disposed) {
          console.error("Failed to render BPMN", err);
        }
      }
    };

    loadBpmn();

    return () => {
      disposed = true;
      try {
        viewer.destroy();
      } catch {
        // Ignore cleanup errors on unmount
      }
      host.innerHTML = "";
    };
  }, [xml]);

  return (
    <div className="w-full h-full relative bg-white">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
