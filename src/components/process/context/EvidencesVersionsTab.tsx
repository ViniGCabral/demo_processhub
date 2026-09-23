import React, { useState } from 'react';
import { ShieldCheck, Video, FileText, Monitor, CheckCircle2, History, UserCheck, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProcessContextModel, ContextEvidence } from '@/types/processContext';

interface EvidencesVersionsTabProps {
  context: ProcessContextModel;
}

export function EvidencesVersionsTab({ context }: EvidencesVersionsTabProps) {
  const [selectedNature, setSelectedNature] = useState<string>('all');

  const filteredEvidences = context.evidences.filter((e) => {
    if (selectedNature !== 'all' && e.nature !== selectedNature) return false;
    return true;
  });

  const getEvidenceIcon = (type: ContextEvidence['type']) => {
    switch (type) {
      case 'video_clip': return <Video className="h-4 w-4 text-sky-500" />;
      case 'transcript_excerpt': return <FileText className="h-4 w-4 text-violet-500" />;
      case 'document': return <FileText className="h-4 w-4 text-emerald-500" />;
      case 'screen_capture': return <Monitor className="h-4 w-4 text-amber-500" />;
      case 'human_confirmation': return <UserCheck className="h-4 w-4 text-primary" />;
      default: return <ShieldCheck className="h-4 w-4" />;
    }
  };

  const getNatureBadge = (nature: ContextEvidence['nature']) => {
    switch (nature) {
      case 'observed':
        return <Badge variant="outline" className="text-sky-700 dark:text-sky-300 border-sky-300 bg-sky-50/50">Observado</Badge>;
      case 'declared':
        return <Badge variant="outline" className="text-violet-700 dark:text-violet-300 border-violet-300 bg-violet-50/50">Relatado / Declarado</Badge>;
      case 'inferred':
        return <Badge variant="outline" className="text-amber-700 dark:text-amber-300 border-amber-300 bg-amber-50/50">Inferência da IA</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="text-emerald-700 dark:text-emerald-300 border-emerald-300 bg-emerald-50/50">Confirmado pelo Dono</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Rastreabilidade de Evidências & Versionamento</h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Diferenciação auditável entre o que foi diretamente observado em vídeo, declarado por especialistas, inferido por modelos de IA e homologado por responsáveis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['all', 'observed', 'declared', 'confirmed', 'inferred'].map((nat) => (
            <Button
              key={nat}
              variant={selectedNature === nat ? "default" : "outline"}
              size="sm"
              className="text-xs capitalize h-8"
              onClick={() => setSelectedNature(nat)}
            >
              {nat === 'all' ? 'Todas' :
               nat === 'observed' ? 'Observadas' :
               nat === 'declared' ? 'Declaradas' :
               nat === 'confirmed' ? 'Confirmadas' : 'Inferências'}
            </Button>
          ))}
        </div>
      </div>

      {/* Evidences Grid */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-wider text-muted-foreground px-1">
          Materiais de Sustentação Mapeados ({filteredEvidences.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvidences.map((ev) => (
            <div
              key={ev.id}
              className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getEvidenceIcon(ev.type)}
                  <h4 className="font-semibold text-sm text-foreground">{ev.sourceTitle}</h4>
                </div>
                {getNatureBadge(ev.nature)}
              </div>

              <div className="p-2.5 rounded-lg bg-muted/30 border border-border text-xs font-mono text-muted-foreground">
                {ev.sourceReference}
              </div>

              {ev.snippet && (
                <p className="text-xs text-foreground italic bg-card p-3 rounded-lg border border-border/80 leading-relaxed">
                  "{ev.snippet}"
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>Fonte: {ev.authorOrSpeaker || 'Sistema de Gravação'}</span>
                <span>Registrado em: {ev.recordedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version History Section */}
      <div className="pt-6 border-t border-border space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Histórico de Versões do Contexto</h3>
        </div>

        <div className="space-y-3">
          {context.versionsHistory.map((ver) => (
            <div
              key={ver.version}
              className={cn(
                "p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-all",
                ver.isCurrent ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{ver.version}</span>
                  {ver.isCurrent && (
                    <Badge className="text-[10px] bg-primary text-primary-foreground font-normal">Versão Atual</Badge>
                  )}
                  <span className="text-muted-foreground">· {ver.date} por {ver.author}</span>
                </div>
                <p className="text-muted-foreground">{ver.summary}</p>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground shrink-0">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {ver.confirmedCount} confirmadas
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  {ver.pendingCount} pendentes
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
