import { useState } from "react";
import { Upload, Sparkles, FileText, Check, Image, Bold, Italic, List, Heading, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSopStore, SOPData } from "@/stores/sopStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface POPEditorProps {
  hasPOP: boolean;
  processId?: string;
}

const mockVersions = [
  { id: "v3", label: "v3.0", date: "6 Jan, 2026", status: "Published" },
  { id: "v2", label: "v2.0", date: "20 Dez, 2025", status: "Draft" },
  { id: "v1", label: "v1.0", date: "1 Dez, 2025", status: "Archived" },
];

export function POPEditor({ hasPOP, processId = "1" }: POPEditorProps) {
  const { t, language } = useLanguage();
  const [showEditor, setShowEditor] = useState(hasPOP);
  const [selectedVersion, setSelectedVersion] = useState("v3");
  
  // Get the correct SOP data based on process ID
  const getSOP = useSopStore(state => state.getSOP);
  const currentSopData: SOPData = getSOP(processId) || { id: '', title: '', code: '', area: '', objective: '', steps: [] };
  const [steps, setSteps] = useState(currentSopData.steps);

  if (!showEditor) {
    return <POPEmptyState onUpload={() => setShowEditor(true)} onGenerate={() => setShowEditor(true)} />;
  }

  const currentVersion = mockVersions.find(v => v.id === selectedVersion);

  const getStatusLabel = (status: string) => {
    if (language === "PT") {
      if (status === "Published") return "Publicado";
      if (status === "Draft") return "Rascunho";
      if (status === "Archived") return "Arquivado";
    }
    return status;
  };

  return (
    <div className="flex h-full animate-fade-in">
      {/* Versioning Sidebar */}
      <div className="w-52 shrink-0 border-r border-border/50 bg-muted/20 p-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">{t.versions}</h3>
        <div className="space-y-0.5">
          {mockVersions.map((version) => (
            <button
              key={version.id}
              onClick={() => setSelectedVersion(version.id)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all",
                selectedVersion === version.id
                  ? "bg-card border border-border/60 shadow-sm"
                  : "hover:bg-card/50"
              )}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className={cn(
                  "font-medium",
                  selectedVersion === version.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {version.label}
                </span>
                {version.status === "Published" && (
                  <span className="flex items-center gap-1 text-xs text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{version.date}</span>
                <span className={cn(
                  "text-xs",
                  version.status === "Published" ? "text-primary" : "text-muted-foreground"
                )}>
                  · {getStatusLabel(version.status)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col bg-muted/30">
        {/* Minimal Top Toolbar */}
        <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="p-2 rounded hover:bg-muted transition-colors" title="Heading">
              <Heading className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="w-px h-4 bg-border/60 mx-1" />
            <button className="p-2 rounded hover:bg-muted transition-colors" title="Bold">
              <Bold className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded hover:bg-muted transition-colors" title="Italic">
              <Italic className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="w-px h-4 bg-border/60 mx-1" />
            <button className="p-2 rounded hover:bg-muted transition-colors" title="List">
              <List className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded hover:bg-muted transition-colors" title="Insert Image">
              <Image className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded hover:bg-muted transition-colors" title="Add Step">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
              {t.saveDraft}
            </Button>
            <Button variant="corporate" size="sm" className="h-8">
              {t.publish}
            </Button>
          </div>
        </div>

        {/* Document Canvas */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[720px] mx-auto">
            {/* Document Page */}
            <div className="bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] border border-border/40">
              {/* Document Header */}
              <div className="px-12 pt-12 pb-8 border-b border-border/40">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-md">{currentSopData.code}</span>
                  <span className="text-sm text-muted-foreground">{currentSopData.area}</span>
                </div>
                <h1 className="text-2xl font-medium text-foreground mb-2">
                  {currentSopData.title}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">{currentSopData.objective}</p>

                {/* Metadata - Discreet */}
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <div>
                    <span className="uppercase tracking-wide">{t.version}</span>
                    <span className="ml-2 text-foreground">{currentVersion?.label}</span>
                  </div>
                  <div>
                    <span className="uppercase tracking-wide">{t.lastUpdated}</span>
                    <span className="ml-2 text-foreground">{currentVersion?.date}</span>
                  </div>
                  <div>
                    <span className="uppercase tracking-wide">{t.status}</span>
                    <span className={cn(
                      "ml-2",
                      currentVersion?.status === "Published" ? "text-primary" : "text-foreground"
                    )}>
                      {currentVersion ? getStatusLabel(currentVersion.status) : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Body - Steps */}
              <div className="px-12 py-10">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6">
                  {t.procedureSteps}
                </h3>

                <div className="space-y-8">
                  {steps.map((step, index) => (
                    <div key={step.id} className="group">
                      <div className="flex gap-5">
                        {/* Step Number */}
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0 mt-0.5">
                          {index + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground mb-2">{step.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">{step.description}</p>

                          {/* Step Image */}
                          {step.image && (
                            <div className="w-full max-w-[560px]">
                              <img 
                                src={step.image} 
                                alt={step.title}
                                className="w-full rounded-lg border border-border/60 shadow-sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function POPEmptyState({ onUpload, onGenerate }: { onUpload: () => void; onGenerate: () => void }) {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-lg mx-auto py-20 animate-fade-in">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
          <FileText className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-medium text-foreground mb-2">{t.noDocument}</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {t.noDocumentDescription}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onUpload}
          className="group bg-card rounded-2xl border border-border/60 p-6 text-left hover:border-primary/40 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-muted/80 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
            <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-medium text-foreground mb-1">{t.uploadDocument}</h3>
          <p className="text-sm text-muted-foreground">
            {t.uploadExistingPop}
          </p>
        </button>

        <button
          onClick={onGenerate}
          className="group bg-card rounded-2xl border border-border/60 p-6 text-left hover:border-primary/40 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-muted/80 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
            <Sparkles className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-medium text-foreground mb-1">
            {language === "PT" ? "Gerar POP" : "Generate SOP"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t.generatePopDescription}
          </p>
        </button>
      </div>
    </div>
  );
}
