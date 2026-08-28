import { Eye, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewEditToggleProps {
  isEditMode: boolean;
  onToggle: (edit: boolean) => void;
}

export function ViewEditToggle({ isEditMode, onToggle }: ViewEditToggleProps) {
  return (
    <div className="inline-flex border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => onToggle(false)}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 text-[13px] transition-colors",
          !isEditMode
            ? "bg-primary text-primary-foreground"
            : "bg-card text-muted-foreground hover:text-foreground"
        )}
      >
        <Eye className="h-4 w-4" />
        View
      </button>
      <button
        onClick={() => onToggle(true)}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 text-[13px] transition-colors",
          isEditMode
            ? "bg-primary text-primary-foreground"
            : "bg-card text-muted-foreground hover:text-foreground"
        )}
      >
        <Edit3 className="h-4 w-4" />
        Edit
      </button>
    </div>
  );
}
