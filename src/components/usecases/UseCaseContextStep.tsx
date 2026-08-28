import { useState, useMemo } from "react";
import { Loader2, Sparkles, ChevronDown, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUseCaseStore } from "@/stores/useCaseStore";
import { useValueChainStore, L1Process } from "@/stores/valueChainStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UseCaseContextStepProps {
  initialLevel?: string;
  initialSourceId?: string;
  initialSourceName?: string;
  initialL1Id?: string;
}

export function UseCaseContextStep({ initialLevel, initialSourceId, initialSourceName, initialL1Id }: UseCaseContextStepProps) {
  const { language } = useLanguage();
  const { setSession, setUseCases, setStep, setIsGenerating, isGenerating } = useUseCaseStore();
  const { l1Processes } = useValueChainStore();
  const { settings } = useSettingsStore();

  const isStandalone = !initialL1Id && !initialSourceId;
  const [selectedL1Id, setSelectedL1Id] = useState<string>("");

  const [companyName, setCompanyName] = useState(settings.companyName || "");
  const [area, setArea] = useState(initialSourceName || "");
  const [observations, setObservations] = useState("");

  // Effective L1 ID: from URL params or standalone selection
  const effectiveL1Id = initialL1Id || (initialLevel === "l1" && initialSourceId ? initialSourceId : null) || (isStandalone ? selectedL1Id : null);

  // Build the hierarchy tree based on the level user entered from
  const sourceL1 = useMemo(() => {
    if (effectiveL1Id) return l1Processes.find((l1) => l1.id === effectiveL1Id);
    return null;
  }, [effectiveL1Id, l1Processes]);

  // For L2/L3/L4, find the parent chain
  const sourceContext = useMemo(() => {
    if (!sourceL1) return null;
    if (initialLevel === "l2" && initialSourceId) {
      const l2 = sourceL1.l2Processes.find((l2) => l2.id === initialSourceId);
      return { l2 };
    }
    if (initialLevel === "l3" && initialSourceId) {
      for (const l2 of sourceL1.l2Processes) {
        const l3 = l2.l3Processes.find((l3) => l3.id === initialSourceId);
        if (l3) return { l2, l3 };
      }
    }
    if (initialLevel === "l4" && initialSourceId) {
      for (const l2 of sourceL1.l2Processes) {
        for (const l3 of l2.l3Processes) {
          const l4 = l3.l4Tasks.find((l4) => l4.id === initialSourceId);
          if (l4) return { l2, l3, l4 };
        }
      }
    }
    return null;
  }, [sourceL1, initialLevel, initialSourceId]);

  // Selection state: track selected IDs per level
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    if (!sourceL1) return ids;

    if (isStandalone || initialLevel === "l1") {
      // Select all L2/L3/L4 by default
      sourceL1.l2Processes.forEach((l2) => {
        ids.add(l2.id);
        l2.l3Processes.forEach((l3) => {
          ids.add(l3.id);
          l3.l4Tasks.forEach((l4) => ids.add(l4.id));
        });
      });
    } else if (initialLevel === "l2" && sourceContext?.l2) {
      ids.add(sourceContext.l2.id);
      sourceContext.l2.l3Processes.forEach((l3) => {
        ids.add(l3.id);
        l3.l4Tasks.forEach((l4) => ids.add(l4.id));
      });
    } else if (initialLevel === "l3" && sourceContext?.l2 && sourceContext?.l3) {
      ids.add(sourceContext.l2.id);
      ids.add(sourceContext.l3.id);
      sourceContext.l3.l4Tasks.forEach((l4) => ids.add(l4.id));
    } else if (initialLevel === "l4" && sourceContext?.l2 && sourceContext?.l3 && sourceContext?.l4) {
      ids.add(sourceContext.l2.id);
      ids.add(sourceContext.l3.id);
      ids.add(sourceContext.l4.id);
    }
    return ids;
  });

  // Expand state for the tree
  const [expandedL2s, setExpandedL2s] = useState<Set<string>>(() => {
    if (initialLevel === "l1") return new Set<string>();
    const s = new Set<string>();
    if (sourceContext?.l2) s.add(sourceContext.l2.id);
    return s;
  });
  const [expandedL3s, setExpandedL3s] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (sourceContext?.l3) s.add(sourceContext.l3.id);
    return s;
  });

  const toggleId = (id: string) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const toggleL2WithChildren = (l2: typeof sourceL1 extends L1Process ? L1Process["l2Processes"][0] : any) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      const allSelected = s.has(l2.id) && l2.l3Processes.every((l3: any) => s.has(l3.id) && l3.l4Tasks.every((l4: any) => s.has(l4.id)));
      if (allSelected) {
        s.delete(l2.id);
        l2.l3Processes.forEach((l3: any) => { s.delete(l3.id); l3.l4Tasks.forEach((l4: any) => s.delete(l4.id)); });
      } else {
        s.add(l2.id);
        l2.l3Processes.forEach((l3: any) => { s.add(l3.id); l3.l4Tasks.forEach((l4: any) => s.add(l4.id)); });
      }
      return s;
    });
  };

  const toggleL3WithChildren = (l3: any) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      const allSelected = s.has(l3.id) && l3.l4Tasks.every((l4: any) => s.has(l4.id));
      if (allSelected) {
        s.delete(l3.id);
        l3.l4Tasks.forEach((l4: any) => s.delete(l4.id));
      } else {
        s.add(l3.id);
        l3.l4Tasks.forEach((l4: any) => s.add(l4.id));
      }
      return s;
    });
  };

  const selectAll = () => {
    const ids = new Set<string>();
    const items = getDisplayItems();
    items.forEach((l2) => {
      ids.add(l2.id);
      l2.l3Processes.forEach((l3: any) => {
        ids.add(l3.id);
        l3.l4Tasks.forEach((l4: any) => ids.add(l4.id));
      });
    });
    setSelectedIds(ids);
  };

  const deselectAll = () => setSelectedIds(new Set());

  // What to display in the tree depends on the entry level
  const getDisplayItems = () => {
    if (!sourceL1) return [];
    if (isStandalone || initialLevel === "l1") return sourceL1.l2Processes;
    if (initialLevel === "l2" && sourceContext?.l2) return [sourceContext.l2];
    if (initialLevel === "l3" && sourceContext?.l2) {
      return [{ ...sourceContext.l2, l3Processes: sourceContext.l3 ? [sourceContext.l3] : [] }];
    }
    return [];
  };

  // When standalone L1 selection changes, auto-select all and update area
  const handleL1Change = (l1Id: string) => {
    setSelectedL1Id(l1Id);
    const l1 = l1Processes.find((l) => l.id === l1Id);
    if (l1) {
      setArea(language === "PT" ? l1.namePT : l1.nameEN);
      const ids = new Set<string>();
      l1.l2Processes.forEach((l2) => {
        ids.add(l2.id);
        l2.l3Processes.forEach((l3) => {
          ids.add(l3.id);
          l3.l4Tasks.forEach((l4) => ids.add(l4.id));
        });
      });
      setSelectedIds(ids);
    }
  };

  const displayItems = getDisplayItems();
  const isL4Direct = initialLevel === "l4";

  // Collect selected names for the API call
  const getSelectedNames = () => {
    const names: string[] = [];
    if (!sourceL1) return names;
    sourceL1.l2Processes.forEach((l2) => {
      if (selectedIds.has(l2.id)) names.push(l2.name);
      l2.l3Processes.forEach((l3) => {
        if (selectedIds.has(l3.id)) names.push(l3.name);
        l3.l4Tasks.forEach((l4) => {
          if (selectedIds.has(l4.id)) names.push(l4.name);
        });
      });
    });
    return names;
  };

  const handleGenerate = async () => {
    if (!companyName.trim()) {
      toast.error(language === "PT" ? "Configure o nome da empresa nas Configurações" : "Set company name in Settings");
      return;
    }

    setIsGenerating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const selectedNames = getSelectedNames();
      const sessionData = {
        company_name: companyName,
        area: area || sourceL1?.nameEN || "",
        source_level: initialLevel || "l1",
        source_ids: initialSourceId ? [initialSourceId] : [],
        source_names: selectedNames,
        process_names: selectedNames,
        assessment_problems: "", // AI will fetch from context
        observations,
      };

      const { data, error } = await supabase.functions.invoke("generate-use-cases", {
        body: { ...sessionData, language },
      });

      if (error) throw error;

      setSession({ id: data.session_id, ...sessionData });
      setUseCases(data.use_cases || []);
      setStep(1);

      toast.success(language === "PT" ? `${data.use_cases?.length || 0} casos de uso gerados!` : `${data.use_cases?.length || 0} use cases generated!`);
    } catch (err: any) {
      console.error("Error generating use cases:", err);
      toast.error(language === "PT" ? "Erro ao gerar casos de uso" : "Error generating use cases");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleExpL2 = (id: string) => {
    setExpandedL2s((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };
  const toggleExpL3 = (id: string) => {
    setExpandedL3s((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const selectedCount = selectedIds.size;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          {language === "PT" ? "Contexto para Exploração" : "Exploration Context"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === "PT"
            ? "Revise as informações e selecione o escopo para a IA buscar os melhores casos de uso."
            : "Review info and select scope for AI to find the best use cases."}
        </p>
      </div>

      {/* L1 Selector for standalone mode */}
      {isStandalone && (
        <div>
          <Label>{language === "PT" ? "Cadeia de Valor (L1)" : "Value Chain (L1)"}</Label>
          <Select value={selectedL1Id} onValueChange={handleL1Change}>
            <SelectTrigger>
              <SelectValue placeholder={language === "PT" ? "Selecione uma cadeia de valor..." : "Select a value chain..."} />
            </SelectTrigger>
            <SelectContent>
              {l1Processes.map((l1) => (
                <SelectItem key={l1.id} value={l1.id}>
                  {language === "PT" ? l1.namePT : l1.nameEN}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {l1Processes.length === 0 && (
            <p className="text-xs text-destructive mt-1">
              {language === "PT" ? "Crie uma arquitetura de processos primeiro" : "Create a process architecture first"}
            </p>
          )}
        </div>
      )}

      {/* Company & Area - read-only company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{language === "PT" ? "Empresa" : "Company"}</Label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder={language === "PT" ? "Digite o nome da empresa" : "Enter company name"}
          />
          {!companyName && (
            <p className="text-xs text-destructive mt-1">
              {language === "PT" ? "Informe o nome da empresa" : "Enter company name"}
            </p>
          )}
        </div>
        <div>
          <Label>{language === "PT" ? "Área / End-to-End" : "Area / End-to-End"}</Label>
          <Input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder={language === "PT" ? "Ex: Procurement, Finance" : "Ex: Procurement, Finance"}
          />
        </div>
      </div>

      {/* Scope - L1 origin info */}
      {sourceL1 && !isStandalone && (
        <div className="bg-chain-surface border border-chain/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-chain-bg text-chain-dark border-0 text-xs font-semibold">L1</Badge>
            <span className="font-medium text-foreground text-sm">{language === "PT" ? sourceL1.namePT : sourceL1.nameEN}</span>
          </div>
          {initialLevel !== "l1" && sourceContext?.l2 && (
            <div className="flex items-center gap-2 ml-4 mt-1">
              <Badge className="bg-chain-bg text-chain-dark border-0 text-[10px]">L2</Badge>
              <span className="text-sm text-foreground">{sourceContext.l2.name}</span>
            </div>
          )}
          {initialLevel === "l3" && sourceContext?.l3 && (
            <div className="flex items-center gap-2 ml-8 mt-1">
              <Badge className="bg-chain-bg text-chain-dark border-0 text-[10px]">L3</Badge>
              <span className="text-sm text-foreground">{sourceContext.l3.name}</span>
            </div>
          )}
          {isL4Direct && sourceContext?.l4 && (
            <>
              {sourceContext.l3 && (
                <div className="flex items-center gap-2 ml-8 mt-1">
                  <Badge className="bg-chain-bg text-chain-dark border-0 text-[10px]">L3</Badge>
                  <span className="text-sm text-foreground">{sourceContext.l3.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 ml-12 mt-1">
                <Badge className="bg-chain-bg text-chain-dark border-0 text-[10px]">L4</Badge>
                <span className="text-sm text-foreground">{sourceContext.l4.name}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Scope Selector Tree - only for L1, L2, L3 levels */}
      {!isL4Direct && displayItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold">
              {language === "PT" ? "Escopo da Análise" : "Analysis Scope"}
            </Label>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="h-7 text-xs text-chain" onClick={selectAll}>
                {language === "PT" ? "Selecionar Todos" : "Select All"}
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={deselectAll}>
                {language === "PT" ? "Limpar" : "Clear"}
              </Button>
            </div>
          </div>
          <div className="border border-border rounded-xl overflow-hidden bg-card divide-y divide-border max-h-[400px] overflow-y-auto">
            {displayItems.map((l2) => {
              const l2Expanded = expandedL2s.has(l2.id);
              const allL2Selected = selectedIds.has(l2.id) && l2.l3Processes.every((l3: any) => selectedIds.has(l3.id) && l3.l4Tasks.every((l4: any) => selectedIds.has(l4.id)));
              const someL2Selected = selectedIds.has(l2.id) || l2.l3Processes.some((l3: any) => selectedIds.has(l3.id) || l3.l4Tasks.some((l4: any) => selectedIds.has(l4.id)));

              return (
                <div key={l2.id}>
                  {/* L2 Row */}
                  <div className={cn("flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors", l2Expanded && "bg-muted/20")}>
                    <button onClick={() => toggleExpL2(l2.id)} className="shrink-0">
                      {l2Expanded ? <ChevronDown className="h-4 w-4 text-chain" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </button>
                    <Checkbox
                      checked={allL2Selected}
                      // @ts-ignore
                      indeterminate={someL2Selected && !allL2Selected}
                      onCheckedChange={() => toggleL2WithChildren(l2)}
                      className="border-chain data-[state=checked]:bg-chain data-[state=checked]:border-chain"
                    />
                    <Badge className="bg-chain-bg text-chain-dark border-0 text-[10px] font-semibold shrink-0">L2</Badge>
                    <span className="text-sm font-medium text-foreground truncate">{l2.name}</span>
                    <Badge variant="secondary" className="text-[10px] ml-auto shrink-0">{l2.l3Processes.length} L3</Badge>
                  </div>

                  {/* L3s */}
                  {l2Expanded && l2.l3Processes.map((l3: any) => {
                    const l3Expanded = expandedL3s.has(l3.id);
                    const allL3Selected = selectedIds.has(l3.id) && l3.l4Tasks.every((l4: any) => selectedIds.has(l4.id));
                    const someL3Selected = selectedIds.has(l3.id) || l3.l4Tasks.some((l4: any) => selectedIds.has(l4.id));

                    return (
                      <div key={l3.id}>
                        <div className={cn("flex items-center gap-3 px-4 py-2.5 pl-12 hover:bg-muted/30 transition-colors", l3Expanded && "bg-muted/10")}>
                          <button onClick={() => toggleExpL3(l3.id)} className="shrink-0">
                            {l3.l4Tasks.length > 0 ? (
                              l3Expanded ? <ChevronDown className="h-3.5 w-3.5 text-chain-light" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : <div className="w-3.5" />}
                          </button>
                          <Checkbox
                            checked={allL3Selected}
                            onCheckedChange={() => toggleL3WithChildren(l3)}
                            className="border-chain-light data-[state=checked]:bg-chain-light data-[state=checked]:border-chain-light"
                          />
                          <Badge className="bg-chain-bg text-chain-dark border-0 text-[10px] shrink-0">L3</Badge>
                          <span className="text-sm text-foreground truncate">{l3.name}</span>
                          {l3.l4Tasks.length > 0 && (
                            <Badge variant="secondary" className="text-[10px] ml-auto shrink-0">{l3.l4Tasks.length} L4</Badge>
                          )}
                        </div>

                        {/* L4s */}
                        {l3Expanded && l3.l4Tasks.map((l4: any) => (
                          <div key={l4.id} className="flex items-center gap-3 px-4 py-2 pl-20 hover:bg-muted/30 transition-colors">
                            <Checkbox
                              checked={selectedIds.has(l4.id)}
                              onCheckedChange={() => toggleId(l4.id)}
                              className="border-muted-foreground/40"
                            />
                            <div className="w-1.5 h-1.5 rounded-full bg-chain shrink-0" />
                            <span className="text-sm text-foreground truncate">{l4.name}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {selectedCount} {language === "PT" ? "itens selecionados" : "items selected"}
          </p>
        </div>
      )}

      {/* Observations */}
      <div>
        <Label>{language === "PT" ? "Observações Adicionais (opcional)" : "Additional Observations (optional)"}</Label>
        <Textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder={language === "PT" ? "Informações extras que podem ajudar a IA..." : "Extra info that may help the AI..."}
          rows={3}
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !companyName.trim() || (isStandalone && !selectedL1Id)}
        className="w-full gap-2 bg-chain hover:bg-chain-dark text-white h-11"
      >
        <Sparkles className="h-4 w-4" />
        {language === "PT" ? "Explorar Casos de Uso" : "Explore Use Cases"}
      </Button>
    </div>
  );
}
