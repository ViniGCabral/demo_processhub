import { useState, useCallback, useMemo, useEffect } from "react";
import { Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettingsStore, Position } from "@/stores/settingsStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface PositionEffort {
  id: string;
  positionId: string;
  name: string;
  people: number;
  hours: number;
}

// Component for hours input that handles decimal with comma
function HoursInput({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  const [localValue, setLocalValue] = useState<string>(value ? String(value).replace('.', ',') : '');
  
  // Sync local value when prop changes (e.g., from external update)
  useEffect(() => {
    const formatted = value ? String(value).replace('.', ',') : '';
    if (parseFloat(localValue.replace(',', '.')) !== value) {
      setLocalValue(formatted);
    }
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty, numbers, and one comma/dot for decimal
    if (inputValue === '' || /^[0-9]*[,.]?[0-9]*$/.test(inputValue)) {
      setLocalValue(inputValue);
    }
  };
  
  const handleBlur = () => {
    if (localValue === '' || localValue === ',' || localValue === '.') {
      onChange(0);
      setLocalValue('');
      return;
    }
    
    const parsed = parseFloat(localValue.replace(',', '.'));
    if (!isNaN(parsed)) {
      onChange(Math.max(0, parsed));
      // Format with comma for display
      setLocalValue(parsed ? String(parsed).replace('.', ',') : '');
    }
  };
  
  return (
    <Input
      type="text"
      inputMode="decimal"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className="h-8 text-center text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
      placeholder="0"
    />
  );
}

interface ExecutionEffortTableProps {
  value: PositionEffort[];
  onChange: (positions: PositionEffort[]) => void;
  areaCode?: string;
  frequency?: string;
  adhocMonthly?: string;
}

// Helper function to get frequency multiplier for monthly calculation
function getFrequencyMultiplier(frequency?: string, adhocMonthly?: string): number {
  switch (frequency) {
    case "diario":
      return 21; // Business days per month
    case "semanal":
      return 4; // Weeks per month
    case "mensal":
      return 1;
    case "trimestral":
      return 1 / 3; // ~0.33 per month
    case "anual":
      return 1 / 12; // ~0.08 per month
    case "adhoc":
      const adhocValue = parseInt(adhocMonthly || "0", 10);
      return isNaN(adhocValue) ? 0 : adhocValue;
    default:
      return 1; // Default to monthly
  }
}

export function ExecutionEffortTable({ value, onChange, areaCode, frequency, adhocMonthly }: ExecutionEffortTableProps) {
  const { language } = useLanguage();
  const { settings, addPosition, getAllPositions, getPositionsByArea } = useSettingsStore();
  
  // Find the area by code to get the areaId
  const processArea = useMemo(() => {
    if (!areaCode) return null;
    return settings.areas.find(a => a.code === areaCode);
  }, [areaCode, settings.areas]);
  
  // Get positions filtered by area if areaCode is provided
  const allPositions = useMemo(() => {
    if (processArea) {
      return getPositionsByArea(processArea.id) || [];
    }
    return getAllPositions() || [];
  }, [processArea, getPositionsByArea, getAllPositions]);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string>("");
  const [newPositionName, setNewPositionName] = useState("");
  const [newPositionDescription, setNewPositionDescription] = useState("");
  const [newPositionAreaId, setNewPositionAreaId] = useState(processArea?.id || settings.areas?.[0]?.id || "");
  const [comboboxOpen, setComboboxOpen] = useState(false);

  // Ensure positions is always an array
  const positions = value || [];

  // Get available positions (not already added)
  const availablePositions = useMemo(() => {
    const addedIds = new Set(positions.map(p => p.positionId));
    return allPositions.filter(p => !addedIds.has(p.id));
  }, [allPositions, positions]);

  const updatePeople = useCallback((id: string, people: number) => {
    const updated = positions.map(p => p.id === id ? { ...p, people: Math.max(0, people) } : p);
    onChange(updated);
  }, [positions, onChange]);

  const updateHours = useCallback((id: string, hours: number) => {
    const updated = positions.map(p => p.id === id ? { ...p, hours: Math.max(0, hours) } : p);
    onChange(updated);
  }, [positions, onChange]);

  const handleAddPosition = () => {
    setSelectedPositionId("");
    setAddDialogOpen(true);
  };

  const confirmAddPosition = () => {
    if (!selectedPositionId) {
      toast.error(language === "PT" ? "Selecione um cargo" : "Select a position");
      return;
    }
    
    const position = allPositions.find(p => p.id === selectedPositionId);
    if (!position) return;
    
    const newEffort: PositionEffort = {
      id: `effort_${Date.now()}`,
      positionId: position.id,
      name: position.name,
      people: 0,
      hours: 0,
    };
    
    onChange([...positions, newEffort]);
    setAddDialogOpen(false);
    setSelectedPositionId("");
  };

  const handleCreateNewPosition = () => {
    setAddDialogOpen(false);
    setNewPositionName("");
    setNewPositionDescription("");
    // Default to the process area if available
    setNewPositionAreaId(processArea?.id || settings.areas[0]?.id || "");
    setCreateDialogOpen(true);
  };

  const confirmCreatePosition = () => {
    if (!newPositionName.trim()) {
      toast.error(language === "PT" ? "Digite o nome do cargo" : "Enter position name");
      return;
    }
    if (!newPositionAreaId) {
      toast.error(language === "PT" ? "Selecione uma área" : "Select an area");
      return;
    }
    
    // Add to settings store
    addPosition({
      name: newPositionName.trim(),
      description: newPositionDescription.trim(),
      areaId: newPositionAreaId,
    });
    
    // Wait for store to update and then add to effort table
    setTimeout(() => {
      const updatedPositions = useSettingsStore.getState().getAllPositions();
      const newPosition = updatedPositions.find(p => p.name === newPositionName.trim());
      
      if (newPosition) {
        const newEffort: PositionEffort = {
          id: `effort_${Date.now()}`,
          positionId: newPosition.id,
          name: newPosition.name,
          people: 0,
          hours: 0,
        };
        onChange([...positions, newEffort]);
      }
      
      setCreateDialogOpen(false);
      toast.success(language === "PT" ? "Cargo criado e adicionado!" : "Position created and added!");
    }, 100);
  };

  const removePosition = useCallback((id: string) => {
    if (positions.length <= 1) {
      toast.error(language === "PT" ? "É necessário pelo menos um cargo" : "At least one position is required");
      return;
    }
    const updated = positions.filter(p => p.id !== id);
    onChange(updated);
  }, [positions, onChange, language]);

  // Corrected calculation: Total hours = sum of (people * hours) per position, multiplied by frequency
  const frequencyMultiplier = getFrequencyMultiplier(frequency, adhocMonthly);
  
  const totals = useMemo(() => {
    const totalPeople = positions.reduce((sum, p) => sum + p.people, 0);
    const baseHours = positions.reduce((sum, p) => sum + (p.people * p.hours), 0);
    const totalMonthlyHours = baseHours * frequencyMultiplier;
    const averageHoursPerPerson = totalPeople > 0 ? totalMonthlyHours / totalPeople : 0;
    return { totalPeople, baseHours, totalMonthlyHours, averageHoursPerPerson };
  }, [positions, frequencyMultiplier]);

  return (
    <div className="space-y-4 mt-6">
      {/* Header with title and add button */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">
          {language === "PT" ? "Esforço por Cargo" : "Effort by Position"}
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddPosition}
          className="text-teal-600 border-teal-600 hover:bg-teal-50 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          {language === "PT" ? "Adicionar Cargo" : "Add Position"}
        </Button>
      </div>

      {/* Table */}
      {positions.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-2 text-left font-medium text-muted-foreground w-24">
                  {language === "PT" ? "Campo" : "Field"}
                </th>
                {positions.map((position) => (
                  <th key={position.id} className="px-2 py-2 text-center min-w-[120px] group">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-medium">{position.name}</span>
                      {positions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePosition(position.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                          title={language === "PT" ? "Remover cargo" : "Remove position"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-3 py-2 text-center font-semibold text-foreground bg-gray-100 min-w-[80px]">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Pessoas row */}
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 font-medium text-muted-foreground">
                  {language === "PT" ? "Pessoas" : "People"}
                </td>
                {positions.map((position) => (
                  <td key={position.id} className="px-2 py-2 text-center">
                    <Input
                      type="number"
                      min="0"
                      value={position.people || ""}
                      onChange={(e) => updatePeople(position.id, parseInt(e.target.value) || 0)}
                      className="h-8 text-center text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      placeholder="0"
                    />
                  </td>
                ))}
                <td className="px-3 py-2 text-center font-semibold text-foreground bg-gray-50">
                  {totals.totalPeople}
                </td>
              </tr>
              {/* Horas row */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 font-medium text-muted-foreground">
                  {language === "PT" ? "Horas" : "Hours"}
                </td>
                {positions.map((position) => (
                  <td key={position.id} className="px-2 py-2 text-center">
                    <HoursInput
                      value={position.hours}
                      onChange={(hours) => updateHours(position.id, hours)}
                    />
                  </td>
                ))}
                <td className="px-3 py-2 text-center font-semibold text-foreground bg-gray-50">
                  {totals.baseHours.toFixed(2).replace('.', ',')}h
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
          <p className="text-muted-foreground text-sm mb-2">
            {language === "PT" ? "Nenhum cargo adicionado" : "No positions added"}
          </p>
          <Button
            variant="link"
            size="sm"
            onClick={handleAddPosition}
            className="text-teal-600"
          >
            {language === "PT" ? "Adicionar primeiro cargo" : "Add first position"}
          </Button>
        </div>
      )}

      {/* Summary cards */}
      {positions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Total de Pessoas */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
            <p className="text-xs font-medium text-teal-600 uppercase tracking-wide mb-1">
              {language === "PT" ? "Total de Pessoas" : "Total People"}
            </p>
            <p className="text-2xl font-bold text-teal-700">
              {totals.totalPeople}
            </p>
          </div>

          {/* Total de Horas Mensais */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
              {language === "PT" ? "Total Horas/Mês" : "Total Hours/Month"}
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {totals.totalMonthlyHours.toFixed(2).replace('.', ',')}h
            </p>
          </div>

          {/* Horas por Pessoa */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">
              {language === "PT" ? "Horas/Pessoa" : "Hours/Person"}
            </p>
            <p className="text-2xl font-bold text-purple-700">
              {totals.averageHoursPerPerson.toFixed(2).replace('.', ',')}h
            </p>
          </div>
        </div>
      )}

      {/* Add Position Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === "PT" ? "Adicionar Cargo" : "Add Position"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "PT" ? "Selecione um cargo" : "Select a position"}
              </label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between"
                  >
                    {selectedPositionId
                      ? allPositions.find((p) => p.id === selectedPositionId)?.name
                      : language === "PT" ? "Selecionar cargo..." : "Select position..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder={language === "PT" ? "Buscar cargo..." : "Search position..."} />
                    <CommandList>
                      <CommandEmpty>
                        {language === "PT" ? "Nenhum cargo encontrado" : "No position found"}
                      </CommandEmpty>
                      <CommandGroup>
                        {availablePositions.map((position) => {
                          const area = settings.areas.find(a => a.id === position.areaId);
                          return (
                            <CommandItem
                              key={position.id}
                              value={position.name}
                              onSelect={() => {
                                setSelectedPositionId(position.id);
                                setComboboxOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedPositionId === position.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex items-center gap-2">
                                {area && (
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: area.color }}
                                  />
                                )}
                                <span>{position.name}</span>
                                {area && (
                                  <span className="text-xs text-muted-foreground">({area.code})</span>
                                )}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="pt-2 border-t">
              <Button
                variant="link"
                className="text-teal-600 p-0 h-auto"
                onClick={handleCreateNewPosition}
              >
                <Plus className="h-4 w-4 mr-1" />
                {language === "PT" ? "Criar novo cargo" : "Create new position"}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              {language === "PT" ? "Cancelar" : "Cancel"}
            </Button>
            <Button onClick={confirmAddPosition} className="bg-teal-600 hover:bg-teal-700">
              {language === "PT" ? "Adicionar" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Position Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === "PT" ? "Criar Novo Cargo" : "Create New Position"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "PT" ? "Nome do Cargo *" : "Position Name *"}
              </label>
              <Input
                value={newPositionName}
                onChange={(e) => setNewPositionName(e.target.value)}
                placeholder={language === "PT" ? "Ex: Coordenador" : "Ex: Coordinator"}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "PT" ? "Descrição (Opcional)" : "Description (Optional)"}
              </label>
              <Input
                value={newPositionDescription}
                onChange={(e) => setNewPositionDescription(e.target.value)}
                placeholder={language === "PT" ? "Breve descrição do cargo" : "Brief description"}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "PT" ? "Área *" : "Area *"}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {newPositionAreaId
                      ? settings.areas.find((a) => a.id === newPositionAreaId)?.name
                      : language === "PT" ? "Selecionar área..." : "Select area..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder={language === "PT" ? "Buscar área..." : "Search area..."} />
                    <CommandList>
                      <CommandEmpty>
                        {language === "PT" ? "Nenhuma área encontrada" : "No area found"}
                      </CommandEmpty>
                      <CommandGroup>
                        {settings.areas.map((area) => (
                          <CommandItem
                            key={area.id}
                            value={area.name}
                            onSelect={() => setNewPositionAreaId(area.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                newPositionAreaId === area.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: area.color }}
                              />
                              <span>{area.code} - {area.name}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              {language === "PT" ? "Cancelar" : "Cancel"}
            </Button>
            <Button onClick={confirmCreatePosition} className="bg-teal-600 hover:bg-teal-700">
              {language === "PT" ? "Criar e Adicionar" : "Create and Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}