import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Journey, JourneyCategory, JourneyStatus } from "@/types/journeyTypes";

interface CreateEditJourneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    namePT: string;
    nameEN: string;
    name: string;
    description?: string;
    category: JourneyCategory;
    status: JourneyStatus;
    owner?: string;
    triggerEvent?: string;
    expectedOutcome?: string;
    avgDuration?: string;
    slaTarget?: string;
  }) => void;
  editingJourney?: Journey | null;
}

export function CreateEditJourneyModal({
  open,
  onOpenChange,
  onSave,
  editingJourney,
}: CreateEditJourneyModalProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const [namePT, setNamePT] = useState("");
  const [nameEN, setNameEN] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<JourneyCategory>("operational");
  const [status, setStatus] = useState<JourneyStatus>("draft");
  const [owner, setOwner] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [avgDuration, setAvgDuration] = useState("");
  const [slaTarget, setSlaTarget] = useState("");

  useEffect(() => {
    if (editingJourney) {
      setNamePT(editingJourney.namePT);
      setNameEN(editingJourney.nameEN);
      setDescription(editingJourney.description || "");
      setCategory(editingJourney.category);
      setStatus(editingJourney.status);
      setOwner(editingJourney.owner || "");
      setTriggerEvent(editingJourney.triggerEvent || "");
      setExpectedOutcome(editingJourney.expectedOutcome || "");
      setAvgDuration(editingJourney.avgDuration || "");
      setSlaTarget(editingJourney.slaTarget || "");
    } else {
      setNamePT("");
      setNameEN("");
      setDescription("");
      setCategory("operational");
      setStatus("draft");
      setOwner("");
      setTriggerEvent("");
      setExpectedOutcome("");
      setAvgDuration("");
      setSlaTarget("");
    }
  }, [editingJourney, open]);

  const handleSubmit = () => {
    if (!namePT.trim() && !nameEN.trim()) return;
    const finalNamePT = namePT.trim() || nameEN.trim();
    const finalNameEN = nameEN.trim() || namePT.trim();
    onSave({
      namePT: finalNamePT,
      nameEN: finalNameEN,
      name: finalNameEN,
      description: description.trim() || undefined,
      category,
      status,
      owner: owner.trim() || undefined,
      triggerEvent: triggerEvent.trim() || undefined,
      expectedOutcome: expectedOutcome.trim() || undefined,
      avgDuration: avgDuration.trim() || undefined,
      slaTarget: slaTarget.trim() || undefined,
    });
    onOpenChange(false);
  };

  const categoryOptions: { value: JourneyCategory; labelPT: string; labelEN: string }[] = [
    { value: "customer", labelPT: "Cliente", labelEN: "Customer" },
    { value: "operational", labelPT: "Operacional", labelEN: "Operational" },
    { value: "compliance", labelPT: "Conformidade", labelEN: "Compliance" },
    { value: "financial", labelPT: "Financeira", labelEN: "Financial" },
  ];

  const statusOptions: { value: JourneyStatus; labelPT: string; labelEN: string }[] = [
    { value: "draft", labelPT: "Rascunho", labelEN: "Draft" },
    { value: "active", labelPT: "Ativa", labelEN: "Active" },
    { value: "archived", labelPT: "Arquivada", labelEN: "Archived" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#272727]">
            {editingJourney
              ? pt ? "Editar Jornada" : "Edit Journey"
              : pt ? "Criar Jornada" : "Create Journey"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#A5A7B0]">
                {pt ? "Nome (PT)" : "Name (PT)"}
              </Label>
              <Input
                value={namePT}
                onChange={(e) => setNamePT(e.target.value)}
                placeholder={pt ? "Nome em português" : "Portuguese name"}
                className="rounded-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[#A5A7B0]">
                {pt ? "Nome (EN)" : "Name (EN)"}
              </Label>
              <Input
                value={nameEN}
                onChange={(e) => setNameEN(e.target.value)}
                placeholder={pt ? "Nome em inglês" : "English name"}
                className="rounded-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[#A5A7B0]">
              {pt ? "Descrição" : "Description"}
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={pt ? "Descreva a jornada..." : "Describe the journey..."}
              className="rounded-sm min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#A5A7B0]">
                {pt ? "Categoria" : "Category"}
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as JourneyCategory)}>
                <SelectTrigger className="rounded-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {pt ? opt.labelPT : opt.labelEN}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[#A5A7B0]">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as JourneyStatus)}>
                <SelectTrigger className="rounded-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {pt ? opt.labelPT : opt.labelEN}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[#A5A7B0]">
              {pt ? "Responsável (Owner)" : "Owner"}
            </Label>
            <Input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder={pt ? "Ex.: Coord. de Fretes" : "e.g. Freight Coordinator"}
              className="rounded-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#A5A7B0]">
                {pt ? "Evento Disparador" : "Trigger Event"}
              </Label>
              <Input
                value={triggerEvent}
                onChange={(e) => setTriggerEvent(e.target.value)}
                placeholder={pt ? "O que inicia a jornada?" : "What triggers the journey?"}
                className="rounded-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[#A5A7B0]">
                {pt ? "Resultado Esperado" : "Expected Outcome"}
              </Label>
              <Input
                value={expectedOutcome}
                onChange={(e) => setExpectedOutcome(e.target.value)}
                placeholder={pt ? "Qual o resultado final?" : "What's the expected result?"}
                className="rounded-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#A5A7B0]">
                {pt ? "Duração Média" : "Avg Duration"}
              </Label>
              <Input
                value={avgDuration}
                onChange={(e) => setAvgDuration(e.target.value)}
                placeholder="Ex.: 2-3 dias"
                className="rounded-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[#A5A7B0]">
                {pt ? "Meta de SLA" : "SLA Target"}
              </Label>
              <Input
                value={slaTarget}
                onChange={(e) => setSlaTarget(e.target.value)}
                placeholder="Ex.: 48 horas"
                className="rounded-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-sm"
          >
            {pt ? "Cancelar" : "Cancel"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!namePT.trim() && !nameEN.trim()}
            className="rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
          >
            {editingJourney
              ? pt ? "Salvar" : "Save"
              : pt ? "Criar" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
