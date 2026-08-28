import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Version, VersionStatus } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface BPMNVersionSidebarProps {
  versions: Version[];
  selectedVersion: string;
  onSelectVersion: (id: string) => void;
  onAddVersion: () => void;
}

export function BPMNVersionSidebar({
  versions,
  selectedVersion,
  onSelectVersion,
  onAddVersion,
}: BPMNVersionSidebarProps) {
  const { language } = useLanguage();

  const getStatusLabel = (status: VersionStatus) => {
    if (language === "PT") {
      if (status === "Published") return "Publicada";
      if (status === "Draft") return "Rascunho";
      if (status === "Archived") return "Arquivada";
    }
    return status;
  };

  const getStatusStyles = (status: VersionStatus) => {
    switch (status) {
      case "Published":
        return "bg-[#D1FAE5] text-[#065F46]";
      case "Draft":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "Archived":
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="w-[280px] bg-versions border-r border-border flex flex-col h-full">
      <div className="p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-muted-foreground mb-3">
          {language === "PT" ? "VERSÕES" : "VERSIONS"}
        </h3>
        
        <div className="space-y-2">
          {versions.map((version) => {
            const isSelected = selectedVersion === version.id;
            
            return (
              <button
                key={version.id}
                onClick={() => onSelectVersion(version.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all relative",
                  isSelected
                    ? "bg-card border-2 border-primary"
                    : "bg-card border border-border hover:bg-muted/50 opacity-70 hover:opacity-100"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[15px] text-foreground">
                    {version.label}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {version.date}
                  </span>
                  <span className={cn(
                    "text-[11px] font-medium px-2 py-0.5 rounded",
                    getStatusStyles(version.status)
                  )}>
                    {getStatusLabel(version.status)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-border">
        <button
          onClick={onAddVersion}
          className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-muted-foreground/30 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all text-[13px] font-medium"
        >
          <Plus className="h-4 w-4" />
          {language === "PT" ? "Nova Versão" : "New Version"}
        </button>
      </div>
    </div>
  );
}
