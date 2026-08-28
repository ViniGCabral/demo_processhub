"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  proximity?: number;
  className?: string;
  disabled?: boolean;
  borderWidth?: number;
  glowColor?: string;
  glowSize?: number;
}

const GlowingEffect = memo(
  ({
    proximity = 64,
    className,
    borderWidth = 2,
    disabled = false,
    glowColor = "rgba(12, 27, 168, 0.4)",
    glowSize = 16,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e: PointerEvent) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();

          const active =
            e.clientX > left - proximity &&
            e.clientX < left + width + proximity &&
            e.clientY > top - proximity &&
            e.clientY < top + height + proximity;

          setIsActive(active);
        });
      },
      [proximity]
    );

    useEffect(() => {
      if (disabled) return;

      const handler = (e: PointerEvent) => handleMove(e);
      document.addEventListener("pointermove", handler, { passive: true });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        document.removeEventListener("pointermove", handler);
      };
    }, [handleMove, disabled]);

    if (disabled) return null;

    return (
      <div
        ref={containerRef}
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] transition-all duration-300",
          className
        )}
        style={{
          boxShadow: isActive
            ? `0 0 ${glowSize}px ${glowColor}, inset 0 0 ${glowSize}px ${glowColor}`
            : "none",
          border: isActive
            ? `${borderWidth}px solid rgba(12, 27, 168, 0.5)`
            : `${borderWidth}px solid transparent`,
        }}
      />
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };
