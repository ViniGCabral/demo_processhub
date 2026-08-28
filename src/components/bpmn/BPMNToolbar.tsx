import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo,
  Redo,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorMode } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface BPMNToolbarProps {
  mode: EditorMode;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onDistribute: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
}

export function BPMNToolbar({
  mode,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onUndo,
  onRedo,
  onDelete,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onDistribute,
  canUndo,
  canRedo,
  hasSelection,
}: BPMNToolbarProps) {
  const { language } = useLanguage();
  const isEditor = mode === "editor";

  const buttonClass = cn(
    "p-1.5 rounded transition-colors",
    "hover:bg-muted text-muted-foreground hover:text-foreground"
  );

  const disabledClass = "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground";

  return (
    <div className="h-11 border-b border-border bg-muted/10 flex items-center justify-between px-3">
      <div className="flex items-center gap-1">
        {/* Zoom Controls */}
        <button
          onClick={onZoomOut}
          className={buttonClass}
          title={language === "PT" ? "Diminuir zoom" : "Zoom out"}
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="text-xs text-muted-foreground w-12 text-center font-medium">
          {zoom}%
        </span>
        <button
          onClick={onZoomIn}
          className={buttonClass}
          title={language === "PT" ? "Aumentar zoom" : "Zoom in"}
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={onZoomReset}
          className={buttonClass}
          title={language === "PT" ? "Ajustar à tela" : "Fit to view"}
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-border mx-2" />

        {/* Edit Controls - Only in Editor Mode */}
        {isEditor && (
          <>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={cn(buttonClass, !canUndo && disabledClass)}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={cn(buttonClass, !canRedo && disabledClass)}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </button>

            <div className="w-px h-4 bg-border mx-2" />

            <button
              onClick={onDelete}
              disabled={!hasSelection}
              className={cn(
                "p-1.5 rounded transition-colors",
                hasSelection
                  ? "text-destructive hover:bg-destructive/10"
                  : disabledClass
              )}
              title={language === "PT" ? "Excluir (Del)" : "Delete (Del)"}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Right Side - Alignment (Editor only) */}
      {isEditor && (
        <div className="flex items-center gap-1">
          <button
            onClick={onAlignLeft}
            disabled={!hasSelection}
            className={cn(buttonClass, !hasSelection && disabledClass)}
            title={language === "PT" ? "Alinhar à esquerda" : "Align left"}
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onAlignCenter}
            disabled={!hasSelection}
            className={cn(buttonClass, !hasSelection && disabledClass)}
            title={language === "PT" ? "Centralizar" : "Center"}
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            onClick={onAlignRight}
            disabled={!hasSelection}
            className={cn(buttonClass, !hasSelection && disabledClass)}
            title={language === "PT" ? "Alinhar à direita" : "Align right"}
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            onClick={onDistribute}
            disabled={!hasSelection}
            className={cn(buttonClass, !hasSelection && disabledClass)}
            title={language === "PT" ? "Distribuir horizontalmente" : "Distribute horizontally"}
          >
            <AlignVerticalJustifyCenter className="h-4 w-4 rotate-90" />
          </button>
        </div>
      )}

      {/* Info text for viewer mode */}
      {!isEditor && (
        <span className="text-xs text-muted-foreground">
          {language === "PT" ? "Arraste para navegar" : "Drag to navigate"}
        </span>
      )}
    </div>
  );
}
