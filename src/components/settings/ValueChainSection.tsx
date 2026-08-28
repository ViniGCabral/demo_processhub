import { useState } from 'react';
import { GripVertical, Trash2, Plus, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/stores/settingsStore';
import { toast } from 'sonner';

const levelLabels = {
  l1: 'L1 - Macroprocesso',
  l2: 'L2 - Processo',
  l3: 'L3 - Subprocesso',
  l4: 'L4 - Atividade',
};

interface ValueChainLevelProps {
  level: 'l1' | 'l2' | 'l3' | 'l4';
  items: string[];
}

function ValueChainLevel({ level, items }: ValueChainLevelProps) {
  const { addValueChainItem, removeValueChainItem, updateValueChainItem } = useSettingsStore();
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (!newItem.trim()) return;
    if (newItem.trim().length < 2) {
      toast.error('Mínimo de 2 caracteres');
      return;
    }
    if (items.includes(newItem.trim())) {
      toast.error('Item já existe neste nível');
      return;
    }
    if (items.length >= 20) {
      toast.error('Máximo de 20 itens por nível');
      return;
    }
    addValueChainItem(level, newItem.trim());
    setNewItem('');
    toast.success('Item adicionado');
  };

  const handleRemove = (index: number) => {
    if (items.length <= 1) {
      toast.error('Mínimo de 1 item por nível');
      return;
    }
    removeValueChainItem(level, index);
    toast.success('Item removido');
  };

  const handleUpdate = (index: number, value: string) => {
    if (value.length > 50) return;
    updateValueChainItem(level, index, value);
  };

  return (
    <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4">
      <label className="section-title block mb-3">{levelLabels[level]}</label>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-card border border-border rounded-md px-3 py-2.5 hover:bg-muted/30 transition-colors group"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <Input
              value={item}
              onChange={(e) => handleUpdate(index, e.target.value)}
              className="flex-1 border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0"
              maxLength={50}
            />
            <button
              onClick={() => handleRemove(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`Novo item ${levelLabels[level].split(' - ')[1]}...`}
            className="flex-1 text-sm"
            maxLength={50}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button
            onClick={handleAdd}
            variant="outline"
            size="sm"
            className="bg-sidebar-accent border-dashed border-primary text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ValueChainSection() {
  const { settings } = useSettingsStore();

  return (
    <div>
      <div className="border-b border-border pb-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Valor Cadeia</h2>
        <p className="text-sm text-muted-foreground">
          Configure os níveis padrão da cadeia de valor (L1, L2, L3, L4) que aparecerão ao criar novos processos.
        </p>
      </div>

      <ValueChainLevel level="l1" items={settings.valueChain.l1} />
      <ValueChainLevel level="l2" items={settings.valueChain.l2} />
      <ValueChainLevel level="l3" items={settings.valueChain.l3} />
      <ValueChainLevel level="l4" items={settings.valueChain.l4} />

      <div className="flex gap-3 bg-warning/10 border border-warning/30 rounded-lg p-3 mt-6">
        <Info className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-warning">Dica</p>
          <p className="text-sm text-warning/90">
            Esses níveis serão usados como padrão ao criar novos processos. Você poderá customizar para cada processo individualmente.
          </p>
        </div>
      </div>
    </div>
  );
}
