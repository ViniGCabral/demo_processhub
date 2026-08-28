import { useState, useMemo, useCallback, useEffect } from "react";
import { Save, X, Plus, Download, History } from "lucide-react";
import { ExecutionEffortTable, PositionEffort } from "./ExecutionEffortTable";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettingsStore } from "@/stores/settingsStore";
import { useValueChainStore } from "@/stores/valueChainStore";
import { useProcessStore } from "@/stores/processStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type OptionType = 'area' | 'l1' | 'l2' | 'l3' | 'l4';

interface ProcessAttributesAccordionProps {
  process: {
    id?: string;
    name: string;
    area: string;
    description: string;
    executor: string;
    approver: string;
    frequency?: string;
    avgTime?: string;
    l1?: string;
    l2?: string;
    l3?: string;
    l4?: string;
    // Extra attribute fields (optional)
    owner?: string;
    supportTeam?: string;
    adhocMonthly?: string;
    sla?: string;
    createdAt?: string;
    lastReview?: string;
    regulations?: string;
    kpis?: string;
    systems?: string[];
    version?: string;
    docLastReview?: string;
    docNextReview?: string;
    executionEffort?: PositionEffort[];
  };
  onSave: () => void;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}

const frequencies = [
  { value: "diario", label: "Diário" },
  { value: "semanal", label: "Semanal" },
  { value: "mensal", label: "Mensal" },
  { value: "trimestral", label: "Trimestral" },
  { value: "anual", label: "Anual" },
  { value: "adhoc", label: "Ad-hoc" },
];

