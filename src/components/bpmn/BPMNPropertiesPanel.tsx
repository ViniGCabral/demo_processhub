import { MousePointer2, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BPMNElement } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BPMNPropertiesPanelProps {
  selectedElement: BPMNElement | null;
  onUpdateElement: (updates: Partial<BPMNElement>) => void;
  popSteps?: { id: string; title: string }[];
}

const colorPresets = [
  { id: "primary", color: "#0C1BA8", label: "Primary" },
  { id: "success", color: "#10B981", label: "Success" },
  { id: "warning", color: "#F59E0B", label: "Warning" },
  { id: "danger", color: "#EF4444", label: "Danger" },
  { id: "gray", color: "#6B7280", label: "Gray" },
  { id: "white", color: "#FFFFFF", label: "White" },
];

export function BPMNPropertiesPanel({
  selectedElement,
  onUpdateElement,
  popSteps = [],
}: BPMNPropertiesPanelProps) {
  const { language } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="w-8 bg-muted/30 border-l border-border flex items-center justify-center hover:bg-muted/50 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="w-[280px] bg-versions border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
          {language === "PT" ? "PROPRIEDADES" : "PROPERTIES"}
        </h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded hover:bg-muted/50 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {!selectedElement ? (
          <div className="text-center py-8 px-2">
            <MousePointer2 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {language === "PT"
                ? "Selecione um elemento para editar propriedades"
                : "Select an element to edit properties"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Label */}
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                {language === "PT" ? "Rótulo" : "Label"}
              </Label>
              <Input
                value={selectedElement.label || ""}
                onChange={(e) => onUpdateElement({ label: e.target.value })}
                placeholder={language === "PT" ? "Nome da atividade" : "Activity name"}
                className="h-8 text-sm"
              />
            </div>

            {/* Type (read-only) */}
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                {language === "PT" ? "Tipo" : "Type"}
              </Label>
              <div className="px-3 py-2 bg-muted/50 rounded-md text-sm text-muted-foreground">
                {selectedElement.type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
            </div>

            {/* Documentation */}
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                {language === "PT" ? "Documentação" : "Documentation"}
              </Label>
              <Textarea
                value={selectedElement.documentation || ""}
                onChange={(e) => onUpdateElement({ documentation: e.target.value })}
                placeholder={language === "PT" ? "Descreva o que faz..." : "Describe what it does..."}
                className="min-h-[72px] text-sm resize-none"
              />
            </div>

            {/* Colors */}
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                {language === "PT" ? "Cor de Fundo" : "Background Color"}
              </Label>
              <div className="flex gap-2 flex-wrap">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onUpdateElement({ fillColor: preset.color })}
                    className={cn(
                      "w-6 h-6 rounded border-2 transition-all",
                      selectedElement.fillColor === preset.color
                        ? "border-primary scale-110"
                        : "border-border hover:border-muted-foreground"
                    )}
                    style={{ backgroundColor: preset.color }}
                    title={preset.label}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                {language === "PT" ? "Cor da Borda" : "Border Color"}
              </Label>
              <div className="flex gap-2 flex-wrap">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onUpdateElement({ strokeColor: preset.color })}
                    className={cn(
                      "w-6 h-6 rounded border-2 transition-all",
                      selectedElement.strokeColor === preset.color
                        ? "border-primary scale-110"
                        : "border-border hover:border-muted-foreground"
                    )}
                    style={{ backgroundColor: preset.color }}
                    title={preset.label}
                  />
                ))}
              </div>
            </div>

            {/* POP Reference */}
            {popSteps.length > 0 && (
              <div>
                <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                  {language === "PT" ? "Referência POP" : "SOP Reference"}
                </Label>
                <Select
                  value={selectedElement.linkedPOPStep || "none"}
                  onValueChange={(value) =>
                    onUpdateElement({
                      linkedPOPStep: value === "none" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue
                      placeholder={
                        language === "PT" ? "Selecionar step" : "Select step"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {language === "PT" ? "Nenhum" : "None"}
                    </SelectItem>
                    {popSteps.map((step) => (
                      <SelectItem key={step.id} value={step.id}>
                        {step.id} - {step.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
