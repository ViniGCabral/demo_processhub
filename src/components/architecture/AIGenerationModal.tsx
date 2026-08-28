import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { L1Process } from "@/stores/valueChainStore";

interface AIGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingL1s: L1Process[];
  onGenerate: (option: "full" | "existing" | "new", targetL1Id?: string, newE2EName?: string) => void;
}

export function AIGenerationModal({
  open,
  onOpenChange,
  existingL1s,
  onGenerate,
}: AIGenerationModalProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState<"select" | "confirm" | "loading">("select");
  const [option, setOption] = useState<"full" | "existing" | "new">("full");
  const [selectedL1Id, setSelectedL1Id] = useState<string>("");
  const [newE2EName, setNewE2EName] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleNext = () => {
    if (option === "new" && !newE2EName.trim()) return;
    if (option === "existing" && !selectedL1Id) return;
    
    // Full chain or existing E2E needs confirmation
    if (option === "full" || option === "existing") {
      setShowConfirmation(true);
    } else {
      // New E2E doesn't need confirmation, just generate
      executeGeneration();
    }
  };

  const executeGeneration = () => {
    setShowConfirmation(false);
    setStep("loading");
    
    // Simulate AI generation
    setTimeout(() => {
      onGenerate(option, selectedL1Id, newE2EName.trim());
      setStep("select");
      setOption("full");
      setSelectedL1Id("");
      setNewE2EName("");
      onOpenChange(false);
    }, 3000);
  };

  const handleClose = () => {
    if (step !== "loading") {
      setStep("select");
      setOption("full");
      setSelectedL1Id("");
      setNewE2EName("");
      onOpenChange(false);
    }
  };

  const getL1DisplayName = (l1: L1Process) => {
    return language === "PT" ? l1.namePT : l1.nameEN;
  };

  const isNextDisabled = () => {
    if (option === "new" && !newE2EName.trim()) return true;
    if (option === "existing" && !selectedL1Id) return true;
    return false;
  };

  if (step === "loading") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="h-16 w-16 text-primary/30" />
              </div>
              <Sparkles className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-lg font-medium text-foreground">
                {language === "PT"
                  ? "Gerando cadeia de valor..."
                  : "Generating value chain..."}
              </p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {language === "PT"
                ? "A IA está analisando e criando sua estrutura de processos"
                : "AI is analyzing and creating your process structure"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {language === "PT" ? "Gerar com IA" : "Generate with AI"}
            </DialogTitle>
            <DialogDescription>
              {language === "PT"
                ? "Escolha como deseja gerar a cadeia de valor"
                : "Choose how you want to generate the value chain"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <RadioGroup value={option} onValueChange={(v) => setOption(v as "full" | "existing" | "new")}>
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="full" id="full" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="full" className="font-medium cursor-pointer">
                    {language === "PT" ? "Cadeia completa" : "Full chain"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "PT"
                      ? "Gerar toda a cadeia de valor do zero"
                      : "Generate the entire value chain from scratch"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="existing" id="existing" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="existing" className="font-medium cursor-pointer">
                    {language === "PT" ? "E2E existente" : "Existing E2E"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "PT"
                      ? "Regenerar um E2E já cadastrado"
                      : "Regenerate an existing E2E"}
                  </p>
                  {option === "existing" && existingL1s.length > 0 && (
                    <select
                      value={selectedL1Id}
                      onChange={(e) => setSelectedL1Id(e.target.value)}
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">
                        {language === "PT" ? "Selecione um E2E..." : "Select an E2E..."}
                      </option>
                      {existingL1s.map((l1) => (
                        <option key={l1.id} value={l1.id}>
                          {getL1DisplayName(l1)}
                        </option>
                      ))}
                    </select>
                  )}
                  {option === "existing" && existingL1s.length === 0 && (
                    <p className="mt-2 text-sm text-destructive">
                      {language === "PT"
                        ? "Nenhum E2E cadastrado"
                        : "No E2E registered"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="new" id="new" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="new" className="font-medium cursor-pointer">
                    {language === "PT" ? "Novo E2E" : "New E2E"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "PT"
                      ? "Criar um novo E2E com IA"
                      : "Create a new E2E with AI"}
                  </p>
                  {option === "new" && (
                    <Input
                      value={newE2EName}
                      onChange={(e) => setNewE2EName(e.target.value)}
                      placeholder={language === "PT" ? "Nome do E2E..." : "E2E name..."}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              {language === "PT" ? "Cancelar" : "Cancel"}
            </Button>
            <Button
              variant="corporate"
              onClick={handleNext}
              disabled={isNextDisabled()}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {language === "PT" ? "Gerar" : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "PT" ? "Confirmar substituição" : "Confirm replacement"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {option === "full"
                ? language === "PT"
                  ? "A cadeia de valor atual será completamente substituída pela cadeia gerada pela IA. Esta ação não pode ser desfeita."
                  : "The current value chain will be completely replaced by the AI-generated chain. This action cannot be undone."
                : language === "PT"
                ? "O E2E selecionado será substituído pela versão gerada pela IA. Os L2s, L3s e L4s atuais serão removidos. Esta ação não pode ser desfeita."
                : "The selected E2E will be replaced by the AI-generated version. Current L2s, L3s, and L4s will be removed. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "PT" ? "Cancelar" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={executeGeneration}>
              {language === "PT" ? "Confirmar e gerar" : "Confirm and generate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
