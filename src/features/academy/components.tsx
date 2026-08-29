import { AlertTriangle, BookOpen, Check, ChevronDown, Clock, FileQuestion, Pin, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { PersonalNote, TrainingProcess, TrainingStatus } from "./types";

const statusClasses: Record<string, string> = {
  "Concluído": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Publicado": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Válida": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Em andamento": "bg-blue-50 text-blue-700 border-blue-200",
  "Aguardando quiz": "bg-violet-50 text-violet-700 border-violet-200",
  "Reforço necessário": "bg-amber-50 text-amber-700 border-amber-200",
  "Próxima do vencimento": "bg-amber-50 text-amber-700 border-amber-200",
  "Atrasado": "bg-red-50 text-red-700 border-red-200",
  "Expirada": "bg-red-50 text-red-700 border-red-200",
  "Não iniciado": "bg-slate-50 text-slate-600 border-slate-200",
  "Rascunho": "bg-slate-50 text-slate-600 border-slate-200",
  "Suspenso": "bg-amber-50 text-amber-700 border-amber-200",
  "Arquivado": "bg-slate-100 text-slate-500 border-slate-200",
};

export function TrainingStatusBadge({ status }: { status: TrainingStatus | string }) {
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", statusClasses[status] || statusClasses["Não iniciado"])}>{status}</span>;
}

export function TrainingProgressBar({ value, label = true }: { value: number; label?: boolean }) {
  return <div className="flex items-center gap-3"><Progress value={value} className="h-2 flex-1" />{label && <span className="w-10 text-right text-xs font-medium text-muted-foreground">{value}%</span>}</div>;
}

export function TrainingProcessCard({ process, onOpen }: { process: TrainingProcess; onOpen: () => void }) {
  const action = process.status === "Não iniciado" ? "Iniciar" : process.status === "Concluído" ? "Revisar" : "Continuar";
  return (
    <article className="rounded-xl border bg-card p-5 transition hover:border-primary/30 hover:shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4"><div className="flex gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><BookOpen className="h-5 w-5 text-primary" /></div><div><h3 className="text-base font-semibold">{process.name}</h3><p className="mt-1 text-xs">{process.code} · {process.area}</p></div></div><TrainingStatusBadge status={process.status} /></div>
      <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{process.minutes} min</span><span>SOP {process.sopVersion}</span>{process.score !== undefined && <span>Nota {process.score}%</span>}</div>
      <TrainingProgressBar value={process.progress} />
      <Button variant="outline" className="mt-4 w-full" onClick={onOpen}>{action}</Button>
    </article>
  );
}

export function ProcessLearningStep({ index, step, understood, onToggle, onNote }: { index: number; step: { title: string; description: string; owner: string; system: string; input: string; output: string; evidence: string; attention: string }; understood: boolean; onToggle: () => void; onNote: () => void }) {
  return (
    <details className="group rounded-xl border bg-card" open={index === 0}>
      <summary className="flex cursor-pointer list-none items-center gap-4 p-5"><span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold", understood ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary")}>{understood ? <Check className="h-4 w-4" /> : index + 1}</span><div className="flex-1"><h3 className="text-base font-semibold">{step.title}</h3><p className="mt-0.5 text-xs">{step.owner} · {step.system}</p></div><ChevronDown className="h-4 w-4 text-muted-foreground transition group-open:rotate-180" /></summary>
      <div className="border-t px-5 pb-5 pt-4"><p className="text-sm text-foreground">{step.description}</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{[["Entrada", step.input], ["Saída", step.output], ["Evidência", step.evidence]].map(([label, value]) => <div key={label} className="rounded-lg bg-muted/60 p-3"><span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span><p className="mt-1 text-sm text-foreground">{value}</p></div>)}</div><div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{step.attention}</div><div className="mt-4 flex flex-wrap gap-2"><Button size="sm" variant={understood ? "secondary" : "default"} onClick={onToggle}>{understood ? "Etapa compreendida" : "Marcar como compreendida"}</Button><Button size="sm" variant="outline" onClick={onNote}>Adicionar anotação</Button><Button size="sm" variant="ghost" onClick={() => alert("Referência: SOP vigente, seção correspondente a esta etapa.")}>Ver referência na SOP</Button></div></div>
    </details>
  );
}

export function PersonalNoteCard({ note, onEdit, onDelete, onPin }: { note: PersonalNote; onEdit: () => void; onDelete: () => void; onPin: () => void }) {
  return <article className="rounded-xl border bg-card p-5"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><TrainingStatusBadge status={note.category} />{note.pinned && <Pin className="h-3.5 w-3.5 fill-primary text-primary" />}</div><h3 className="mt-3 text-sm font-semibold">{note.processName}</h3>{note.step && <p className="mt-1 text-xs">Etapa: {note.step}</p>}</div><div className="flex"><Button size="icon" variant="ghost" aria-label="Fixar anotação" onClick={onPin}><Pin className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Excluir anotação" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button></div></div><p className="mt-4 text-sm text-foreground">{note.content}</p><div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground"><span>SOP {note.sopVersion} · {note.updatedAt}</span><button className="font-medium text-primary hover:underline" onClick={onEdit}>Editar</button></div></article>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center"><FileQuestion className="mx-auto h-9 w-9 text-muted-foreground/50" /><h3 className="mt-4 text-base font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}
