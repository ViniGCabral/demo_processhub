import { Info, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DEFAULT_TAXONOMY_LABELS,
  TaxonomyLevel,
  useTaxonomyStore,
} from '@/stores/taxonomyStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const LEVELS: TaxonomyLevel[] = ['l1', 'l2', 'l3', 'l4'];

export function TaxonomySection() {
  const { language } = useLanguage();
  const { labels, maxLevel, setLabel, setMaxLevel, resetTaxonomy } = useTaxonomyStore();

  const depthOptions: (2 | 3 | 4)[] = [2, 3, 4];

  const hint = (level: TaxonomyLevel) =>
    ({
      l1: language === 'PT' ? 'Macroprocesso / End to End' : 'Macroprocess / End to End',
      l2: language === 'PT' ? 'Processo' : 'Process',
      l3: language === 'PT' ? 'Subprocesso' : 'Subprocess',
      l4: language === 'PT' ? 'Atividade' : 'Activity',
    }[level]);

  return (
    <div>
      <div className="border-b border-border pb-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          {language === 'PT' ? 'Taxonomia da Cadeia de Valor' : 'Value Chain Taxonomy'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === 'PT'
            ? 'Defina o nível máximo de detalhamento e os nomes de cada camada da cadeia de valor.'
            : 'Define the maximum depth and the naming of each value chain layer.'}
        </p>
      </div>

      {/* Max depth */}
      <div className="mb-8">
        <label className="section-title block mb-1">
          {language === 'PT' ? 'Nível máximo' : 'Maximum level'}
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          {language === 'PT'
            ? 'Os processos serão alocados no último nível ativo.'
            : 'Processes are attached to the deepest active level.'}
        </p>
        <div className="flex gap-2">
          {depthOptions.map((d) => {
            const active = maxLevel === d;
            return (
              <button
                key={d}
                onClick={() => setMaxLevel(d)}
                className={cn(
                  'flex-1 border rounded-sm px-4 py-3 text-left transition-colors',
                  active
                    ? 'border-primary bg-sidebar-accent text-primary'
                    : 'border-border hover:bg-muted/40 text-foreground'
                )}
              >
                <div className="text-sm font-semibold">
                  {language === 'PT' ? `Até ${d} níveis` : `Up to ${d} levels`}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {LEVELS.slice(0, d)
                    .map((l) => labels[l] || DEFAULT_TAXONOMY_LABELS[l])
                    .join(' › ')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level names */}
      <div className="mb-6">
        <label className="section-title block mb-3">
          {language === 'PT' ? 'Nomes dos níveis' : 'Level names'}
        </label>
        <div className="flex flex-col gap-2">
          {LEVELS.map((level, idx) => {
            const disabled = idx + 1 > maxLevel;
            return (
              <div
                key={level}
                className={cn(
                  'flex items-center gap-3 bg-card border border-border rounded-sm px-3 py-2.5',
                  disabled && 'opacity-50'
                )}
              >
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-sm bg-sidebar-accent text-primary uppercase w-10 text-center shrink-0">
                  {DEFAULT_TAXONOMY_LABELS[level]}
                </span>
                <Input
                  value={labels[level]}
                  disabled={disabled}
                  onChange={(e) => setLabel(level, e.target.value.slice(0, 24))}
                  placeholder={DEFAULT_TAXONOMY_LABELS[level]}
                  className="flex-1 text-sm rounded-sm"
                  maxLength={24}
                />
                <span className="text-xs text-muted-foreground w-40 shrink-0">
                  {disabled
                    ? language === 'PT'
                      ? 'Desativado'
                      : 'Disabled'
                    : hint(level)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="rounded-sm"
        onClick={() => {
          resetTaxonomy();
          toast.success(language === 'PT' ? 'Taxonomia restaurada' : 'Taxonomy restored');
        }}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        {language === 'PT' ? 'Restaurar padrão (L1–L4)' : 'Restore default (L1–L4)'}
      </Button>

      <div className="flex gap-3 bg-warning/10 border border-warning/30 rounded-sm p-3 mt-6">
        <Info className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-warning">
            {language === 'PT' ? 'Dica' : 'Tip'}
          </p>
          <p className="text-sm text-warning/90">
            {language === 'PT'
              ? 'Ex.: use "Macro", "Processo", "Subprocesso" e "Atividade" para adotar a taxonomia da sua empresa. Reduzir o nível máximo esconde os níveis mais profundos na arquitetura de processos.'
              : 'E.g. use "Macro", "Process", "Subprocess" and "Activity" to adopt your own taxonomy. Lowering the maximum level hides deeper layers in the process architecture.'}
          </p>
        </div>
      </div>
    </div>
  );
}
