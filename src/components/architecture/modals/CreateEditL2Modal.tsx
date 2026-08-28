import { useEffect, useState } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { useTaxonomy } from "@/stores/taxonomyStore";
import { L2Process, useValueChainStore } from "@/stores/valueChainStore";
import { toast } from "sonner";
import { FrequencyField, StructureField, RelationField, ExtraFields, BusinessUnitField } from "./hierarchyFields";

interface CreateEditL2ModalProps {
  isOpen: boolean;
  onClose: () => void;
  l1Id: string;
  editingL2: L2Process | null;
}

export function CreateEditL2Modal({
  isOpen,
  onClose,
  l1Id,
  editingL2,
}: CreateEditL2ModalProps) {
  const { language } = useLanguage();
  const { label: lvl } = useTaxonomy();
  const { addL2, updateL2, l1Processes } = useValueChainStore();
  const parentL1 = l1Processes.find((l1) => l1.id === l1Id);
  const parentL1Name = parentL1
    ? language === "PT"
      ? parentL1.namePT
      : parentL1.nameEN
    : "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");
  const [frequency, setFrequency] = useState("");
  const [structure, setStructure] = useState("");
  const [businessUnit, setBusinessUnit] = useState("");
  const [okr, setOkr] = useState("");

  const [extra, setExtra] = useState({ code: "", systems: "", painPoints: "", ftes: "" });

  useEffect(() => {
    if (editingL2) {
      setExtra({
        code: editingL2.code || "",
        systems: editingL2.systems || "",
        painPoints: editingL2.painPoints || "",
        ftes: editingL2.ftes || "",
      });
      setName(editingL2.name);
      setDescription(editingL2.description || "");
      setResponsible(editingL2.responsible || "");
      setFrequency(editingL2.frequency || "");
      setStructure(editingL2.structure || "");
      setBusinessUnit(editingL2.businessUnit || "");
      setOkr(editingL2.okr || "");
    } else {
      setExtra({ code: "", systems: "", painPoints: "", ftes: "" });
      setName("");
      setDescription("");
      setResponsible("");
      setFrequency("");
      setStructure("");
      setBusinessUnit("");
      setOkr("");
    }
  }, [editingL2, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(
        language === "PT" ? "Nome é obrigatório" : "Name is required"
      );
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      responsible: responsible.trim() || undefined,
      frequency: frequency || undefined,
      structure: structure.trim() || undefined,
      businessUnit: businessUnit || undefined,
      code: extra.code.trim() || undefined,
      systems: extra.systems.trim() || undefined,
      painPoints: extra.painPoints.trim() || undefined,
      ftes: extra.ftes.trim() || undefined,
      okr: okr.trim() || undefined,
    };

    if (editingL2) {
      updateL2(l1Id, editingL2.id, payload);
      toast.success(
        language === "PT" ? `${lvl("l2")} atualizado com sucesso` : `${lvl("l2")} updated successfully`
      );
    } else {
      addL2(l1Id, payload);
      toast.success(
        language === "PT" ? `${lvl("l2")} criado com sucesso` : `${lvl("l2")} created successfully`
      );
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingL2
              ? language === "PT"
                ? `Editar ${lvl("l2")}`
                : `Edit ${lvl("l2")}`
              : language === "PT"
              ? `Criar Novo ${lvl("l2")}`
              : `Create New ${lvl("l2")}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === "PT" ? `Nome do ${lvl("l2")}` : `${lvl("l2")} Name`} *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                language === "PT"
                  ? "Ex: Record-to-Account"
                  : "E.g.: Record-to-Account"
              }
            />
          </div>

          <RelationField
            label={language === "PT" ? `${lvl("l1")} relacionado` : `Related ${lvl("l1")}`}
            value={parentL1Name}
          />


          <div className="space-y-2">
            <Label htmlFor="description">
              {language === "PT" ? "Descrição" : "Description"}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                language === "PT"
                  ? `Descreva o ${lvl("l2")}...`
                  : `Describe the ${lvl("l2")}...`
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">
              {language === "PT" ? "Responsável" : "Responsible"}
            </Label>
            <Input
              id="responsible"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder={
                language === "PT"
                  ? "Nome do responsável"
                  : "Responsible person name"
              }
            />
          </div>

          <FrequencyField
            value={frequency}
            onChange={setFrequency}
            language={language}
          />

          <StructureField
            value={structure}
            onChange={setStructure}
            language={language}
          />

          <div className="space-y-2">
            <Label htmlFor="okr">OKR</Label>
            <Textarea
              id="okr"
              value={okr}
              onChange={(e) => setOkr(e.target.value)}
              placeholder={
                language === "PT"
                  ? "Objetivo e resultados-chave..."
                  : "Objective and key results..."
              }
              rows={2}
            />
          </div>



          <BusinessUnitField
            value={businessUnit}
            onChange={setBusinessUnit}
            language={language}
          />

          <ExtraFields
            prefix="l2-"
            code={extra.code}
            systems={extra.systems}
            painPoints={extra.painPoints}
            ftes={extra.ftes}
            onChange={(f, v) => setExtra((prev) => ({ ...prev, [f]: v }))}
            language={language}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {language === "PT" ? "Cancelar" : "Cancel"}
            </Button>
            <Button type="submit">
              {editingL2
                ? language === "PT"
                  ? "Salvar"
                  : "Save"
                : language === "PT"
                ? `Criar ${lvl("l2")}`
                : `Create ${lvl("l2")}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
