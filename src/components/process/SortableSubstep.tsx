import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface SortableSubstepProps {
  id: string;
  children: React.ReactNode;
  isEditMode: boolean;
}

export function SortableSubstep({ id, children, isEditMode }: SortableSubstepProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group/sortable-sub",
        isDragging && "opacity-50 z-50 shadow-lg"
      )}
    >
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-6 top-3 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50 transition-colors z-20 opacity-0 group-hover/sortable-sub:opacity-100"
          title="Arrastar para reordenar"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      {children}
    </div>
  );
}
