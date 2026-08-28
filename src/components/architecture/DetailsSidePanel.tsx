import { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useValueChainStore } from "@/stores/valueChainStore";
import { useTaxonomy, TaxonomyLevel } from "@/stores/taxonomyStore";
import { FrequencyField, StructureField, ExtraFields, BusinessUnitField } from "./modals/hierarchyFields";
import { Pencil, X, Check } from "lucide-react";
import { toast } from "sonner";

export type DetailsTarget = {
  level: "L1" | "L2" | "L3" | "L4";
  l1Id: string;
  l2Id?: string;
  l3Id?: string;
  itemId: string;
} | null;

interface DetailsSidePanelProps {
  target: DetailsTarget;
  onClose: () => void;
}

export function DetailsSidePanel({ target, onClose }: DetailsSidePanelProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const { l1Processes, updateL1, updateL2, updateL3, updateL4 } =
    useValueChainStore();
  const { label: lvl } = useTaxonomy();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    domain: "",
    frequency: "",
    responsible: "",
    structure: "",
    businessUnit: "",
    okr: "",
    description: "",
    code: "",
    systems: "",
    painPoints: "",
    ftes: "",
  });

  const data = useMemo(() => {
    if (!target) return null;
    const l1 = l1Processes.find((x) => x.id === target.l1Id);
    if (!l1) return null;
    const l1Name = pt ? l1.namePT : l1.nameEN;

    if (target.level === "L1") {
      return {
        item: {
          name: l1Name,
          domain: l1.domain || "",
          frequency: l1.frequency || "",
          responsible: l1.responsible || "",
          structure: l1.structure || "",
        businessUnit: l1.businessUnit || "",
          okr: "",
          description: l1.description || "",
          code: l1.code || "",
          systems: l1.systems || "",
          painPoints: l1.painPoints || "",
          ftes: l1.ftes || "",
        },
        relations: [] as { label: string; value: string }[],
      };
    }

    const l2 = l1.l2Processes.find(
      (x) => x.id === (target.level === "L2" ? target.itemId : target.l2Id)
    );
    if (!l2) return null;

    if (target.level === "L2") {
      return {
        item: {
          name: l2.name,
          domain: "",
          frequency: l2.frequency || "",
          responsible: l2.responsible || "",
          structure: l2.structure || "",
        businessUnit: l2.businessUnit || "",
          okr: l2.okr || "",
          description: l2.description || "",
          code: l2.code || "",
          systems: l2.systems || "",
          painPoints: l2.painPoints || "",
          ftes: l2.ftes || "",
        },
        relations: [{ label: lvl("l1"), value: l1Name }],
      };
    }

    const l3 = l2.l3Processes.find(
      (x) => x.id === (target.level === "L3" ? target.itemId : target.l3Id)
    );
    if (!l3) return null;

    if (target.level === "L3") {
      return {
        item: {
          name: l3.name,
          domain: "",
          frequency: l3.frequency || "",
          responsible: l3.responsible || "",
          structure: l3.structure || "",
        businessUnit: l3.businessUnit || "",
          okr: "",
          description: l3.description || "",
          code: l3.code || "",
          systems: l3.systems || "",
          painPoints: l3.painPoints || "",
          ftes: l3.ftes || "",
        },
        relations: [
          { label: lvl("l1"), value: l1Name },
          { label: lvl("l2"), value: l2.name },
        ],
      };
    }

    const l4 = l3.l4Tasks.find((x) => x.id === target.itemId);
    if (!l4) return null;
    return {
      item: {
        name: l4.name,
        domain: "",
        frequency: l4.frequency || "",
        responsible: l4.responsible || "",
        structure: l4.structure || "",
        businessUnit: l4.businessUnit || "",
        okr: "",
        description: l4.description || "",
        code: l4.code || "",
        systems: l4.systems || "",
        painPoints: l4.painPoints || "",
        ftes: l4.ftes || "",
      },
      relations: [
        { label: lvl("l1"), value: l1Name },
        { label: lvl("l2"), value: l2.name },
        { label: lvl("l3"), value: l3.name },
      ],
    };
  }, [target, l1Processes, pt]);

  useEffect(() => {
    if (data) setForm(data.item);
    setIsEditing(false);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!target || !data) return null;

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error(pt ? "Nome é obrigatório" : "Name is required");
      return;
    }
    const base = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      responsible: form.responsible.trim() || undefined,
      frequency: form.frequency || undefined,
      structure: form.structure.trim() || undefined,
      businessUnit: form.businessUnit || undefined,
      code: form.code.trim() || undefined,
      systems: form.systems.trim() || undefined,
      painPoints: form.painPoints.trim() || undefined,
      ftes: form.ftes.trim() || undefined,
    };

    if (target.level === "L1") {
      updateL1(target.l1Id, {
        nameEN: form.name.trim(),
        namePT: form.name.trim(),
        description: base.description,
        domain: form.domain.trim() || undefined,
        frequency: base.frequency,
        responsible: base.responsible,
        structure: base.structure,
        businessUnit: base.businessUnit,
        code: base.code,
        systems: base.systems,
        painPoints: base.painPoints,
        ftes: base.ftes,
      });
    } else if (target.level === "L2") {
      updateL2(target.l1Id, target.itemId, {
        ...base,
        okr: form.okr.trim() || undefined,
      });
    } else if (target.level === "L3") {
      updateL3(target.l1Id, target.l2Id!, target.itemId, base);
    } else {
      updateL4(target.l1Id, target.l2Id!, target.l3Id!, target.itemId, base);
    }

    toast.success(pt ? "Detalhes atualizados" : "Details updated");
    setIsEditing(false);
  };

  const row = (label: string, value: string) => (
    <div className="py-3 border-b border-[#EDEDED]">
      <div className="text-[11px] font-bold uppercase tracking-wider text-[#A5A7B0] mb-1">
        {label}
      </div>
      <div className="text-sm text-[#272727]">{value || "—"}</div>
    </div>
  );

  return (
    <Sheet open={!!target} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto rounded-none">
        <SheetHeader className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#0C1BA8] text-white rounded-sm">
              {lvl(target.level.toLowerCase() as TaxonomyLevel)}
            </span>
            <SheetTitle className="text-left text-lg text-[#272727]">
              {data.item.name}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Relations */}
        {data.relations.length > 0 && (
          <div className="mb-4 p-3 border border-[#EDEDED] bg-[#f9f9f9] rounded-sm space-y-1.5">
            {data.relations.map((r) => (
              <div key={r.label} className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#0C1BA8] shrink-0 max-w-[90px] truncate">{r.label}</span>
                <span className="text-[#525252]">{r.value}</span>
              </div>
            ))}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="d-name">{pt ? "Nome" : "Name"} *</Label>
              <Input
                id="d-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {target.level === "L1" && (
              <div className="space-y-2">
                <Label htmlFor="d-domain">{pt ? "Domínio" : "Domain"}</Label>
                <Input
                  id="d-domain"
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                />
              </div>
            )}

            <FrequencyField
              id="d-frequency"
              value={form.frequency}
              onChange={(v) => setForm({ ...form, frequency: v })}
              language={language}
            />

            <div className="space-y-2">
              <Label htmlFor="d-responsible">
                {pt ? "Responsável" : "Responsible"}
              </Label>
              <Input
                id="d-responsible"
                value={form.responsible}
                onChange={(e) =>
                  setForm({ ...form, responsible: e.target.value })
                }
              />
            </div>

            <StructureField
              id="d-structure"
              value={form.structure}
              onChange={(v) => setForm({ ...form, structure: v })}
              language={language}
            />

            <BusinessUnitField
              id="d-bu"
              value={form.businessUnit}
              onChange={(v) => setForm({ ...form, businessUnit: v })}
              language={language}
            />

            {target.level === "L2" && (
              <div className="space-y-2">
                <Label htmlFor="d-okr">OKR</Label>
                <Textarea
                  id="d-okr"
                  rows={2}
                  value={form.okr}
                  onChange={(e) => setForm({ ...form, okr: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="d-description">
                {pt ? "Descrição" : "Description"}
              </Label>
              <Textarea
                id="d-description"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <ExtraFields
              prefix="d-"
              code={form.code}
              systems={form.systems}
              painPoints={form.painPoints}
              ftes={form.ftes}
              onChange={(f, v) => setForm((prev) => ({ ...prev, [f]: v }))}
              language={language}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="rounded-sm"
                onClick={() => {
                  setForm(data.item);
                  setIsEditing(false);
                }}
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                {pt ? "Cancelar" : "Cancel"}
              </Button>
              <Button
                className="rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
                onClick={handleSave}
              >
                <Check className="h-3.5 w-3.5 mr-1.5" />
                {pt ? "Salvar" : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {row(pt ? "Nome" : "Name", data.item.name)}
            {target.level === "L1" &&
              row(pt ? "Domínio" : "Domain", data.item.domain)}
            {row(pt ? "Frequência" : "Frequency", data.item.frequency)}
            {row(pt ? "Responsável" : "Responsible", data.item.responsible)}
            {row(pt ? "Estrutura" : "Structure", data.item.structure)}
            {row(pt ? "Unidade de negócio" : "Business unit", data.item.businessUnit)}
            {target.level === "L2" && row("OKR", data.item.okr)}
            {row(pt ? "Código" : "Code", data.item.code)}
            {row(pt ? "Sistemas/ferramentas" : "Systems/tools", data.item.systems)}
            {row(
              pt ? "Dores e oportunidades" : "Pain points & opportunities",
              data.item.painPoints
            )}
            {row(
              pt ? "Dimensionamento (FTEs alocados)" : "Sizing (allocated FTEs)",
              data.item.ftes
            )}
            {row(pt ? "Descrição" : "Description", data.item.description)}

            <div className="flex justify-end pt-4">
              <Button
                className="rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                {pt ? "Editar" : "Edit"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
