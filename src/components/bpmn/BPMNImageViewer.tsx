import { useRef, useState, useCallback, useEffect } from "react";
import { Move } from "lucide-react";

interface BPMNImageViewerProps {
  imageSrc: string;
  alt: string;
  zoom: number;
}

export function BPMNImageViewer({ imageSrc, alt, zoom }: BPMNImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setScrollPos({
      x: containerRef.current?.scrollLeft || 0,
      y: containerRef.current?.scrollTop || 0,
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    containerRef.current.scrollLeft = scrollPos.x - deltaX;
    containerRef.current.scrollTop = scrollPos.y - deltaY;
  }, [isDragging, startPos, scrollPos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Center the image on mount
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      // Small delay to ensure image is loaded
      setTimeout(() => {
        container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
        container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
      }, 100);
    }
  }, []);

  return (
    <div className="flex-1 relative overflow-hidden bg-slate-100">
      {/* Pan instruction hint */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 rounded-md border border-slate-700 shadow-sm">
        <Move className="h-3.5 w-3.5 text-slate-300" />
        <span className="text-xs text-slate-300">
          Arraste para navegar
        </span>
      </div>

      <div
        ref={containerRef}
        className="w-full h-full overflow-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ 
          scrollBehavior: isDragging ? 'auto' : 'smooth',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <div 
          className="min-w-max min-h-max flex items-center justify-center p-8"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left',
            transition: isDragging ? 'none' : 'transform 0.2s ease'
          }}
        >
          <img 
            src={imageSrc}
            alt={alt}
            className="max-w-none select-none shadow-xl rounded-lg border border-slate-300"
            draggable={false}
            style={{
              imageRendering: 'auto',
              WebkitFontSmoothing: 'antialiased',
            }}
          />
        </div>
      </div>
    </div>
  );
}
