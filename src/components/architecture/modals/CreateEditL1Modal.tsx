import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { L1Process } from "@/stores/valueChainStore";
import { FrequencyField, StructureField, ExtraFields, BusinessUnitField } from "./hierarchyFields";

interface CreateEditL1ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    nameEN: string;
    namePT: string;
    category: "SUPPORT" | "PRIMARY";
    description?: string;
    domain?: string;
    frequency?: string;
    responsible?: string;
    structure?: string;
    code?: string;
    systems?: string;
    painPoints?: string;
    ftes?: string;
    businessUnit?: string;
  }) => void;
  editingL1?: L1Process | null;
}

export function CreateEditL1Modal({
  open,
  onOpenChange,
  onSave,
  editingL1,
}: CreateEditL1ModalProps) {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"SUPPORT" | "PRIMARY">("PRIMARY");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [frequency, setFrequency] = useState("");
  const [responsible, setResponsible] = useState("");
  const [structure, setStructure] = useState("");
  const [businessUnit, setBusinessUnit] = useState("");

  const [extra, setExtra] = useState({ code: "", systems: "", painPoints: "", ftes: "" });

  useEffect(() => {
    if (editingL1) {
      setExtra({
        code: editingL1.code || "",
        systems: editingL1.systems || "",
        painPoints: editingL1.painPoints || "",
        ftes: editingL1.ftes || "",
      });
      // Use the name based on current language when editing
      setName(language === "PT" ? editingL1.namePT : editingL1.nameEN);
      setCategory(editingL1.category);
      setDescription(editingL1.description || "");
      setDomain(editingL1.domain || "");
      setFrequency(editingL1.frequency || "");
      setResponsible(editingL1.responsible || "");
      setStructure(editingL1.structure || "");
      setBusinessUnit(editingL1.businessUnit || "");
    } else {
      setExtra({ code: "", systems: "", painPoints: "", ftes: "" });
      setName("");
      setCategory("PRIMARY");
      setDescription("");
      setDomain("");
      setFrequency("");
      setResponsible("");
      setStructure("");
      setBusinessUnit("");
    }
  }, [editingL1, open, language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      nameEN: name.trim(),
      namePT: name.trim(),
      category,
      description: description.trim() || undefined,
      domain: domain.trim() || undefined,
      frequency: frequency || undefined,
      responsible: responsible.trim() || undefined,
      structure: structure.trim() || undefined,
      businessUnit: businessUnit || undefined,
      code: extra.code.trim() || undefined,
      systems: extra.systems.trim() || undefined,
      painPoints: extra.painPoints.trim() || undefined,
      ftes: extra.ftes.trim() || undefined,
    });

    onOpenChange(false);
  };

  const isEditing = !!editingL1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? language === "PT"
                ? "Editar E2E"
                : "Edit E2E"
              : language === "PT"
              ? "Criar Novo E2E"
              : "Create New E2E"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">
              {language === "PT" ? "Nome do E2E *" : "E2E Name *"}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                language === "PT"
                  ? "Ex: Hire to Retire"
                  : "e.g., Hire to Retire"
              }
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">
              {language === "PT" ? "Categoria *" : "Category *"}
            </Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as "SUPPORT" | "PRIMARY")}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIMARY">
                  {language === "PT" ? "Atividade Primária" : "Primary Activity"}
                </SelectItem>
                <SelectItem value="SUPPORT">
                  {language === "PT" ? "Atividade de Suporte" : "Support Activity"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">
              {language === "PT" ? "Descrição" : "Description"}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                language === "PT"
                  ? "Descreva este E2E..."
                  : "Describe this E2E..."
              }
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="domain">
              {language === "PT" ? "Domínio" : "Domain"}
            </Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={
                language === "PT" ? "Ex: Pessoas & Cultura" : "e.g., People & Culture"
              }
              className="mt-1.5"
            />
          </div>

          <FrequencyField
            value={frequency}
            onChange={setFrequency}
            language={language}
          />

          <div>
            <Label htmlFor="responsible">
              {language === "PT" ? "Responsável" : "Responsible"}
            </Label>
            <Input
              id="responsible"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder={
                language === "PT" ? "Nome do responsável" : "Responsible person name"
              }
              className="mt-1.5"
            />
          </div>

          <StructureField
            value={structure}
            onChange={setStructure}
            language={language}
          />



          <BusinessUnitField
            value={businessUnit}
            onChange={setBusinessUnit}
            language={language}
          />

          <ExtraFields
            prefix="l1-"
            code={extra.code}
            systems={extra.systems}
            painPoints={extra.painPoints}
            ftes={extra.ftes}
            onChange={(f, v) => setExtra((prev) => ({ ...prev, [f]: v }))}
            language={language}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {language === "PT" ? "Cancelar" : "Cancel"}
            </Button>
            <Button type="submit" variant="corporate" disabled={!name.trim()}>
              {isEditing
                ? language === "PT"
                  ? "Salvar"
                  : "Save"
                : language === "PT"
                ? "Criar E2E"
                : "Create E2E"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