export function ProcessAttributesAccordion({ process, onSave, onCancel, onDirtyChange }: ProcessAttributesAccordionProps) {
  const { language } = useLanguage();
  const { toast: toastHook } = useToast();
  const { settings, addArea } = useSettingsStore();
  const { getAllL1Names, addL1, addL2, addL3, addL4, l1Processes } = useValueChainStore();
  const { updateProcess } = useProcessStore();
  
  // Dialog for creating new options
  const [newOptionDialog, setNewOptionDialog] = useState<{ open: boolean; type: OptionType | null }>({ open: false, type: null });
  const [newOptionValue, setNewOptionValue] = useState("");

  // Initial form data - use empty strings for unfilled fields
  const initialFormData = useMemo(() => ({
    // Informações Básicas
    name: process.name || "",
    description: process.description || "",
    area: process.area || "",

    // Stakeholders
    executor: process.executor || "",
    approver: process.approver || "",
    owner: "",
    supportTeam: "",

    // Cadeia de Valor
    l1: process.l1 || "",
    l2: process.l2 || "",
    l3: process.l3 || "",
    l4: process.l4 || "",

    // Execução
    avgTime: process.avgTime || "",
    frequency: process.frequency || "",
    adhocMonthly: process.adhocMonthly || "",
    sla: process.sla || "",
    executionEffort: process.executionEffort || ([] as PositionEffort[]),
    createdAt: process.createdAt || new Date().toISOString().split('T')[0],
    lastReview: process.lastReview || new Date().toISOString().split('T')[0],

    // Compliance & Regulação
    regulations: "",
    kpis: "",

    // Sistemas & Ferramentas
    systems: [] as string[],

    // Documentação
    version: "",
    docLastReview: "",
    docNextReview: "",
  }), [process]);

  const [formData, setFormData] = useState(initialFormData);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingExit, setPendingExit] = useState(false);
  const [newSystem, setNewSystem] = useState("");

  // All accordion sections expanded by default
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "basic-info",
    "stakeholders",
    "value-chain",
    "execution",
    "compliance",
    "systems",
    "documentation",
  ]);

  const hasChanges = changedFields.size > 0;

  useEffect(() => {
    onDirtyChange?.(hasChanges);
  }, [hasChanges, onDirtyChange]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Track changed fields
    const isChanged =
      JSON.stringify(value) !==
      JSON.stringify(initialFormData[field as keyof typeof initialFormData]);
    setChangedFields((prev) => {
      const newSet = new Set(prev);
      if (isChanged) {
        newSet.add(field);
      } else {
        newSet.delete(field);
      }
      return newSet;
    });
  };

  const isFieldChanged = (field: string) => changedFields.has(field);

  const handleSave = () => {
    if (!process.id) {
      toastHook({
        title: language === "PT" ? "Erro" : "Error",
        description: language === "PT" 
          ? "ID do processo não encontrado."
          : "Process ID not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Update process in store
    updateProcess(process.id, {
      name: formData.name,
      description: formData.description,
      area: formData.area,
      executor: formData.executor,
      approver: formData.approver,
      frequency: formData.frequency,
      avgTime: formData.avgTime,
      l1: formData.l1,
      l2: formData.l2,
      l3: formData.l3,
      l4: formData.l4,

      // Persist execution effort table
      executionEffort: formData.executionEffort,

      // Persist other attribute fields
      owner: formData.owner,
      supportTeam: formData.supportTeam,
      adhocMonthly: formData.adhocMonthly,
      sla: formData.sla,
      createdAt: formData.createdAt,
      lastReview: formData.lastReview,
      regulations: formData.regulations,
      kpis: formData.kpis,
      systems: formData.systems,
      version: formData.version,
      docLastReview: formData.docLastReview,
      docNextReview: formData.docNextReview,
    });

    // Reset changed fields tracking
    setChangedFields(new Set());
    
    toastHook({
      title: language === "PT" ? "✓ Atributos atualizados" : "✓ Attributes updated",
      description: language === "PT" 
        ? "Os atributos do processo foram salvos com sucesso."
        : "Process attributes have been saved successfully.",
    });
    onSave();
  };
  
  // Cascading filter functions
  const getFilteredL2Options = (selectedL1: string): string[] => {
    if (!selectedL1) {
      return l1Processes.flatMap((l1) => l1.l2Processes.map((l2) => l2.name));
    }
    const l1 = l1Processes.find((l) => l.nameEN === selectedL1);
    return l1 ? l1.l2Processes.map((l2) => l2.name) : [];
  };

  const getFilteredL3Options = (selectedL1: string, selectedL2: string): string[] => {
    if (!selectedL1 && !selectedL2) {
      return l1Processes.flatMap((l1) => 
        l1.l2Processes.flatMap((l2) => l2.l3Processes.map((l3) => l3.name))
      );
    }
    if (!selectedL1 && selectedL2) {
      for (const l1 of l1Processes) {
        const l2 = l1.l2Processes.find((l) => l.name === selectedL2);
        if (l2) return l2.l3Processes.map((l3) => l3.name);
      }
      return [];
    }
    if (selectedL1 && !selectedL2) {
      const l1 = l1Processes.find((l) => l.nameEN === selectedL1);
      return l1 ? l1.l2Processes.flatMap((l2) => l2.l3Processes.map((l3) => l3.name)) : [];
    }
    const l1 = l1Processes.find((l) => l.nameEN === selectedL1);
    if (!l1) return [];
    const l2 = l1.l2Processes.find((l) => l.name === selectedL2);
    return l2 ? l2.l3Processes.map((l3) => l3.name) : [];
  };

  const getFilteredL4Options = (selectedL1: string, selectedL2: string, selectedL3: string): string[] => {
    if (!selectedL1 && !selectedL2 && !selectedL3) {
      return l1Processes.flatMap((l1) => 
        l1.l2Processes.flatMap((l2) => 
          l2.l3Processes.flatMap((l3) => l3.l4Tasks.map((l4) => l4.name))
        )
      );
    }
    if (!selectedL1 && !selectedL2 && selectedL3) {
      for (const l1 of l1Processes) {
        for (const l2 of l1.l2Processes) {
          const l3 = l2.l3Processes.find((l) => l.name === selectedL3);
          if (l3) return l3.l4Tasks.map((l4) => l4.name);
        }
      }
      return [];
    }
    if (!selectedL1 && selectedL2 && !selectedL3) {
      for (const l1 of l1Processes) {
        const l2 = l1.l2Processes.find((l) => l.name === selectedL2);
        if (l2) return l2.l3Processes.flatMap((l3) => l3.l4Tasks.map((l4) => l4.name));
      }
      return [];
    }
    if (selectedL1 && !selectedL2 && !selectedL3) {
      const l1 = l1Processes.find((l) => l.nameEN === selectedL1);
      return l1 ? l1.l2Processes.flatMap((l2) => l2.l3Processes.flatMap((l3) => l3.l4Tasks.map((l4) => l4.name))) : [];
    }
    const l1 = l1Processes.find((l) => l.nameEN === selectedL1);
    if (!l1) return [];
    const l2 = l1.l2Processes.find((l) => l.name === selectedL2);
    if (!l2) return [];
    const l3 = l2.l3Processes.find((l) => l.name === selectedL3);
    return l3 ? l3.l4Tasks.map((l4) => l4.name) : [];
  };

  // Get L1 options
  const l1Options = getAllL1Names();
  const l2Options = getFilteredL2Options(formData.l1);
  const l3Options = getFilteredL3Options(formData.l1, formData.l2);
  const l4Options = getFilteredL4Options(formData.l1, formData.l2, formData.l3);

  // Handle area change
  const handleAreaChange = (value: string) => {
    if (value === "__new__") {
      setNewOptionDialog({ open: true, type: "area" });
      setNewOptionValue("");
      return;
    }
    updateField("area", value);
  };

  // Cascade handlers that auto-fill parent levels when child is selected
  const handleL1Change = (value: string) => {
    if (value === "__new__") {
      setNewOptionDialog({ open: true, type: "l1" });
      setNewOptionValue("");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      l1: value,
      l2: "",
      l3: "",
      l4: "",
    }));
    setChangedFields((prev) => new Set([...prev, "l1", "l2", "l3", "l4"]));
  };

  const handleL2Change = (value: string) => {
    if (value === "__new__") {
      setNewOptionDialog({ open: true, type: "l2" });
      setNewOptionValue("");
      return;
    }
    
    // Auto-fill L1 if not selected
    let newL1 = formData.l1;
    if (!newL1) {
      for (const l1 of l1Processes) {
        const found = l1.l2Processes.find((l2) => l2.name === value);
        if (found) {
          newL1 = l1.nameEN;
          break;
        }
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      l1: newL1,
      l2: value,
      l3: "",
      l4: "",
    }));
    setChangedFields((prev) => new Set([...prev, "l1", "l2", "l3", "l4"]));
  };

  const handleL3Change = (value: string) => {
    if (value === "__new__") {
      setNewOptionDialog({ open: true, type: "l3" });
      setNewOptionValue("");
      return;
    }
    
    // Auto-fill L1 and L2 if not selected
    let newL1 = formData.l1;
    let newL2 = formData.l2;
    
    for (const l1 of l1Processes) {
      for (const l2 of l1.l2Processes) {
        const found = l2.l3Processes.find((l3) => l3.name === value);
        if (found) {
          if (!newL1) newL1 = l1.nameEN;
          if (!newL2) newL2 = l2.name;
          break;
        }
      }
      if (newL1 && newL2) break;
    }
    
    setFormData((prev) => ({
      ...prev,
      l1: newL1,
      l2: newL2,
      l3: value,
      l4: "",
    }));
    setChangedFields((prev) => new Set([...prev, "l1", "l2", "l3", "l4"]));
  };

  const handleL4Change = (value: string) => {
    if (value === "__new__") {
      setNewOptionDialog({ open: true, type: "l4" });
      setNewOptionValue("");
      return;
    }
    
    // Find the L4 in the value chain and auto-fill parent levels
    for (const l1 of l1Processes) {
      for (const l2 of l1.l2Processes) {
        for (const l3 of l2.l3Processes) {
          const foundL4 = l3.l4Tasks.find((l4) => l4.name === value);
          if (foundL4) {
            setFormData((prev) => ({
              ...prev,
              l1: l1.nameEN,
              l2: l2.name,
              l3: l3.name,
              l4: value,
            }));
            setChangedFields((prev) => new Set([...prev, "l1", "l2", "l3", "l4"]));
            return;
          }
        }
      }
    }
    
    // If not found in hierarchy, just set L4
    updateField("l4", value);
  };

  const getDialogTitle = () => {
    switch (newOptionDialog.type) {
      case 'area': return language === "PT" ? "Nova Área" : "New Area";
      case 'l1': return language === "PT" ? "Novo L1 - End to End" : "New L1 - End to End";
      case 'l2': return language === "PT" ? "Novo L2 - Macroprocesso" : "New L2 - Macroprocess";
      case 'l3': return language === "PT" ? "Novo L3 - Processo" : "New L3 - Process";
      case 'l4': return language === "PT" ? "Novo L4 - Subprocesso" : "New L4 - Subprocess";
      default: return "";
    }
  };

  const getPlaceholder = () => {
    switch (newOptionDialog.type) {
      case 'area': return language === "PT" ? "Nome da área" : "Area name";
      case 'l1': return language === "PT" ? "Nome do End to End" : "End to End name";
      case 'l2': return language === "PT" ? "Nome do macroprocesso" : "Macroprocess name";
      case 'l3': return language === "PT" ? "Nome do processo" : "Process name";
      case 'l4': return language === "PT" ? "Nome do subprocesso" : "Subprocess name";
      default: return "";
    }
  };

  const handleAddNewOption = () => {
    if (!newOptionValue.trim()) return;
    
    const value = newOptionValue.trim();
    
    switch (newOptionDialog.type) {
      case 'area':
        const areaCode = value.toUpperCase().substring(0, 4);
        addArea({ 
          code: areaCode, 
          name: value, 
          description: '', 
          color: '#0C1BA8' 
        });
        updateField('area', areaCode);
        break;
      case 'l1':
        addL1({
          nameEN: value,
          namePT: value,
          category: "PRIMARY",
        });
        setFormData((prev) => ({ ...prev, l1: value, l2: "", l3: "", l4: "" }));
        setChangedFields((prev) => new Set([...prev, "l1", "l2", "l3", "l4"]));
        break;
      case 'l2': {
        const targetL1 = formData.l1 
          ? l1Processes.find((l1) => l1.nameEN === formData.l1)
          : l1Processes[0];
        
        if (targetL1) {
          addL2(targetL1.id, { name: value });
          if (!formData.l1) {
            setFormData((prev) => ({ ...prev, l1: targetL1.nameEN, l2: value, l3: "", l4: "" }));
          } else {
            setFormData((prev) => ({ ...prev, l2: value, l3: "", l4: "" }));
          }
          setChangedFields((prev) => new Set([...prev, "l1", "l2", "l3", "l4"]));
        } else {
          toast.error(language === "PT" ? "Crie um L1 primeiro" : "Create an L1 first");
        }
        break;
      }
      case 'l3': {
        const targetL1ForL3 = formData.l1 
          ? l1Processes.find((l1) => l1.nameEN === formData.l1)
          : l1Processes[0];
        
        if (!targetL1ForL3) {
          toast.error(language === "PT" ? "Crie um L1 primeiro" : "Create an L1 first");
          break;
        }
        
        const targetL2 = formData.l2
          ? targetL1ForL3.l2Processes.find((l2) => l2.name === formData.l2)
          : targetL1ForL3.l2Processes[0];
        
        if (targetL2) {
          addL3(targetL1ForL3.id, targetL2.id, { name: value, status: "active" });
          setFormData((prev) => ({ 
            ...prev, 
            l1: targetL1ForL3.nameEN, 
            l2: targetL2.name,
            l3: value,
            l4: ""
          }));
          setChangedFields((prev) => new Set([...prev, "l1", "l2", "l3", "l4"]));
        } else {
          toast.error(language === "PT" ? "Crie um L2 primeiro" : "Create an L2 first");
        }
        break;
      }
      case 'l4': {
        const targetL1ForL4 = formData.l1 
          ? l1Processes.find((l1) => l1.nameEN === formData.l1)
          : l1Processes[0];
        
        if (!targetL1ForL4) {
          toast.error(language === "PT" ? "Crie um L1 primeiro" : "Create an L1 first");
          break;
        }
        
        const targetL2ForL4 = formData.l2
          ? targetL1ForL4.l2Processes.find((l2) => l2.name === formData.l2)
          : targetL1ForL4.l2Processes[0];
        
        if (!targetL2ForL4) {
          toast.error(language === "PT" ? "Crie um L2 primeiro" : "Create an L2 first");
          break;
        }
        
        const targetL3 = formData.l3
          ? targetL2ForL4.l3Processes.find((l3) => l3.name === formData.l3)
          : targetL2ForL4.l3Processes[0];
        
        if (targetL3) {
          addL4(targetL1ForL4.id, targetL2ForL4.id, targetL3.id, { name: value, status: "active" });
          setFormData((prev) => ({ 
            ...prev, 
            l1: targetL1ForL4.nameEN, 
            l2: targetL2ForL4.name,
            l3: targetL3.name,
            l4: value 
          }));
          setChangedFields((prev) => new Set([...prev, "l1", "l2", "l3", "l4"]));
        } else {
          toast.error(language === "PT" ? "Crie um L3 primeiro" : "Create an L3 first");
        }
        break;
      }
    }
    
    toast.success(language === "PT" ? "Opção adicionada com sucesso!" : "Option added successfully!");
    setNewOptionDialog({ open: false, type: null });
    setNewOptionValue("");
  };

  const handleDiscard = () => {
    setFormData(initialFormData);
    setChangedFields(new Set());
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowExitDialog(true);
      setPendingExit(true);
    } else {
      onCancel();
    }
  };

  const handleExitConfirm = (action: "cancel" | "discard" | "save") => {
    setShowExitDialog(false);
    if (action === "cancel") {
      setPendingExit(false);
      return;
    }
    if (action === "save") {
      handleSave();
    }
    if (action === "discard") {
      onCancel();
    }
  };


  const addSystem = () => {
    if (newSystem.trim() && !formData.systems.includes(newSystem.trim())) {
      updateField("systems", [...formData.systems, newSystem.trim()]);
      setNewSystem("");
    }
  };

  const removeSystem = (index: number) => {
    updateField("systems", formData.systems.filter((_, i) => i !== index));
  };

  const fieldClassName = (field: string) =>
    cn(
      "transition-colors duration-200",
      isFieldChanged(field) && "bg-[#FFF8DC]"
    );

  return (
    <>
      <div className="flex flex-col h-full bg-white">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-[#E5EAED] px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <h1 className="text-lg font-semibold text-foreground">
              {language === "PT" ? "Atributos do Processo: " : "Process Attributes: "}
              <span className="text-primary">{process.name}</span>
            </h1>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="text-muted-foreground"
              >
                {language === "PT" ? "Cancelar" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDiscard}
                disabled={!hasChanges}
                className="text-muted-foreground"
              >
                {language === "PT" ? "Descartar" : "Discard"}
              </Button>
              <Button
                type="button"
                variant="corporate"
                onClick={handleSave}
                disabled={!hasChanges}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {language === "PT" ? "Salvar Alterações" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Accordion
              type="multiple"
              value={expandedSections}
              onValueChange={setExpandedSections}
              className="space-y-4"
            >
              {/* INFORMAÇÕES BÁSICAS */}
              <AccordionItem
                value="basic-info"
                className="bg-[#F8FAFB] border border-[#E5EAED] rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors duration-300">
                  <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    {language === "PT" ? "Informações Básicas" : "Basic Information"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 pt-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {language === "PT" ? "Nome" : "Name"}
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className={cn("mt-1.5 focus:border-[#2BA0B8]", fieldClassName("name"))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {language === "PT" ? "Descrição" : "Description"}
                      </Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className={cn("mt-1.5 min-h-20 focus:border-[#2BA0B8]", fieldClassName("description"))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {language === "PT" ? "Área" : "Area"}
                      </Label>
                      <Select value={formData.area} onValueChange={handleAreaChange}>
                        <SelectTrigger className={cn("mt-1.5", fieldClassName("area"))}>
                          <SelectValue placeholder={language === "PT" ? "Selecionar área" : "Select area"} />
                        </SelectTrigger>
                        <SelectContent>
                          {settings.areas.map((area) => (
                            <SelectItem key={area.id} value={area.code}>
                              {area.code} - {area.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="__new__" className="text-primary font-medium">
                            <span className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              {language === "PT" ? "Criar nova..." : "Create new..."}
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* STAKEHOLDERS */}
              <AccordionItem
                value="stakeholders"
                className="bg-[#F8FAFB] border border-[#E5EAED] rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors duration-300">
                  <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    Stakeholders
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Executor
                      </Label>
                      <Input
                        value={formData.executor}
                        onChange={(e) => updateField("executor", e.target.value)}
                        className={cn("mt-1.5 focus:border-[#2BA0B8]", fieldClassName("executor"))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {language === "PT" ? "Aprovador" : "Approver"}
                      </Label>
                      <Input
                        value={formData.approver}
                        onChange={(e) => updateField("approver", e.target.value)}
                        className={cn("mt-1.5 focus:border-[#2BA0B8]", fieldClassName("approver"))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {language === "PT" ? "Dono do Processo" : "Process Owner"}
                      </Label>
                      <Input
                        value={formData.owner}
                        onChange={(e) => updateField("owner", e.target.value)}
                        className={cn("mt-1.5 focus:border-[#2BA0B8]", fieldClassName("owner"))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {language === "PT" ? "Equipe de Suporte" : "Support Team"}
                      </Label>
                      <Input
                        value={formData.supportTeam}
                        onChange={(e) => updateField("supportTeam", e.target.value)}
                        className={cn("mt-1.5 focus:border-[#2BA0B8]", fieldClassName("supportTeam"))}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CADEIA DE VALOR */}
              <AccordionItem
                value="value-chain"
                className="bg-[#F8FAFB] border border-[#E5EAED] rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors duration-300">
                  <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    {language === "PT" ? "Cadeia de Valor" : "Value Chain"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">L1</Label>
                      <Select value={formData.l1} onValueChange={handleL1Change}>
                        <SelectTrigger className={cn("mt-1.5", fieldClassName("l1"))}>
                          <SelectValue placeholder={language === "PT" ? "Selecionar L1" : "Select L1"} />
                        </SelectTrigger>
                        <SelectContent>
                          {l1Options.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                          <SelectItem value="__new__" className="text-primary font-medium">
                            <span className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              {language === "PT" ? "Criar novo..." : "Create new..."}
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">L2</Label>
                      <Select value={formData.l2} onValueChange={handleL2Change}>
                        <SelectTrigger className={cn("mt-1.5", fieldClassName("l2"))}>
                          <SelectValue placeholder={language === "PT" ? "Selecionar L2" : "Select L2"} />
                        </SelectTrigger>
                        <SelectContent>
                          {l2Options.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                          <SelectItem value="__new__" className="text-primary font-medium">
                            <span className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              {language === "PT" ? "Criar novo..." : "Create new..."}
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">L3</Label>
                      <Select value={formData.l3} onValueChange={handleL3Change}>
                        <SelectTrigger className={cn("mt-1.5", fieldClassName("l3"))}>
                          <SelectValue placeholder={language === "PT" ? "Selecionar L3" : "Select L3"} />
                        </SelectTrigger>
                        <SelectContent>
                          {l3Options.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                          <SelectItem value="__new__" className="text-primary font-medium">
                            <span className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              {language === "PT" ? "Criar novo..." : "Create new..."}
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">L4</Label>
                      <Select value={formData.l4} onValueChange={handleL4Change}>
                        <SelectTrigger className={cn("mt-1.5", fieldClassName("l4"))}>
                          <SelectValue placeholder={language === "PT" ? "Selecionar L4" : "Select L4"} />
                        </SelectTrigger>
                        <SelectContent>
                          {l4Options.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                          <SelectItem value="__new__" className="text-primary font-medium">
                            <span className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              {language === "PT" ? "Criar novo..." : "Create new..."}
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* EXECUÇÃO */}
              <AccordionItem
                value="execution"
                className="bg-[#F8FAFB] border border-[#E5EAED] rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors duration-300">
                  <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    {language === "PT" ? "Execução" : "Execution"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {language === "PT" ? "Frequência" : "Frequency"}
                      </Label>
                      <Select value={formData.frequency} onValueChange={(v) => updateField("frequency", v)}>
                        <SelectTrigger className={cn("mt-1.5", fieldClassName("frequency"))}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencies.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Ad-hoc frequency field */}
                    {formData.frequency === "adhoc" && (
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">
                          {language === "PT" ? "Média de vezes por mês" : "Average times per month"}
                        </Label>
                        <Input
                          type="number"
                          value={formData.adhocMonthly}
                          onChange={(e) => updateField("adhocMonthly", e.target.value)}
                          placeholder="Ex: 5"
                          className={cn("mt-1.5 focus:border-[#2BA0B8]", fieldClassName("adhocMonthly"))}
                        />
                      </div>
                    )}

                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">SLA</Label>
                      <Input
                        value={formData.sla}
                        onChange={(e) => updateField("sla", e.target.value)}
                        className={cn("mt-1.5 focus:border-[#2BA0B8]", fieldClassName("sla"))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {language === "PT" ? "Criado em" : "Created at"}
                      </Label>
                      <Input
                        value={formData.createdAt}
                        readOnly
                        className="mt-1.5 bg-muted/50 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {language === "PT" ? "Última Revisão" : "Last Review"}
                      </Label>
                      <Input
                        value={formData.lastReview}
                        readOnly
                        className="mt-1.5 bg-muted/50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  
                  {/* Execution Effort Table */}
                  <ExecutionEffortTable
                    value={formData.executionEffort}
                    onChange={(positions) => updateField("executionEffort", positions as any)}
                    areaCode={formData.area}
                    frequency={formData.frequency}
                    adhocMonthly={formData.adhocMonthly}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* COMPLIANCE & REGULAÇÃO */}
              <AccordionItem
                value="compliance"
                className="bg-[#F8FAFB] border border-[#E5EAED] rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors duration-300">
                  <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    {language === "PT" ? "Compliance & Regulação" : "Compliance & Regulation"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 pt-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {language === "PT" ? "Regulações" : "Regulations"}
                      </Label>
                      <Textarea
                        value={formData.regulations}
                        onChange={(e) => updateField("regulations", e.target.value)}
                        placeholder={language === "PT" ? "ISO 9001, LGPD, SOX..." : "ISO 9001, GDPR, SOX..."}
                        className={cn("mt-1.5 min-h-20 focus:border-[#2BA0B8]", fieldClassName("regulations"))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">KPIs</Label>
                      <Textarea
                        value={formData.kpis}
                        onChange={(e) => updateField("kpis", e.target.value)}
                        placeholder={language === "PT" ? "Um KPI por linha" : "One KPI per line"}
                        className={cn("mt-1.5 min-h-20 focus:border-[#2BA0B8]", fieldClassName("kpis"))}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* SISTEMAS & FERRAMENTAS */}
              <AccordionItem
                value="systems"
                className="bg-[#F8FAFB] border border-[#E5EAED] rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors duration-300">
                  <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    {language === "PT" ? "Sistemas & Ferramentas" : "Systems & Tools"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 pt-2">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.systems.map((system, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {system}
                          <button
                            type="button"
                            onClick={() => removeSystem(index)}
                            className="hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={newSystem}
                        onChange={(e) => setNewSystem(e.target.value)}
                        placeholder={language === "PT" ? "Nome do sistema..." : "System name..."}
                        className="flex-1 focus:border-[#2BA0B8]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSystem();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addSystem}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {language === "PT" ? "Adicionar Sistema" : "Add System"}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* DOCUMENTAÇÃO */}
              <AccordionItem
                value="documentation"
                className="bg-[#F8FAFB] border border-[#E5EAED] rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors duration-300">
                  <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    {language === "PT" ? "Documentação" : "Documentation"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 pt-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">
                          {language === "PT" ? "Versão" : "Version"}
                        </Label>
                        <Input
                          value={formData.version}
                          onChange={(e) => updateField("version", e.target.value)}
                          className={cn("mt-1.5 focus:border-[#2BA0B8]", fieldClassName("version"))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">
                          {language === "PT" ? "Última Revisão" : "Last Review"}
                        </Label>
                        <Input
                          type="date"
                          value={formData.docLastReview}
                          onChange={(e) => updateField("docLastReview", e.target.value)}
                          className={cn("mt-1.5 focus:border-[#2BA0B8]", fieldClassName("docLastReview"))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">
                          {language === "PT" ? "Próxima Revisão" : "Next Review"}
                        </Label>
                        <Input
                          type="date"
                          value={formData.docNextReview}
                          onChange={(e) => updateField("docNextReview", e.target.value)}
                          className={cn("mt-1.5 focus:border-[#2BA0B8]", fieldClassName("docNextReview"))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <Button type="button" variant="outline" className="gap-2">
                        <History className="h-4 w-4" />
                        {language === "PT" ? "Ver Histórico" : "View History"}
                      </Button>
                      <Button type="button" variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        {language === "PT" ? "Baixar" : "Download"}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Mobile Sticky Bottom Buttons */}
        <div className="md:hidden sticky bottom-0 z-20 bg-white border-t border-[#E5EAED] px-4 py-3 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            {language === "PT" ? "Cancelar" : "Cancel"}
          </Button>
          <Button
            type="button"
            variant="corporate"
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 gap-2"
          >
            <Save className="h-4 w-4" />
            {language === "PT" ? "Salvar" : "Save"}
          </Button>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "PT" ? "Mudanças não salvas" : "Unsaved Changes"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "PT"
                ? "Você tem alterações não salvas. O que deseja fazer?"
                : "You have unsaved changes. What would you like to do?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => handleExitConfirm("cancel")}>
              {language === "PT" ? "Cancelar" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleExitConfirm("discard")}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {language === "PT" ? "Descartar" : "Discard"}
            </AlertDialogAction>
            <AlertDialogAction onClick={() => handleExitConfirm("save")}>
              {language === "PT" ? "Salvar e Sair" : "Save & Exit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Option Dialog */}
      <Dialog open={newOptionDialog.open} onOpenChange={(open) => setNewOptionDialog({ open, type: newOptionDialog.type })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="newOption">
              {language === "PT" ? "Nome" : "Name"}
            </Label>
            <Input
              id="newOption"
              value={newOptionValue}
              onChange={(e) => setNewOptionValue(e.target.value)}
              placeholder={getPlaceholder()}
              className="mt-1.5"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddNewOption();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOptionDialog({ open: false, type: null })}>
              {language === "PT" ? "Cancelar" : "Cancel"}
            </Button>
            <Button onClick={handleAddNewOption} disabled={!newOptionValue.trim()}>
              {language === "PT" ? "Adicionar" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
