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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTaxonomy } from "@/stores/taxonomyStore";
import { L3Process, useValueChainStore } from "@/stores/valueChainStore";
import { toast } from "sonner";
import { FrequencyField, StructureField, RelationField, ExtraFields, BusinessUnitField } from "./hierarchyFields";

interface CreateEditL3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  l1Id: string;
  l2Id: string;
  editingL3: L3Process | null;
}

export function CreateEditL3Modal({
  isOpen,
  onClose,
  l1Id,
  l2Id,
  editingL3,
}: CreateEditL3ModalProps) {
  const { language } = useLanguage();
  const { label: lvl } = useTaxonomy();
  const { addL3, updateL3, l1Processes } = useValueChainStore();
  const parentL1 = l1Processes.find((l1) => l1.id === l1Id);
  const parentL1Name = parentL1
    ? language === "PT"
      ? parentL1.namePT
      : parentL1.nameEN
    : "";
  const parentL2Name =
    parentL1?.l2Processes.find((l2) => l2.id === l2Id)?.name || "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");
  const [frequency, setFrequency] = useState("");
  const [structure, setStructure] = useState("");
  const [businessUnit, setBusinessUnit] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [extra, setExtra] = useState({ code: "", systems: "", painPoints: "", ftes: "" });

  useEffect(() => {
    if (editingL3) {
      setExtra({
        code: editingL3.code || "",
        systems: editingL3.systems || "",
        painPoints: editingL3.painPoints || "",
        ftes: editingL3.ftes || "",
      });
      setName(editingL3.name);
      setDescription(editingL3.description || "");
      setResponsible(editingL3.responsible || "");
      setFrequency(editingL3.frequency || "");
      setStructure(editingL3.structure || "");
      setBusinessUnit(editingL3.businessUnit || "");
      setStatus(editingL3.status);
    } else {
      setExtra({ code: "", systems: "", painPoints: "", ftes: "" });
      setName("");
      setDescription("");
      setResponsible("");
      setFrequency("");
      setStructure("");
      setBusinessUnit("");
      setStatus("active");
    }
  }, [editingL3, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(
        language === "PT" ? "Nome é obrigatório" : "Name is required"
      );
      return;
    }

    if (!l2Id) {
      toast.error(
        language === "PT"
          ? `${lvl("l3")} precisa de um ${lvl("l2")} pai`
          : `${lvl("l3")} requires a parent ${lvl("l2")}`
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
      status,
    };

    if (editingL3) {
      updateL3(l1Id, l2Id, editingL3.id, payload);
      toast.success(
        language === "PT" ? `${lvl("l3")} atualizado com sucesso` : `${lvl("l3")} updated successfully`
      );
    } else {
      addL3(l1Id, l2Id, payload);
      toast.success(
        language === "PT" ? `${lvl("l3")} criado com sucesso` : `${lvl("l3")} created successfully`
      );
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingL3
              ? language === "PT"
                ? `Editar ${lvl("l3")}`
                : `Edit ${lvl("l3")}`
              : language === "PT"
              ? `Criar Novo ${lvl("l3")}`
              : `Create New ${lvl("l3")}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === "PT" ? `Nome do ${lvl("l3")}` : `${lvl("l3")} Name`} *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                language === "PT"
                  ? "Ex: Ensure Compliance"
                  : "E.g.: Ensure Compliance"
              }
            />
          </div>

          <RelationField
            label={language === "PT" ? `${lvl("l1")} relacionado` : `Related ${lvl("l1")}`}
            value={parentL1Name}
          />
          <RelationField
            label={language === "PT" ? `${lvl("l2")} relacionado` : `Related ${lvl("l2")}`}
            value={parentL2Name}
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
                  ? `Descreva o ${lvl("l3")}...`
                  : `Describe the ${lvl("l3")}...`
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
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as "active" | "inactive")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  {language === "PT" ? "Ativo" : "Active"}
                </SelectItem>
                <SelectItem value="inactive">
                  {language === "PT" ? "Inativo" : "Inactive"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <BusinessUnitField
            value={businessUnit}
            onChange={setBusinessUnit}
            language={language}
          />

          <ExtraFields
            prefix="l3-"
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
              {editingL3
                ? language === "PT"
                  ? "Salvar"
                  : "Save"
                : language === "PT"
                ? `Criar ${lvl("l3")}`
                : `Create ${lvl("l3")}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
