import { useMemo, useState } from "react";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bot, Building2, CalendarClock, Check,
  CheckCircle2, ChevronDown, FileText, Link2, MessageSquareText, Paperclip,
  Plus, Search, ShieldCheck, Sparkles, Upload, UserRound, X,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; onComplete: () => void };
type TypeId = "POL" | "NOR" | "PRO" | "IT";

const typeRules: Record<TypeId, { name: string; description: string; code: string; template: string; years: number; approver: string; total: string }> = {
  POL: { name: "Política", description: "Diretrizes corporativas de longo prazo.", code: "POL-020", template: "POL_Template_v3.docx", years: 5, approver: "DE + CA · externa", total: "~15 dias úteis" },
  NOR: { name: "Norma", description: "Regras corporativas transversais.", code: "NOR-248", template: "NOR_Template_v4.docx", years: 5, approver: "Diretoria Executiva · externa", total: "~12 dias úteis" },
  PRO: { name: "Procedimento", description: "Operacionalização de uma norma.", code: "PRO-0043", template: "PRO_Template_v6.docx", years: 3, approver: "Vice-presidência", total: "~10 dias úteis" },
  IT: { name: "Instrução de Trabalho", description: "Passo a passo de execução.", code: "IT-0188", template: "IT_Template_v5.docx", years: 3, approver: "Gerência", total: "~8 dias úteis" },
};

const steps = [
  ["request", "Solicitação"], ["identity", "Identificação"], ["owners", "Responsáveis"],
  ["content", "Conteúdo"], ["files", "Vigência e anexos"], ["route", "Fluxo"], ["review", "Revisão"],
] as const;

