import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  FileAudio,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AIEditUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  levelLabel: string;
  nodeName: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.includes("audio") || type.includes("mp3") || type.includes("wav") || type.includes("ogg")) {
    return <FileAudio className="h-4 w-4 text-[#7648E7]" />;
  }
  if (type.includes("spreadsheet") || type.includes("csv") || type.includes("excel") || type.includes("xlsx")) {
    return <FileSpreadsheet className="h-4 w-4 text-[#008B5C]" />;
  }
  if (type.includes("pdf") || type.includes("doc") || type.includes("text")) {
    return <FileText className="h-4 w-4 text-[#1327b9]" />;
  }
  return <File className="h-4 w-4 text-[#71809A]" />;
}

export function AIEditUploadModal({
  open,
  onOpenChange,
  levelLabel,
  nodeName,
}: AIEditUploadModalProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleProcess = () => {
    setIsProcessing(true);
    // Mock processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        pt
          ? `IA processou ${files.length} arquivo(s) para ${nodeName}. Campos atualizados!`
          : `AI processed ${files.length} file(s) for ${nodeName}. Fields updated!`
      );
      setFiles([]);
      onOpenChange(false);
    }, 3000);
  };

  const handleClose = () => {
    if (!isProcessing) {
      setFiles([]);
      onOpenChange(false);
    }
  };

  if (isProcessing) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-12 gap-5">
            {/* Animated AI processing indicator */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1327b9]/10 via-[#7648E7]/10 to-[#1327b9]/5 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-[#1327b9] animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1327b9] flex items-center justify-center animate-bounce">
                <Loader2 className="h-3 w-3 text-white animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#15233B]">
                {pt ? "Processando com IA..." : "Processing with AI..."}
              </h3>
              <p className="text-sm text-[#71809A] max-w-xs">
                {pt
                  ? `Analisando ${files.length} arquivo(s) e preenchendo os campos de ${levelLabel} automaticamente.`
                  : `Analyzing ${files.length} file(s) and auto-filling ${levelLabel} fields.`}
              </p>
            </div>
            <div className="w-48 h-1.5 rounded-full bg-[#DFE5EF] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1327b9] to-[#7648E7] animate-pulse"
                style={{ width: "60%", transition: "width 2s ease" }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-[#15233B]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1327b9]/10 to-[#7648E7]/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#1327b9]" />
            </div>
            {pt ? "Editar com IA" : "Edit with AI"}
          </DialogTitle>
          <DialogDescription className="text-[#71809A]">
            {pt
              ? `Faça upload de transcrições, documentos ou planilhas para que a IA preencha automaticamente os campos de ${levelLabel} — "${nodeName}".`
              : `Upload transcriptions, documents or spreadsheets so AI can auto-fill the ${levelLabel} fields — "${nodeName}".`}
          </DialogDescription>
        </DialogHeader>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer group",
            isDragging
              ? "border-[#1327b9] bg-[#1327b9]/[0.04] scale-[1.01]"
              : "border-[#DFE5EF] hover:border-[#1327b9]/50 bg-[#F8FAFF]"
          )}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.accept = ".pdf,.doc,.docx,.txt,.csv,.xlsx,.mp3,.wav,.ogg,.m4a,.json";
            input.onchange = (e) => handleFiles((e.target as HTMLInputElement).files);
            input.click();
          }}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                isDragging
                  ? "bg-[#1327b9]/10 scale-110"
                  : "bg-[#DFE5EF]/60 group-hover:bg-[#1327b9]/10"
              )}
            >
              <Upload
                className={cn(
                  "h-6 w-6 transition-colors",
                  isDragging ? "text-[#1327b9]" : "text-[#71809A] group-hover:text-[#1327b9]"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#15233B]">
                {pt ? "Arraste arquivos aqui" : "Drag files here"}
              </p>
              <p className="text-xs text-[#71809A] mt-1">
                {pt
                  ? "ou clique para selecionar · PDF, DOCX, TXT, CSV, XLSX, MP3, WAV"
                  : "or click to select · PDF, DOCX, TXT, CSV, XLSX, MP3, WAV"}
              </p>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            <p className="text-xs font-semibold text-[#71809A] uppercase tracking-wider">
              {pt ? `${files.length} arquivo(s) selecionado(s)` : `${files.length} file(s) selected`}
            </p>
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 bg-white border border-[#DFE5EF] rounded-lg px-3 py-2 group/file hover:border-[#1327b9]/30 transition-colors"
              >
                {getFileIcon(f.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#15233B] truncate">{f.name}</p>
                  <p className="text-[10px] text-[#71809A]">{formatFileSize(f.size)}</p>
                </div>
                <CheckCircle2 className="h-3.5 w-3.5 text-[#008B5C] shrink-0" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(f.id);
                  }}
                  className="p-1 rounded-md hover:bg-red-50 text-[#71809A] hover:text-red-500 transition-colors opacity-0 group-hover/file:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="text-xs border-[#CFD7E6] text-[#4D5A72]"
          >
            {pt ? "Cancelar" : "Cancel"}
          </Button>
          <Button
            onClick={handleProcess}
            disabled={files.length === 0}
            className="text-xs bg-gradient-to-r from-[#1327b9] to-[#2743D7] hover:from-[#0F1F99] hover:to-[#1327b9] text-white shadow-md"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {pt
              ? `Processar ${files.length > 0 ? `(${files.length})` : ""}`
              : `Process ${files.length > 0 ? `(${files.length})` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
