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
import { L4Task, useValueChainStore } from "@/stores/valueChainStore";
import { toast } from "sonner";
import { FrequencyField, StructureField, RelationField, ExtraFields, BusinessUnitField } from "./hierarchyFields";

interface CreateEditL4ModalProps {
  isOpen: boolean;
  onClose: () => void;
  l1Id: string;
  l2Id: string;
  l3Id: string;
  editingL4: L4Task | null;
}

export function CreateEditL4Modal({
  isOpen,
  onClose,
  l1Id,
  l2Id,
  l3Id,
  editingL4,
}: CreateEditL4ModalProps) {
  const { language } = useLanguage();
  const { label: lvl } = useTaxonomy();
  const { addL4, updateL4, l1Processes } = useValueChainStore();
  const parentL1 = l1Processes.find((l1) => l1.id === l1Id);
  const parentL1Name = parentL1
    ? language === "PT"
      ? parentL1.namePT
      : parentL1.nameEN
    : "";
  const parentL2 = parentL1?.l2Processes.find((l2) => l2.id === l2Id);
  const parentL2Name = parentL2?.name || "";
  const parentL3Name =
    parentL2?.l3Processes.find((l3) => l3.id === l3Id)?.name || "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");
  const [frequency, setFrequency] = useState("");
  const [structure, setStructure] = useState("");
  const [businessUnit, setBusinessUnit] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [documentationLink, setDocumentationLink] = useState("");

  const [extra, setExtra] = useState({ code: "", systems: "", painPoints: "", ftes: "" });

  useEffect(() => {
    if (editingL4) {
      setExtra({
        code: editingL4.code || "",
        systems: editingL4.systems || "",
        painPoints: editingL4.painPoints || "",
        ftes: editingL4.ftes || "",
      });
      setName(editingL4.name);
      setDescription(editingL4.description || "");
      setResponsible(editingL4.responsible || "");
      setFrequency(editingL4.frequency || "");
      setStructure(editingL4.structure || "");
      setBusinessUnit(editingL4.businessUnit || "");
      setStatus(editingL4.status);
      setDocumentationLink(editingL4.documentationLink || "");
    } else {
      setExtra({ code: "", systems: "", painPoints: "", ftes: "" });
      setName("");
      setDescription("");
      setResponsible("");
      setFrequency("");
      setStructure("");
      setBusinessUnit("");
      setStatus("active");
      setDocumentationLink("");
    }
  }, [editingL4, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(
        language === "PT" ? "Nome é obrigatório" : "Name is required"
      );
      return;
    }

    if (!l3Id) {
      toast.error(
        language === "PT"
          ? `${lvl("l4")} precisa de um ${lvl("l3")} pai`
          : `${lvl("l4")} requires a parent ${lvl("l3")}`
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
      documentationLink: documentationLink.trim() || undefined,
    };

    if (editingL4) {
      updateL4(l1Id, l2Id, l3Id, editingL4.id, payload);
      toast.success(
        language === "PT" ? `${lvl("l4")} atualizado com sucesso` : `${lvl("l4")} updated successfully`
      );
    } else {
      addL4(l1Id, l2Id, l3Id, payload);
      toast.success(
        language === "PT" ? `${lvl("l4")} criado com sucesso` : `${lvl("l4")} created successfully`
      );
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingL4
              ? language === "PT"
                ? `Editar ${lvl("l4")}`
                : `Edit ${lvl("l4")}`
              : language === "PT"
              ? `Criar Novo ${lvl("l4")}`
              : `Create New ${lvl("l4")}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === "PT" ? `Nome do ${lvl("l4")}` : `${lvl("l4")} Name`} *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                language === "PT"
                  ? "Ex: Ensure SOX Compliance"
                  : "E.g.: Ensure SOX Compliance"
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
          <RelationField
            label={language === "PT" ? `${lvl("l3")} relacionado` : `Related ${lvl("l3")}`}
            value={parentL3Name}
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
                  ? `Descreva o ${lvl("l4")}...`
                  : `Describe the ${lvl("l4")}...`
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

          <div className="space-y-2">
            <Label htmlFor="documentationLink">
              {language === "PT" ? "Link da Documentação" : "Documentation Link"}
            </Label>
            <Input
              id="documentationLink"
              value={documentationLink}
              onChange={(e) => setDocumentationLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <BusinessUnitField
            value={businessUnit}
            onChange={setBusinessUnit}
            language={language}
          />

          <ExtraFields
            prefix="l4-"
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
              {editingL4
                ? language === "PT"
                  ? "Salvar"
                  : "Save"
                : language === "PT"
                ? `Criar ${lvl("l4")}`
                : `Create ${lvl("l4")}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
