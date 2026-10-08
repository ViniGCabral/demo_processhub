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
    if (!containerRef.current) return;

    const viewer = new BpmnViewer({
      container: containerRef.current,
      keyboard: {
        bindTo: window
      }
    });

    const loadBpmn = async () => {
      try {
        await viewer.importXML(xml);
        const canvas = viewer.get("canvas") as any;
        canvas.zoom("fit-viewport", "auto");
      } catch (err) {
        console.error("Failed to render BPMN", err);
      }
    };

    loadBpmn();

    return () => {
      viewer.destroy();
    };
  }, [xml]);

  return (
    <div className="w-full h-full relative bg-white">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
