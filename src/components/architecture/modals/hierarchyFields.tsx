import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useBusinessUnitStore } from "@/stores/businessUnitStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FREQUENCY_OPTIONS = [
  { value: "Diária", labelPT: "Diária", labelEN: "Daily" },
  { value: "Semanal", labelPT: "Semanal", labelEN: "Weekly" },
  { value: "Quinzenal", labelPT: "Quinzenal", labelEN: "Biweekly" },
  { value: "Mensal", labelPT: "Mensal", labelEN: "Monthly" },
  { value: "Trimestral", labelPT: "Trimestral", labelEN: "Quarterly" },
  { value: "Semestral", labelPT: "Semestral", labelEN: "Semiannual" },
  { value: "Anual", labelPT: "Anual", labelEN: "Yearly" },
  { value: "Sob demanda", labelPT: "Sob demanda", labelEN: "On demand" },
];

export function FrequencyField({
  value,
  onChange,
  language,
  id = "frequency",
}: {
  value: string;
  onChange: (v: string) => void;
  language: string;
  id?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {language === "PT" ? "Frequência" : "Frequency"}
      </Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue
            placeholder={language === "PT" ? "Selecione..." : "Select..."}
          />
        </SelectTrigger>
        <SelectContent>
          {FREQUENCY_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {language === "PT" ? o.labelPT : o.labelEN}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function StructureField({
  value,
  onChange,
  language,
  id = "structure",
}: {
  value: string;
  onChange: (v: string) => void;
  language: string;
  id?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {language === "PT" ? "Estrutura" : "Structure"}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          language === "PT"
            ? "Ex: Diretoria de Operações"
            : "E.g.: Operations Department"
        }
      />
    </div>
  );
}

export function RelationField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="h-10 px-3 flex items-center rounded-sm border border-[#E5E5E5] bg-[#f5f5f5] text-sm text-[#525252]">
        {value || "—"}
      </div>
    </div>
  );
}

export function ExtraFields({
  code,
  systems,
  painPoints,
  ftes,
  onChange,
  language,
  prefix = "",
}: {
  code: string;
  systems: string;
  painPoints: string;
  ftes: string;
  onChange: (field: "code" | "systems" | "painPoints" | "ftes", v: string) => void;
  language: string;
  prefix?: string;
}) {
  const pt = language === "PT";
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}code`}>{pt ? "Código" : "Code"}</Label>
        <Input
          id={`${prefix}code`}
          value={code}
          onChange={(e) => onChange("code", e.target.value)}
          placeholder={pt ? "Ex: P&C-01" : "E.g.: P&C-01"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}systems`}>
          {pt ? "Sistemas/ferramentas" : "Systems/tools"}
        </Label>
        <Input
          id={`${prefix}systems`}
          value={systems}
          onChange={(e) => onChange("systems", e.target.value)}
          placeholder={pt ? "Ex: ERP, RPA, Planilhas" : "E.g.: ERP, RPA, Spreadsheets"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}pain`}>
          {pt ? "Dores e oportunidades" : "Pain points & opportunities"}
        </Label>
        <Textarea
          id={`${prefix}pain`}
          rows={3}
          value={painPoints}
          onChange={(e) => onChange("painPoints", e.target.value)}
          placeholder={
            pt
              ? "Principais dores e oportunidades de melhoria..."
              : "Main pain points and improvement opportunities..."
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}ftes`}>
          {pt ? "Dimensionamento (FTEs alocados)" : "Sizing (allocated FTEs)"}
        </Label>
        <Input
          id={`${prefix}ftes`}
          value={ftes}
          onChange={(e) => onChange("ftes", e.target.value)}
          placeholder={pt ? "Ex: 3,5 FTEs" : "E.g.: 3.5 FTEs"}
        />
      </div>
    </>
  );
}

export function BusinessUnitField({
  value,
  onChange,
  language,
  id = "businessUnit",
}: {
  value: string;
  onChange: (v: string) => void;
  language: string;
  id?: string;
}) {
  const pt = language === "PT";
  const { units, addUnit } = useBusinessUnitStore();
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState("");

  const confirm = () => {
    const clean = draft.trim();
    if (!clean) return;
    addUnit(clean);
    onChange(clean);
    setDraft("");
    setCreating(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {pt ? "Unidade de negócio" : "Business unit"}
      </Label>
      {creating ? (
        <div className="flex gap-2">
          <Input
            id={id}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirm();
              }
            }}
            placeholder={pt ? "Nome da unidade" : "Unit name"}
          />
          <Button type="button" variant="outline" className="rounded-sm" onClick={confirm}>
            {pt ? "Adicionar" : "Add"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-sm"
            onClick={() => {
              setCreating(false);
              setDraft("");
            }}
          >
            {pt ? "Cancelar" : "Cancel"}
          </Button>
        </div>
      ) : (
        <Select
          value={value || undefined}
          onValueChange={(v) => {
            if (v === "__new__") {
              setCreating(true);
              return;
            }
            onChange(v);
          }}
        >
          <SelectTrigger id={id}>
            <SelectValue placeholder={pt ? "Selecione..." : "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
            <SelectItem value="__new__" className="text-[#0C1BA8] font-medium">
              {pt ? "+ Nova unidade..." : "+ New unit..."}
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