export function NormativeDemandWizard({ open, onOpenChange, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [requestKind, setRequestKind] = useState("create");
  const [type, setType] = useState<TypeId>("PRO");
  const [access, setAccess] = useState("Interno");
  const [title, setTitle] = useState("Procedimento de Gestão de Fornecedores Críticos");
  const [objective, setObjective] = useState("Estabelecer critérios para seleção, homologação, avaliação e acompanhamento de fornecedores críticos da organização.");
  const [scope, setScope] = useState("Aplica-se às áreas de Suprimentos, Operações, Jurídico e Compliance envolvidas na contratação e gestão de terceiros.");
  const rule = typeRules[type];
  const progress = Math.round(((step + 1) / steps.length) * 100);
  const nextReview = useMemo(() => rule.years === 5 ? "28/08/2031" : "28/08/2029", [rule.years]);

  const close = () => { onOpenChange(false); setStep(0); };
  const next = () => step === steps.length - 1 ? onComplete() : setStep((value) => value + 1);

  return (
    <Dialog open={open} onOpenChange={(value) => value ? onOpenChange(true) : close()}>
      <DialogContent className="max-w-[1120px] p-0 overflow-hidden rounded-2xl border-0 gap-0">
        <div className="grid grid-cols-[220px_minmax(0,1fr)_270px] min-h-[690px] max-h-[92vh] normative-wizard">
          <aside className="bg-[#0B1D48] text-white p-6 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-[.14em] text-white/50 font-semibold mb-2">Nova demanda</div>
            <h2 className="text-lg text-white font-semibold leading-tight mb-2">Crie com segurança, passo a passo</h2>
            <p className="text-[11px] text-white/55 leading-4 mb-7">O fluxo e as regras se adaptam ao tipo documental.</p>
            <div className="space-y-1">
              {steps.map(([id, label], index) => (
                <button key={id} onClick={() => index <= step && setStep(index)} className={cn("w-full flex gap-3 items-center rounded-lg p-2.5 text-left", index === step && "bg-white/10", index < step && "cursor-pointer")}>
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0", index < step ? "bg-emerald-500" : index === step ? "bg-white text-[#0B1D48]" : "bg-white/10 text-white/45")}>{index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}</div>
                  <span className={cn("text-[11px]", index === step ? "text-white font-medium" : "text-white/55")}>{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-7">
              <div className="flex justify-between text-[9px] text-white/50 mb-1.5"><span>Progresso</span><span>{progress}%</span></div>
              <div className="h-1 bg-white/10 rounded-full"><div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
            </div>
          </aside>

          <main className="p-7 overflow-y-auto bg-card">
            <div className="flex items-start justify-between mb-6">
              <div><div className="section-title mb-1.5">Etapa {step + 1} de {steps.length}</div><h2 className="text-[21px] font-semibold">{stepTitles[step].title}</h2><p className="text-xs mt-1">{stepTitles[step].description}</p></div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Salvo automaticamente</div>
            </div>

            {step === 0 && <RequestStep value={requestKind} onChange={setRequestKind} />}
            {step === 1 && <IdentityStep type={type} setType={setType} title={title} setTitle={setTitle} access={access} setAccess={setAccess} />}
            {step === 2 && <OwnersStep />}
            {step === 3 && <ContentStep objective={objective} setObjective={setObjective} scope={scope} setScope={setScope} />}
            {step === 4 && <FilesStep rule={rule} nextReview={nextReview} />}
            {step === 5 && <RouteStep type={type} rule={rule} />}
            {step === 6 && <ReviewStep type={type} rule={rule} title={title} access={access} nextReview={nextReview} />}

            <div className="pt-5 border-t mt-7 flex justify-between items-center">
              <button onClick={() => step === 0 ? close() : setStep((value) => value - 1)} className="h-9 px-4 border border-border rounded-lg text-xs flex items-center gap-2 hover:bg-muted/50">{step > 0 && <ArrowLeft className="h-3.5 w-3.5" />}{step === 0 ? "Cancelar" : "Voltar"}</button>
              <div className="flex items-center gap-3"><button className="text-xs text-muted-foreground hover:text-foreground">Salvar e sair</button><button onClick={next} className="h-9 px-5 bg-primary text-white rounded-lg text-xs font-medium flex items-center gap-2">{step === steps.length - 1 ? "Criar e enviar" : "Continuar"}<ArrowRight className="h-3.5 w-3.5" /></button></div>
            </div>
          </main>

          <AssistantPanel step={step} type={type} title={title} scope={scope} />
        </div>
        <style>{`@media(max-width:980px){.normative-wizard{grid-template-columns:190px minmax(0,1fr)!important}.normative-wizard>aside:last-child{display:none}} @media(max-width:700px){.normative-wizard{display:block!important}.normative-wizard>aside:first-child{display:none}.normative-wizard>main{max-height:88vh}}`}</style>
      </DialogContent>
    </Dialog>
  );
}

const stepTitles = [
  { title: "O que você precisa fazer?", description: "Escolha a natureza da solicitação para adaptar o cadastro." },
  { title: "Identifique o normativo", description: "O tipo define código, template, vigência e alçada." },
  { title: "Defina responsáveis", description: "Confirme a área dona, o responsável técnico e o sponsor." },
  { title: "Descreva conteúdo e escopo", description: "A IA ajuda a melhorar clareza, completude e conformidade." },
  { title: "Configure vigência e evidências", description: "Datas são calculadas automaticamente e arquivos ficam vinculados à demanda." },
  { title: "Confira o fluxo previsto", description: "Veja antecipadamente validadores, prazos e aprovação final." },
  { title: "Revise antes de enviar", description: "Confira os dados, as recomendações e quem receberá a primeira tarefa." },
];

function RequestStep({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const options = [["create", "Criar novo normativo", "Começar um documento do zero."], ["review", "Revisar existente", "Atualizar conteúdo ou regras."], ["renew", "Renovar sem alterações", "Revalidar a versão vigente."], ["revoke", "Revogar normativo", "Encerrar formalmente sua validade."]];
  return <div className="grid grid-cols-2 gap-3">{options.map(([id, title, description]) => <button key={id} onClick={() => onChange(id)} className={cn("rounded-xl border p-4 text-left transition-all", value === id ? "border-primary bg-primary/5 ring-1 ring-primary/10" : "hover:border-primary/30")}><div className="flex justify-between mb-4"><div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center"><FileText className="h-4 w-4 text-primary" /></div>{value === id && <CheckCircle2 className="h-5 w-5 text-primary" />}</div><h3 className="text-sm font-semibold mb-1">{title}</h3><p className="text-xs">{description}</p></button>)}</div>;
}

function IdentityStep({ type, setType, title, setTitle, access, setAccess }: { type: TypeId; setType: (v: TypeId) => void; title: string; setTitle: (v: string) => void; access: string; setAccess: (v: string) => void }) {
  const rule = typeRules[type];
  return <div className="space-y-5"><div className="grid grid-cols-4 gap-2">{(Object.keys(typeRules) as TypeId[]).map((id) => <button key={id} onClick={() => setType(id)} className={cn("rounded-lg border p-3 text-left", type === id ? "border-primary bg-primary/5" : "hover:border-primary/30")}><div className="text-xs font-bold text-primary">{id}</div><div className="text-[11px] font-medium mt-1">{typeRules[id].name}</div></button>)}</div><div className="rounded-lg bg-[#F7F8FF] border border-[#E3E7FF] px-4 py-3 flex flex-wrap gap-x-5 gap-y-1 text-[10px]"><span><strong>Código:</strong> {rule.code}</span><span><strong>Template:</strong> {rule.template}</span><span><strong>Vigência:</strong> {rule.years} anos</span></div><Field label="Título do normativo *" value={title} onChange={setTitle} helper={`${title.length} caracteres · mínimo 10`} /><div className="grid grid-cols-2 gap-4"><SelectField label="Empresa *" value="AXIA Energia" /><SelectField label="Área demandante *" value="Suprimentos" /><SelectField label="VP / Diretoria *" value="VP Operações" /><SelectField label="Centro de custos *" value="CC-4521 · Suprimentos" /></div><div><div className="text-xs font-medium mb-2">Nível de acesso *</div><div className="flex gap-2">{["Público", "Interno", "Setorial", "Confidencial"].map((item) => <button key={item} onClick={() => setAccess(item)} className={cn("h-8 px-3 rounded-lg border text-[11px]", access === item ? "border-primary bg-primary/5 text-primary font-medium" : "border-border")}>{item}</button>)}</div><p className="text-[10px] mt-2">{access === "Interno" ? "Acessível a todos os colaboradores, sem restrição setorial." : `Acesso classificado como ${access.toLowerCase()}.`}</p></div></div>;
}

function OwnersStep() {
  return <div className="space-y-4"><PersonCard initials="PL" name="Patrícia Lima" role="Solicitante · Suprimentos" label="Solicitante" locked /><PersonCard initials="JM" name="João Mendes" role="Gerente · Gestão de Fornecedores" label="Responsável técnico *" /><PersonCard initials="CR" name="Carlos Ribeiro" role="VP de Operações" label="Sponsor executivo · opcional" /><div className="grid grid-cols-2 gap-4 pt-2"><SelectField label="Processo corporativo *" value="Gestão de fornecedores" icon={<Link2 className="h-4 w-4" />} /><SelectField label="Analista de Normativos" value="Carlos Silva" icon={<ShieldCheck className="h-4 w-4" />} /></div><div className="border rounded-xl p-4"><div className="flex items-center justify-between"><div><div className="text-xs font-medium">Subprocessos sugeridos pela IA</div><p className="text-[10px] mt-1">Confirme os vínculos que ajudam busca e análise de sobreposição.</p></div><Sparkles className="h-4 w-4 text-primary" /></div><div className="flex flex-wrap gap-2 mt-3">{["Homologação", "Avaliação periódica", "Gestão contratual"].map((item) => <span key={item} className="inline-flex items-center gap-1.5 bg-primary/5 text-primary border border-primary/10 rounded-full px-2.5 py-1 text-[10px]"><Check className="h-3 w-3" />{item}</span>)}</div></div></div>;
}

function ContentStep({ objective, setObjective, scope, setScope }: { objective: string; setObjective: (v: string) => void; scope: string; setScope: (v: string) => void }) {
  return <div className="space-y-5"><TextAreaField label="Objetivo do normativo *" value={objective} onChange={setObjective} helper="Explique o resultado esperado, sem detalhar o passo a passo." /><TextAreaField label="Escopo de aplicação *" value={scope} onChange={setScope} helper="Inclua áreas, unidades, públicos e exclusões quando necessário." /><div className="grid grid-cols-2 gap-4"><SelectField label="Referência regulatória" value="Resolução ANEEL 964/2021" /><SelectField label="Normativo relacionado" value="NOR-0018 · Gestão de terceiros" /></div><div className="border rounded-xl p-4 bg-amber-50/50"><div className="flex gap-3"><AlertTriangle className="h-4 w-4 text-amber-700 mt-0.5" /><div><div className="text-xs font-semibold text-amber-900">Possível conteúdo complementar</div><p className="text-[11px] text-amber-800 mt-1 leading-4">A NOR-0018 possui 18% de similaridade. Não há conflito, mas vale referenciá-la na seção de documentos relacionados.</p><button className="text-[10px] text-amber-900 font-semibold mt-2 underline">Ver análise comparativa</button></div></div></div></div>;
}

function FilesStep({ rule, nextReview }: { rule: (typeof typeRules)[TypeId]; nextReview: string }) {
  return <div className="space-y-5"><div className="grid grid-cols-3 gap-3"><ReadOnlyValue label="Início de vigência" value="28/08/2026" /><ReadOnlyValue label="Período" value={`${rule.years} anos · automático`} /><ReadOnlyValue label="Próxima revisão" value={nextReview} /></div><div className="border border-dashed rounded-xl p-6 text-center"><Upload className="h-6 w-6 text-primary mx-auto mb-3" /><div className="text-xs font-medium">Arraste arquivos ou clique para selecionar</div><p className="text-[10px] mt-1">PDF, DOCX ou XLSX · até 50 MB por arquivo</p><button className="mt-3 h-8 px-3 border rounded-lg text-[11px]">Selecionar arquivos</button></div><div className="space-y-2">{[["Matriz_Criticidade_v3.xlsx", "124 KB", "Evidência técnica"], ["Resolucao_ANEEL_964_2021.pdf", "2,4 MB", "Referência regulatória"]].map(([name, size, kind]) => <div key={name} className="border rounded-lg p-3 flex items-center gap-3"><div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center"><Paperclip className="h-4 w-4 text-primary" /></div><div className="flex-1"><div className="text-[11px] font-medium">{name}</div><div className="text-[9px] text-muted-foreground mt-0.5">{kind} · {size}</div></div><button aria-label={`Remover ${name}`}><X className="h-4 w-4 text-muted-foreground" /></button></div>)}</div><div className="flex items-center gap-2 text-[10px] text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" /> Alertas serão enviados em 90, 60 e 30 dias antes da revisão.</div></div>;
}

function RouteStep({ type, rule }: { type: TypeId; rule: (typeof typeRules)[TypeId] }) {
  const middle = type === "IT" ? ["Normativos", "Jurídico"] : type === "PRO" ? ["Normativos", "Jurídico"] : ["Normativos", "Compliance", "Gov. Corporativa", "Jurídico"];
  return <div><div className="bg-[#F7F8FF] border border-[#E3E7FF] rounded-xl p-4 mb-5"><div className="text-xs font-semibold mb-1">Fluxo configurado para {type}</div><p className="text-[10px]">SLA total estimado: {rule.total} · FUP automático 3 dias úteis antes de cada vencimento.</p></div><div className="space-y-2">{[...middle, rule.approver, "Publicação no SharePoint"].map((item, index) => <div key={item} className="flex items-center gap-3"><div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold", index === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>{index + 1}</div><div className="border rounded-lg p-3 flex-1 flex items-center justify-between"><div><div className="text-xs font-medium">{item}</div><div className="text-[10px] text-muted-foreground mt-0.5">{item.includes("SharePoint") ? "Automático após aprovação final" : item.includes("externa") ? "Deliberação externa · documento bloqueado" : item === rule.approver ? "Alçada final" : "SLA 3 dias úteis"}</div></div>{item.includes("externa") && <span className="text-[9px] bg-amber-50 text-amber-800 rounded px-2 py-1">EXTERNA</span>}</div></div>)}</div><div className="mt-5 border rounded-xl p-4 flex items-center gap-3"><MessageSquareText className="h-4 w-4 text-primary" /><div className="flex-1"><div className="text-xs font-medium">Comunicação da demanda</div><p className="text-[10px] mt-1">Inicie uma conversa antes da submissão. O histórico seguirá com a demanda.</p></div><button className="text-[10px] text-primary font-semibold">Iniciar conversa</button></div></div>;
}

function ReviewStep({ type, rule, title, access, nextReview }: { type: TypeId; rule: (typeof typeRules)[TypeId]; title: string; access: string; nextReview: string }) {
  const rows = [["Solicitação", "Criar novo normativo"], ["Documento", `${type} · ${title}`], ["Código e template", `${rule.code} · ${rule.template}`], ["Organização", "AXIA Energia · Suprimentos · VP Operações"], ["Responsável", "João Mendes · Gestão de Fornecedores"], ["Acesso", access], ["Vigência", `${rule.years} anos · revisão em ${nextReview}`], ["Alçada final", rule.approver]];
  return <div><div className="border rounded-xl divide-y">{rows.map(([key, value]) => <div key={key} className="flex px-4 py-2.5"><span className="text-[10px] text-muted-foreground w-32 shrink-0">{key}</span><span className="text-[11px] font-medium">{value}</span></div>)}</div><div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /><div><div className="text-xs font-semibold text-emerald-800">9 de 9 validações atendidas</div><p className="text-[10px] text-emerald-700 mt-1">Ao enviar, {rule.code} será criado e a equipe de Normativos receberá a primeira tarefa.</p></div></div></div>;
}

function AssistantPanel({ step, type, title, scope }: { step: number; type: TypeId; title: string; scope: string }) {
  const findings = step < 3 ? ["Classificação compatível", "Processo corporativo vinculado"] : ["Título objetivo", "Escopo claro", "Referência regulatória identificada"];
  return <aside className="border-l border-border bg-[#FAFAFC] p-5 overflow-y-auto"><div className="flex items-center gap-2 text-primary mb-1"><Bot className="h-4 w-4" /><span className="text-xs font-semibold">Assistente NormaVita</span><span className="ml-auto text-[9px] bg-primary text-white rounded px-1.5 py-0.5">IA</span></div><p className="text-[10px] mb-5">Análise contínua, sem alterar seus dados automaticamente.</p><div className="bg-white border rounded-xl p-4 mb-4"><div className="flex justify-between text-[11px] font-semibold mb-2"><span>Checklist de qualidade</span><span>{step < 3 ? "6/9" : "9/9"}</span></div><div className="h-1.5 bg-muted rounded-full mb-3"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: step < 3 ? "67%" : "100%" }} /></div>{findings.map((item) => <div key={item} className="flex gap-2 py-1.5 text-[10px]"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{item}</div>)}</div>{step === 1 && <AssistantCard title="Classificação validada" text={`${title || "O título"} é compatível com ${typeRules[type].name}.`} />}{step >= 3 && <AssistantCard title="Sobreposição controlada" text="18% de similaridade com NOR-0018; conteúdo complementar, sem conflito." warning />}{scope && step >= 3 && <AssistantCard title="Sugestão de refinamento" text="Considere explicitar a periodicidade de avaliação no escopo." action="Aplicar sugestão" />}</aside>;
}

function AssistantCard({ title, text, action, warning }: { title: string; text: string; action?: string; warning?: boolean }) { return <div className={cn("border rounded-xl p-3 mb-3 bg-white", warning && "border-amber-200 bg-amber-50/40")}><div className="flex gap-2 items-center text-[11px] font-semibold mb-1"><Sparkles className={cn("h-3.5 w-3.5", warning ? "text-amber-600" : "text-primary")} />{title}</div><p className="text-[10px] leading-4">{text}</p>{action && <button className="text-[10px] text-primary font-semibold mt-2">{action}</button>}</div>; }
function Field({ label, value, onChange, helper }: { label: string; value: string; onChange: (v: string) => void; helper?: string }) { return <label><span className="text-xs font-medium block mb-1.5">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10 border rounded-lg px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />{helper && <span className="text-[9px] text-muted-foreground mt-1 block">{helper}</span>}</label>; }
function SelectField({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) { return <label><span className="text-xs font-medium block mb-1.5">{label}</span><button className="w-full h-10 border rounded-lg px-3 flex items-center gap-2 text-xs text-left">{icon}<span className="flex-1">{value}</span><ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /></button></label>; }
function TextAreaField({ label, value, onChange, helper }: { label: string; value: string; onChange: (v: string) => void; helper: string }) { return <label><span className="text-xs font-medium block mb-1.5">{label}</span><textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full min-h-[105px] border rounded-lg p-3 text-xs leading-5 resize-none outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" /><span className="text-[9px] text-muted-foreground mt-1 block">{helper}</span></label>; }
function PersonCard({ initials, name, role, label, locked }: { initials: string; name: string; role: string; label: string; locked?: boolean }) { return <div><div className="text-xs font-medium mb-1.5">{label}</div><div className="border rounded-xl p-3 flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold">{initials}</div><div className="flex-1"><div className="text-xs font-medium">{name}</div><div className="text-[10px] text-muted-foreground mt-0.5">{role}</div></div>{!locked && <button className="text-[10px] text-primary font-medium">Alterar</button>}</div></div>; }
function ReadOnlyValue({ label, value }: { label: string; value: string }) { return <div className="border rounded-xl p-3"><div className="text-[9px] text-muted-foreground mb-1">{label}</div><div className="text-[11px] font-medium">{value}</div></div>; }
