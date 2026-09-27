import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pencil,
  Plus,
  Download,
  Sparkles,
  ChevronDown,
  MousePointerClick,
  FileUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AIEditUploadModal } from "./AIEditUploadModal";
import { TaxonomyLevel } from "@/stores/taxonomyStore";

interface ArchitectureActionButtonsProps {
  /** Current level key (l1, l2, l3, l4) */
  levelKey: TaxonomyLevel;
  /** Current level display label */
  levelLabel: string;
  /** Node name (for toast/modal context) */
  nodeName: string;
  /** Child level display label (for Add button) */
  childLevelLabel?: string;
  /** Whether at leaf level (uses "Criar processo" label) */
  isLeafParent?: boolean;

  /** Callbacks */
  onEditManual?: () => void;
  onAddChild?: () => void;

  /** Layout direction */
  direction?: "row" | "column";

  /** Whether to show the Add button */
  showAdd?: boolean;
  /** Whether to show the Export button */
  showExport?: boolean;
  /** Whether to show the Edit button */
  showEdit?: boolean;
}

export function ArchitectureActionButtons({
  levelKey,
  levelLabel,
  nodeName,
  childLevelLabel,
  isLeafParent = false,
  onEditManual,
  onAddChild,
  direction = "column",
  showAdd = true,
  showExport = true,
  showEdit = true,
}: ArchitectureActionButtonsProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const [aiUploadOpen, setAiUploadOpen] = useState(false);

  const handleEditManual = () => {
    if (onEditManual) {
      onEditManual();
    } else {
      toast.info(
        pt
          ? `Edição manual de ${levelLabel} habilitada`
          : `Manual editing of ${levelLabel} enabled`
      );
    }
  };

  const handleExport = () => {
    toast.info(
      pt
        ? `Exportação da visão de ${levelLabel} em breve`
        : `${levelLabel} view export coming soon`
    );
  };

  const handleAddChild = () => {
    if (onAddChild) {
      onAddChild();
    } else {
      toast.info(
        pt
          ? `Adicionar ${childLevelLabel || "componente"}`
          : `Add ${childLevelLabel || "component"}`
      );
    }
  };

  const addLabel = isLeafParent
    ? pt
      ? "Criar processo"
      : "Create process"
    : pt
    ? `Adicionar ${childLevelLabel || ""}`
    : `Add ${childLevelLabel || ""}`;

  return (
    <>
      <div
        className={cn(
          "flex gap-2",
          direction === "column" ? "flex-col" : "flex-row items-center"
        )}
      >
        {/* ── Export Button (Mocked) ── */}
        {showExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-[11px] h-8 border-[#CFD7E6] text-[#4D5A72] hover:border-[#008B5C] hover:text-[#008B5C] w-full group/export transition-all duration-200"
          >
            <Download className="h-3 w-3 mr-1.5 group-hover/export:translate-y-[1px] transition-transform duration-200" />
            {pt ? "Exportar" : "Export"}
          </Button>
        )}

        {/* ── Edit Button (Dropdown: Manual | AI) ── */}
        {showEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] h-8 border-[#CFD7E6] text-[#1A2A48] hover:border-[#1327b9] hover:text-[#1327b9] w-full group/edit transition-all duration-200"
              >
                <Pencil className="h-3 w-3 mr-1.5" />
                {pt ? "Editar" : "Edit"}
                <ChevronDown className="h-3 w-3 ml-auto opacity-50 group-hover/edit:opacity-100 transition-opacity" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-[#DFE5EF] p-1">
              <DropdownMenuItem
                onClick={handleEditManual}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#F5F7FB] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F0F4FF] flex items-center justify-center shrink-0">
                  <MousePointerClick className="h-4 w-4 text-[#1327b9]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#15233B]">
                    {pt ? "Editar manualmente" : "Edit manually"}
                  </span>
                  <span className="text-[10px] text-[#71809A] leading-tight">
                    {pt
                      ? "Habilitar edição dos campos"
                      : "Enable field editing"}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-[#DFE5EF]/60" />
              <DropdownMenuItem
                onClick={() => setAiUploadOpen(true)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#F5F7FB] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1327b9]/10 to-[#7648E7]/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-[#1327b9]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#15233B] flex items-center gap-1.5">
                    {pt ? "Editar com IA" : "Edit with AI"}
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#1327b9] to-[#7648E7] text-white font-bold uppercase tracking-wider">
                      AI
                    </span>
                  </span>
                  <span className="text-[10px] text-[#71809A] leading-tight">
                    {pt
                      ? "Upload de transcrições e documentos"
                      : "Upload transcriptions & documents"}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* ── Add Child Button (Same dynamic style) ── */}
        {showAdd && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="text-[11px] h-8 bg-[#1327b9] hover:bg-[#2743D7] text-white w-full group/add transition-all duration-200"
              >
                <Plus className="h-3 w-3 mr-1.5" />
                {addLabel}
                <ChevronDown className="h-3 w-3 ml-auto opacity-60 group-hover/add:opacity-100 transition-opacity" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-[#DFE5EF] p-1">
              <DropdownMenuItem
                onClick={handleAddChild}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#F5F7FB] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F0F4FF] flex items-center justify-center shrink-0">
                  <Plus className="h-4 w-4 text-[#1327b9]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#15233B]">
                    {pt ? "Adicionar manualmente" : "Add manually"}
                  </span>
                  <span className="text-[10px] text-[#71809A] leading-tight">
                    {pt ? "Preencher campos na mão" : "Fill in fields manually"}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-[#DFE5EF]/60" />
              <DropdownMenuItem
                onClick={() => setAiUploadOpen(true)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#F5F7FB] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1327b9]/10 to-[#7648E7]/10 flex items-center justify-center shrink-0">
                  <FileUp className="h-4 w-4 text-[#1327b9]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#15233B] flex items-center gap-1.5">
                    {pt ? "Gerar com IA" : "Generate with AI"}
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#1327b9] to-[#7648E7] text-white font-bold uppercase tracking-wider">
                      AI
                    </span>
                  </span>
                  <span className="text-[10px] text-[#71809A] leading-tight">
                    {pt
                      ? "Upload de documentos para gerar"
                      : "Upload documents to generate"}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* AI Upload Modal */}
      <AIEditUploadModal
        open={aiUploadOpen}
        onOpenChange={setAiUploadOpen}
        levelLabel={levelLabel}
        nodeName={nodeName}
      />
    </>
  );
}
