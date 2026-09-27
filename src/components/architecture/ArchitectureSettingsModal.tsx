import { Info, RotateCcw, X, Layers, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DEFAULT_TAXONOMY_LABELS,
  TaxonomyLevel,
  useTaxonomyStore,
} from '@/stores/taxonomyStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const LEVELS: TaxonomyLevel[] = ['l1', 'l2', 'l3', 'l4'];

interface ArchitectureSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchitectureSettingsModal({ open, onOpenChange }: ArchitectureSettingsModalProps) {
  const { language } = useLanguage();
  const { labels, maxLevel, sidebarVisibility, setLabel, setMaxLevel, setSidebarVisibility, resetTaxonomy } = useTaxonomyStore();

  const depthOptions: (2 | 3 | 4)[] = [2, 3, 4];

  const hint = (level: TaxonomyLevel) =>
    ({
      l1: language === 'PT' ? 'Macroprocesso / End to End' : 'Macroprocess / End to End',
      l2: language === 'PT' ? 'Processo' : 'Process',
      l3: language === 'PT' ? 'Subprocesso' : 'Subprocess',
      l4: language === 'PT' ? 'Atividade' : 'Activity',
    }[level]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            {language === 'PT' ? 'Configurações de Arquitetura' : 'Architecture Settings'}
          </DialogTitle>
          <DialogDescription>
            {language === 'PT'
              ? 'Personalize os níveis, a taxonomia e os campos visíveis nas fichas de escopo.'
              : 'Customize the levels, taxonomy, and visible fields in the scope context sheets.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Taxonomy Section */}
          <section>
            <div className="border-b border-border pb-2 mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4" />
                {language === 'PT' ? 'Taxonomia da Cadeia de Valor' : 'Value Chain Taxonomy'}
              </h3>
            </div>

            <div className="mb-6">
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                {language === 'PT' ? 'Nível máximo (Profundidade)' : 'Maximum level (Depth)'}
              </label>
              <div className="flex gap-2">
                {depthOptions.map((d) => {
                  const active = maxLevel === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setMaxLevel(d)}
                      className={cn(
                        'flex-1 border rounded-lg px-4 py-3 text-left transition-colors',
                        active
                          ? 'border-primary bg-primary/5 text-primary shadow-sm'
                          : 'border-border hover:bg-muted/40 text-foreground'
                      )}
                    >
                      <div className="text-sm font-semibold">
                        {language === 'PT' ? `Até ${d} níveis` : `Up to ${d} levels`}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {LEVELS.slice(0, d)
                          .map((l) => labels[l] || DEFAULT_TAXONOMY_LABELS[l])
                          .join(' › ')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                {language === 'PT' ? 'Nomes dos níveis' : 'Level names'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LEVELS.map((level, idx) => {
                  const disabled = idx + 1 > maxLevel;
                  return (
                    <div
                      key={level}
                      className={cn(
                        'flex items-center gap-3 bg-card border border-border rounded-lg px-3 py-2',
                        disabled && 'opacity-50 grayscale'
                      )}
                    >
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase w-10 text-center shrink-0">
                        {DEFAULT_TAXONOMY_LABELS[level]}
                      </span>
                      <Input
                        value={labels[level]}
                        disabled={disabled}
                        onChange={(e) => setLabel(level, e.target.value.slice(0, 24))}
                        placeholder={DEFAULT_TAXONOMY_LABELS[level]}
                        className="flex-1 text-sm h-8"
                        maxLength={24}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Sidebar Visibility Section */}
          <section>
            <div className="border-b border-border pb-2 mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                {language === 'PT' ? 'Visibilidade de Campos na Ficha' : 'Scope Sheet Fields Visibility'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'PT' 
                  ? 'Escolha quais campos devem ser exibidos na barra lateral de cada componente.' 
                  : 'Choose which fields should be displayed in the sidebar of each component.'}
              </p>
            </div>

            <div className="space-y-4 max-w-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{language === 'PT' ? 'Responsável' : 'Responsible'}</h4>
                  <p className="text-xs text-muted-foreground">{language === 'PT' ? 'Dono do processo ou domínio' : 'Owner of the process or domain'}</p>
                </div>
                <Switch 
                  checked={sidebarVisibility.responsible} 
                  onCheckedChange={(c) => setSidebarVisibility('responsible', c)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{language === 'PT' ? 'Unidade de Negócio' : 'Business Unit'}</h4>
                  <p className="text-xs text-muted-foreground">{language === 'PT' ? 'Área organizacional de pertencimento' : 'Organizational area it belongs to'}</p>
                </div>
                <Switch 
                  checked={sidebarVisibility.businessUnit} 
                  onCheckedChange={(c) => setSidebarVisibility('businessUnit', c)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{language === 'PT' ? 'Dimensionamento' : 'Sizing'}</h4>
                  <p className="text-xs text-muted-foreground">{language === 'PT' ? 'FTEs alocados' : 'Allocated FTEs'}</p>
                </div>
                <Switch 
                  checked={sidebarVisibility.sizing} 
                  onCheckedChange={(c) => setSidebarVisibility('sizing', c)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{language === 'PT' ? 'Documentação Gerada' : 'Generated Documentation'}</h4>
                  <p className="text-xs text-muted-foreground">{language === 'PT' ? 'Percentual de completude' : 'Completion percentage'}</p>
                </div>
                <Switch 
                  checked={sidebarVisibility.documentationPercent} 
                  onCheckedChange={(c) => setSidebarVisibility('documentationPercent', c)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{language === 'PT' ? 'Revisão' : 'Revision'}</h4>
                  <p className="text-xs text-muted-foreground">{language === 'PT' ? 'Data da última atualização' : 'Date of last update'}</p>
                </div>
                <Switch 
                  checked={sidebarVisibility.lastUpdate} 
                  onCheckedChange={(c) => setSidebarVisibility('lastUpdate', c)} 
                />
              </div>
            </div>
          </section>

          <div className="pt-4 flex items-center justify-between border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetTaxonomy();
                toast.success(language === 'PT' ? 'Configurações restauradas' : 'Settings restored');
              }}
              className="text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {language === 'PT' ? 'Restaurar padrões' : 'Restore defaults'}
            </Button>
            
            <Button onClick={() => onOpenChange(false)} size="sm">
              {language === 'PT' ? 'Concluir' : 'Done'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
