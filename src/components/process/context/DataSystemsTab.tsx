import React, { useState } from 'react';
import { Database, Server, Search, ArrowRight, ShieldCheck, FileSpreadsheet, ArrowLeftRight, Link2, ExternalLink, Filter } from 'lucide-react';
import { useProcessContextStore } from '@/stores/processContextStore';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProcessContextModel, ContextDataObject, ContextSystem } from '@/types/processContext';

interface DataSystemsTabProps {
  context: ProcessContextModel;
}

export function DataSystemsTab({ context }: DataSystemsTabProps) {
  const { setSelectedItem } = useProcessContextStore();
  const [activeView, setActiveView] = useState<'data' | 'systems'>('data');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = context.dataObjects.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.businessMeaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSystems = context.systems.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header & View Toggle */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Catálogo de Dados, Arquivos e Sistemas</h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Rastreabilidade completa de como os dados são consumidos, manipulados e transitam entre interfaces humanas e integrações sistêmicas.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* View switcher */}
          <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border">
            <button
              onClick={() => setActiveView('data')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                activeView === 'data'
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Database className="h-3.5 w-3.5 text-primary" />
              Objetos de Dados ({context.dataObjects.length})
            </button>
            <button
              onClick={() => setActiveView('systems')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                activeView === 'systems'
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Server className="h-3.5 w-3.5 text-primary" />
              Sistemas & Canais ({context.systems.length})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-52">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou termo..."
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Data Objects View */}
      {activeView === 'data' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map((data) => {
              const consumingActs = context.activities.filter((a) => a.consumedDataIds.includes(data.id));
              const producingActs = context.activities.filter((a) => a.producedDataIds.includes(data.id));

              return (
                <div
                  key={data.id}
                  onClick={() => setSelectedItem({ type: 'data', id: data.id })}
                  className="p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md cursor-pointer transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-foreground">{data.name}</h3>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground block">
                        {data.collectionOrFormat}
                      </span>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-medium shrink-0",
                        data.transferMechanism === 'direct_api' ? "text-emerald-700 dark:text-emerald-300 border-emerald-300" :
                        data.transferMechanism === 'file_export_import' ? "text-sky-700 dark:text-sky-300 border-sky-300" :
                        "text-amber-700 dark:text-amber-300 border-amber-300"
                      )}
                    >
                      {data.transferMechanism === 'manual' ? 'Manual' :
                       data.transferMechanism === 'file_export_import' ? 'Arquivo' : 'API Direta'}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {data.businessMeaning}
                  </p>

                  {/* Lineage: Produced by & Consumed by */}
                  <div className="pt-3 border-t border-border/60 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                        Gerado / Alimentado por:
                      </span>
                      {producingActs.length > 0 ? (
                        <div className="space-y-0.5">
                          {producingActs.map((act) => (
                            <span key={act.id} className="text-[11px] text-foreground font-medium block truncate">
                              {act.code} · {act.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">Entrada Externa</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                        Consumido por:
                      </span>
                      {consumingActs.length > 0 ? (
                        <div className="space-y-0.5">
                          {consumingActs.map((act) => (
                            <span key={act.id} className="text-[11px] text-foreground font-medium block truncate">
                              {act.code} · {act.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">Saída Final</span>
                      )}
                    </div>
                  </div>

                  {/* Fields summary */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      <strong className="text-foreground">{data.essentialFields.length}</strong> campos essenciais mapeados
                    </span>
                    <span className="text-primary font-medium flex items-center gap-1 hover:underline">
                      Inspecionar campos
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Systems & Channels View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSystems.map((system) => {
              const connectedActivities = context.activities.filter((a) => system.associatedActivityIds.includes(a.id));
              const connectedData = context.dataObjects.filter((d) => system.dataObjectIds.includes(d.id));

              return (
                <div
                  key={system.id}
                  onClick={() => setSelectedItem({ type: 'system', id: system.id })}
                  className="p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md cursor-pointer transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{system.name}</h3>
                      {system.moduleOrInterface && (
                        <span className="text-[11px] font-mono text-muted-foreground block mt-0.5">
                          {system.moduleOrInterface}
                        </span>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-normal uppercase">
                      {system.category.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {system.purpose}
                  </p>

                  {/* Operations Chips */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1.5">
                      Operações Mapeadas ({system.operations.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {system.operations.map((op, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-md bg-muted/60 text-foreground border border-border font-medium"
                        >
                          {op.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connected Data */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Participa de <strong className="text-foreground">{connectedActivities.length}</strong> atividades
                    </span>
                    <span className="text-primary font-medium flex items-center gap-1 hover:underline">
                      Ver limitações e detalhes
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
