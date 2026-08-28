import { useState } from "react";
import { ChevronDown, ChevronUp, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProcessAttributesFormProps {
  process: {
    name: string;
    area: string;
    description: string;
    executor: string;
    approver: string;
    frequency?: string;
    avgTime?: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

const areas = ["S2P", "H2R", "OTC", "R2R", "Finance", "HR", "Operations", "IT", "Legal", "Marketing"];
const frequencies = ["Diário", "Semanal", "Mensal", "Trimestral", "Anual", "Sob Demanda"];
const statuses = ["Ativo", "Em Revisão", "Inativo", "Rascunho"];
const priorities = ["Alta", "Média", "Baixa"];
const complexities = ["Alta", "Média", "Baixa"];

export function ProcessAttributesForm({ process, onSave, onCancel }: ProcessAttributesFormProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    // Informações Básicas
    name: process.name,
    area: process.area,
    description: process.description,
    status: "Ativo",
    priority: "Média",
    
    // Cadeia de Valor
    l1: "Operações",
    l2: "Logística",
    l3: "Gestão de Fretes",
    l4: "Cotação Emergencial",
    
    // Stakeholders
    executor: process.executor,
    approver: process.approver,
    owner: "Gerente de Logística",
    supportTeam: "Equipe de Fretes",
    
    // Execução
    avgTime: process.avgTime || "2-3 dias úteis",
    frequency: process.frequency || "Semanal",
    complexity: "Média",
    
    // Sistemas e Ferramentas
    systems: "ServiceNow, SAP, Excel",
    integrations: "SAP ERP, Portal Transportadoras",
    
    // Compliance
    regulations: "ISO 9001, Política Interna de Logística",
    sla: "24 horas para resposta inicial",
    
    // Métricas
    kpiPrimary: "Tempo médio de cotação",
    kpiSecondary: "Taxa de aprovação na primeira tentativa",
    
    // Documentação
    lastReview: "2024-01-10",
    nextReview: "2024-07-10",
    version: "2.1",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            {language === "PT" ? "Atributos do Processo" : "Process Attributes"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {language === "PT" 
              ? "Defina as propriedades e configurações do processo" 
              : "Define process properties and settings"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
            <X className="h-4 w-4" />
            {language === "PT" ? "Cancelar" : "Cancel"}
          </Button>
          <Button type="submit" variant="corporate" onClick={handleSubmit} className="gap-2">
            <Save className="h-4 w-4" />
            {language === "PT" ? "Salvar Alterações" : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid Layout - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column */}
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                {language === "PT" ? "Informações Básicas" : "Basic Information"}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Nome do Processo" : "Process Name"} *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="area" className="text-xs font-medium text-muted-foreground">
                      {language === "PT" ? "Área" : "Area"} *
                    </Label>
                    <Select value={formData.area} onValueChange={(v) => updateField("area", v)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-xs font-medium text-muted-foreground">
                      Status
                    </Label>
                    <Select value={formData.status} onValueChange={(v) => updateField("status", v)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Descrição" : "Description"} *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="mt-1.5 min-h-20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority" className="text-xs font-medium text-muted-foreground">
                      {language === "PT" ? "Prioridade" : "Priority"}
                    </Label>
                    <Select value={formData.priority} onValueChange={(v) => updateField("priority", v)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="complexity" className="text-xs font-medium text-muted-foreground">
                      {language === "PT" ? "Complexidade" : "Complexity"}
                    </Label>
                    <Select value={formData.complexity} onValueChange={(v) => updateField("complexity", v)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {complexities.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Cadeia de Valor */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                {language === "PT" ? "Cadeia de Valor" : "Value Chain"}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="l1" className="text-xs font-medium text-muted-foreground">L1</Label>
                  <Input
                    id="l1"
                    value={formData.l1}
                    onChange={(e) => updateField("l1", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="l2" className="text-xs font-medium text-muted-foreground">L2</Label>
                  <Input
                    id="l2"
                    value={formData.l2}
                    onChange={(e) => updateField("l2", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="l3" className="text-xs font-medium text-muted-foreground">L3</Label>
                  <Input
                    id="l3"
                    value={formData.l3}
                    onChange={(e) => updateField("l3", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="l4" className="text-xs font-medium text-muted-foreground">L4</Label>
                  <Input
                    id="l4"
                    value={formData.l4}
                    onChange={(e) => updateField("l4", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Sistemas e Ferramentas */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                {language === "PT" ? "Sistemas e Ferramentas" : "Systems & Tools"}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="systems" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Sistemas Utilizados" : "Systems Used"}
                  </Label>
                  <Input
                    id="systems"
                    value={formData.systems}
                    onChange={(e) => updateField("systems", e.target.value)}
                    placeholder={language === "PT" ? "Ex: SAP, ServiceNow, Excel" : "E.g.: SAP, ServiceNow, Excel"}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="integrations" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Integrações" : "Integrations"}
                  </Label>
                  <Input
                    id="integrations"
                    value={formData.integrations}
                    onChange={(e) => updateField("integrations", e.target.value)}
                    placeholder={language === "PT" ? "Ex: APIs, Webhooks" : "E.g.: APIs, Webhooks"}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stakeholders */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                Stakeholders
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="executor" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Executor" : "Executor"}
                  </Label>
                  <Input
                    id="executor"
                    value={formData.executor}
                    onChange={(e) => updateField("executor", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="approver" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Aprovador" : "Approver"}
                  </Label>
                  <Input
                    id="approver"
                    value={formData.approver}
                    onChange={(e) => updateField("approver", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="owner" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Dono do Processo" : "Process Owner"}
                  </Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => updateField("owner", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="supportTeam" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Equipe de Suporte" : "Support Team"}
                  </Label>
                  <Input
                    id="supportTeam"
                    value={formData.supportTeam}
                    onChange={(e) => updateField("supportTeam", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Execução */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                {language === "PT" ? "Execução" : "Execution"}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="avgTime" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Tempo Médio" : "Average Time"}
                  </Label>
                  <Input
                    id="avgTime"
                    value={formData.avgTime}
                    onChange={(e) => updateField("avgTime", e.target.value)}
                    placeholder="Ex: 2-3 dias"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Frequência" : "Frequency"}
                  </Label>
                  <Select value={formData.frequency} onValueChange={(v) => updateField("frequency", v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="sla" className="text-xs font-medium text-muted-foreground">
                    SLA
                  </Label>
                  <Input
                    id="sla"
                    value={formData.sla}
                    onChange={(e) => updateField("sla", e.target.value)}
                    placeholder={language === "PT" ? "Ex: 24h para resposta" : "E.g.: 24h response time"}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                {language === "PT" ? "Compliance e Regulação" : "Compliance & Regulation"}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="regulations" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Regulações Aplicáveis" : "Applicable Regulations"}
                  </Label>
                  <Textarea
                    id="regulations"
                    value={formData.regulations}
                    onChange={(e) => updateField("regulations", e.target.value)}
                    placeholder={language === "PT" ? "Ex: ISO 9001, SOX, LGPD" : "E.g.: ISO 9001, SOX, GDPR"}
                    className="mt-1.5 min-h-16"
                  />
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                KPIs
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="kpiPrimary" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "KPI Primário" : "Primary KPI"}
                  </Label>
                  <Input
                    id="kpiPrimary"
                    value={formData.kpiPrimary}
                    onChange={(e) => updateField("kpiPrimary", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="kpiSecondary" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "KPI Secundário" : "Secondary KPI"}
                  </Label>
                  <Input
                    id="kpiSecondary"
                    value={formData.kpiSecondary}
                    onChange={(e) => updateField("kpiSecondary", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Documentação */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                {language === "PT" ? "Controle de Documentação" : "Documentation Control"}
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="version" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Versão" : "Version"}
                  </Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => updateField("version", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lastReview" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Última Revisão" : "Last Review"}
                  </Label>
                  <Input
                    id="lastReview"
                    type="date"
                    value={formData.lastReview}
                    onChange={(e) => updateField("lastReview", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="nextReview" className="text-xs font-medium text-muted-foreground">
                    {language === "PT" ? "Próxima Revisão" : "Next Review"}
                  </Label>
                  <Input
                    id="nextReview"
                    type="date"
                    value={formData.nextReview}
                    onChange={(e) => updateField("nextReview", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}