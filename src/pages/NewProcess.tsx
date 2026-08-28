import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TopBar } from "@/components/layout/TopBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useProcessStore } from "@/stores/processStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useValueChainStore } from "@/stores/valueChainStore";
import { useTaxonomy } from "@/stores/taxonomyStore";
import { BusinessUnitField } from "@/components/architecture/modals/hierarchyFields";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface NewProcessProps {
  onLogout: () => void;
}

const frequencies = ["Diário", "Semanal", "Mensal", "Trimestral", "Anual", "Sob demanda", "Contínuo"];

type OptionType = 'area' | 'l1' | 'l2' | 'l3' | 'l4';

export function NewProcess({ onLogout }: NewProcessProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { addProcess } = useProcessStore();
  const { settings, addArea } = useSettingsStore();
  const { getAllL1Names, addL1, addL2, addL3, addL4, l1Processes } = useValueChainStore();
  const { label, hasLevel } = useTaxonomy();
  
  // Get options from stores
  const areas = settings.areas.map(a => a.code);
  const l1Options = getAllL1Names();
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newOptionDialog, setNewOptionDialog] = useState<{ open: boolean; type: OptionType | null }>({ open: false, type: null });
  const [newOptionValue, setNewOptionValue] = useState("");
  
  const [formData, setFormData] = useState({
    name: "Span & Layer",
    area: "HR",
    businessUnit: "",
    description:
      "Ciclo trimestral de análise de Span of Control e Layers da estrutura organizacional, hoje executado em Excel a partir de extrações manuais do Workday, com geração de relatórios para a liderança.",
    l1: "",
    l2: "",
    l3: "",
    l4: "",
    executor: "Analista Workforce",
    approver: "Head de RH",
    avgTime: "6h",
    frequency: "Trimestral",
  });

  // Cascading filter functions - return filtered options OR all options if parent not selected
  const getFilteredL2Options = (selectedL1: string): string[] => {
    if (!selectedL1) {
      // Return all L2s from all L1s
      return l1Processes.flatMap((l1) => l1.l2Processes.map((l2) => l2.name));
    }
    const l1 = l1Processes.find((l) => l.nameEN === selectedL1);
    return l1 ? l1.l2Processes.map((l2) => l2.name) : [];
  };

  const getFilteredL3Options = (selectedL1: string, selectedL2: string): string[] => {
    if (!selectedL1 && !selectedL2) {
      // Return all L3s from all L1s/L2s
      return l1Processes.flatMap((l1) => 
        l1.l2Processes.flatMap((l2) => l2.l3Processes.map((l3) => l3.name))
      );
    }
    if (!selectedL1 && selectedL2) {
      // Find L3s from matching L2
      for (const l1 of l1Processes) {
        const l2 = l1.l2Processes.find((l) => l.name === selectedL2);
        if (l2) return l2.l3Processes.map((l3) => l3.name);
      }
      return [];
    }
    if (selectedL1 && !selectedL2) {
      // Return all L3s from selected L1
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
      // Return all L4s
      return l1Processes.flatMap((l1) => 
        l1.l2Processes.flatMap((l2) => 
          l2.l3Processes.flatMap((l3) => l3.l4Tasks.map((l4) => l4.name))
        )
      );
    }
    if (!selectedL1 && !selectedL2 && selectedL3) {
      // Find L4s from matching L3
      for (const l1 of l1Processes) {
        for (const l2 of l1.l2Processes) {
          const l3 = l2.l3Processes.find((l) => l.name === selectedL3);
          if (l3) return l3.l4Tasks.map((l4) => l4.name);
        }
      }
      return [];
    }
    if (!selectedL1 && selectedL2 && !selectedL3) {
      // Return all L4s from matching L2
      for (const l1 of l1Processes) {
        const l2 = l1.l2Processes.find((l) => l.name === selectedL2);
        if (l2) return l2.l3Processes.flatMap((l3) => l3.l4Tasks.map((l4) => l4.name));
      }
      return [];
    }
    if (selectedL1 && !selectedL2 && !selectedL3) {
      // Return all L4s from selected L1
      const l1 = l1Processes.find((l) => l.nameEN === selectedL1);
      return l1 ? l1.l2Processes.flatMap((l2) => l2.l3Processes.flatMap((l3) => l3.l4Tasks.map((l4) => l4.name))) : [];
    }
    // Full path specified
    const l1 = l1Processes.find((l) => l.nameEN === selectedL1);
    if (!l1) return [];
    const l2 = l1.l2Processes.find((l) => l.name === selectedL2);
    if (!l2) return [];
    const l3 = l2.l3Processes.find((l) => l.name === selectedL3);
    return l3 ? l3.l4Tasks.map((l4) => l4.name) : [];
  };

  // Filtered options based on current selections (deduplicated)
  const uniq = (arr: string[]) => Array.from(new Set(arr));
  const l2Options = uniq(getFilteredL2Options(formData.l1));
  const l3Options = uniq(getFilteredL3Options(formData.l1, formData.l2));
  const l4Options = uniq(getFilteredL4Options(formData.l1, formData.l2, formData.l3));


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.area || !formData.description.trim()) {
      toast.error(language === "PT" ? "Preencha todos os campos obrigatórios" : "Fill in all required fields");
      return;
    }
    
    const newProcessId = await addProcess({
      name: formData.name.trim(),
      area: formData.area,
      businessUnit: formData.businessUnit || undefined,
      description: formData.description.trim(),
      l1: formData.l1 || undefined,
      l2: formData.l2 || undefined,
      l3: formData.l3 || undefined,
      l4: formData.l4 || undefined,
      executor: formData.executor || undefined,
      approver: formData.approver || undefined,
      avgTime: formData.avgTime || undefined,
      frequency: formData.frequency || undefined,
      isFavorite: false,
    });
    
    if (newProcessId) {
      toast.success(language === "PT" ? "Processo criado com sucesso!" : "Process created successfully!");
      navigate("/processes");
    } else {
      toast.error(language === "PT" ? "Erro ao criar processo" : "Error creating process");
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
  };

  const handleSelectChange = (field: string, value: string, type: OptionType) => {
    if (value === "__new__") {
      setNewOptionDialog({ open: true, type });
      setNewOptionValue("");
    } else {
      updateField(field, value);
    }
  };

  const handleAddNewOption = () => {
    if (!newOptionValue.trim()) return;
    
    const value = newOptionValue.trim();
    
    switch (newOptionDialog.type) {
      case 'area':
        // Add to settings store (single source of truth)
        addArea({ 
          code: value.toUpperCase().substring(0, 4), 
          name: value, 
          description: '', 
          color: '#0C1BA8' 
        });
        updateField('area', value.toUpperCase().substring(0, 4));
        break;
      case 'l1':
        // Add to valueChainStore - need to add as a full L1
        addL1({
          nameEN: value,
          namePT: value,
          category: "PRIMARY",
        });
        updateField('l1', value);
        break;
      case 'l2': {
        // Add L2 to selected L1, or first L1 if none selected
        const targetL1 = formData.l1 
          ? l1Processes.find((l1) => l1.nameEN === formData.l1)
          : l1Processes[0];
        
        if (targetL1) {
          addL2(targetL1.id, { name: value });
          // Auto-fill L1 if not selected
          if (!formData.l1) {
            setFormData((prev) => ({ ...prev, l1: targetL1.nameEN, l2: value }));
          } else {
            updateField('l2', value);
          }
        } else {
          toast.error(language === "PT" ? `Crie um ${label("l1")} primeiro` : `Create a ${label("l1")} first`);
        }
        break;
      }
      case 'l3': {
        // Add L3 to selected L2, or find appropriate parent
        const targetL1ForL3 = formData.l1 
          ? l1Processes.find((l1) => l1.nameEN === formData.l1)
          : l1Processes[0];
        
        if (!targetL1ForL3) {
          toast.error(language === "PT" ? `Crie um ${label("l1")} primeiro` : `Create a ${label("l1")} first`);
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
            l3: value 
          }));
        } else {
          toast.error(language === "PT" ? `Crie um ${label("l2")} primeiro` : `Create a ${label("l2")} first`);
        }
        break;
      }
      case 'l4': {
        // Add L4 to selected L3, or find appropriate parent
        const targetL1ForL4 = formData.l1 
          ? l1Processes.find((l1) => l1.nameEN === formData.l1)
          : l1Processes[0];
        
        if (!targetL1ForL4) {
          toast.error(language === "PT" ? `Crie um ${label("l1")} primeiro` : `Create a ${label("l1")} first`);
          break;
        }
        
        const targetL2ForL4 = formData.l2
          ? targetL1ForL4.l2Processes.find((l2) => l2.name === formData.l2)
          : targetL1ForL4.l2Processes[0];
        
        if (!targetL2ForL4) {
          toast.error(language === "PT" ? `Crie um ${label("l2")} primeiro` : `Create a ${label("l2")} first`);
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
        } else {
          toast.error(language === "PT" ? `Crie um ${label("l3")} primeiro` : `Create a ${label("l3")} first`);
        }
        break;
      }
    }
    
    toast.success(language === "PT" ? "Opção adicionada com sucesso!" : "Option added successfully!");
    setNewOptionDialog({ open: false, type: null });
    setNewOptionValue("");
  };

  const getDialogTitle = () => {
    switch (newOptionDialog.type) {
      case 'area': return language === "PT" ? "Nova Área" : "New Area";
      case 'l1': return language === "PT" ? `Novo ${label("l1")}` : `New ${label("l1")}`;
      case 'l2': return language === "PT" ? `Novo ${label("l2")}` : `New ${label("l2")}`;
      case 'l3': return language === "PT" ? `Novo ${label("l3")}` : `New ${label("l3")}`;
      case 'l4': return language === "PT" ? `Novo ${label("l4")}` : `New ${label("l4")}`;
      default: return "";
    }
  };

  const getPlaceholder = () => {
    switch (newOptionDialog.type) {
      case 'area': return language === "PT" ? "Nome da área" : "Area name";
      case 'l1': return language === "PT" ? `Nome do ${label("l1")}` : `${label("l1")} name`;
      case 'l2': return language === "PT" ? `Nome do ${label("l2")}` : `${label("l2")} name`;
      case 'l3': return language === "PT" ? `Nome do ${label("l3")}` : `${label("l3")} name`;
      case 'l4': return language === "PT" ? `Nome do ${label("l4")}` : `${label("l4")} name`;
      default: return "";
    }
  };

  // Auto-fill L1, L2, L3 when L4 is selected
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
            return;
          }
        }
      }
    }
    
    // If not found in hierarchy, just set L4
    updateField("l4", value);
  };

  const renderSelectWithNew = (
    field: string,
    label: string,
    options: string[],
    type: OptionType,
    placeholder: string,
    value: string
  ) => (
    <div>
      <Label htmlFor={field}>{label}</Label>
      <Select 
        value={value} 
        onValueChange={(v) => handleSelectChange(field, v, type)}
      >
        <SelectTrigger className="mt-1.5">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
          <SelectItem value="__new__" className="text-primary font-medium">
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {language === "PT" ? "Adicionar novo..." : "Add new..."}
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onLogout={onLogout} />

      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <button 
            onClick={() => navigate("/processes")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            {language === "PT" ? "Voltar para Lista de Processos" : "Back to Process List"}
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              {language === "PT" ? "Novo Processo" : "New Process"}
            </h1>
            <p className="text-muted-foreground">
              {language === "PT" ? "Cadastre um novo processo no sistema" : "Register a new process in the system"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Required Fields */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h3 className="font-medium text-foreground mb-4">
                {language === "PT" ? "Informações Básicas" : "Basic Information"}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    {language === "PT" ? "Nome do Processo *" : "Process Name *"}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder={language === "PT" ? "Digite o nome do processo" : "Enter process name"}
                    className="mt-1.5"
                    required
                  />
                </div>

                {renderSelectWithNew(
                  "area",
                  language === "PT" ? "Área *" : "Area *",
                  areas,
                  "area",
                  language === "PT" ? "Selecione a área" : "Select area",
                  formData.area
                )}

                <BusinessUnitField
                  id="process-bu"
                  value={formData.businessUnit}
                  onChange={(v) => updateField("businessUnit", v)}
                  language={language}
                />

                <div>
                  <Label htmlFor="description">
                    {language === "PT" ? "Descrição *" : "Description *"}
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder={language === "PT" ? "Descreva os objetivos e escopo do processo" : "Describe the process objectives and scope"}
                    className="mt-1.5 min-h-24"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Advanced Fields */}
            <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="font-medium text-foreground">
                  {language === "PT" ? "Configurações Avançadas" : "Advanced Settings"}
                </span>
                {showAdvanced ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-2 border-t border-border space-y-4">
                  {/* Value Chain */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      {language === "PT" ? "Cadeia de Valor" : "Value Chain"}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {/* L1 */}
                      <div>
                        <Label htmlFor="l1">{label("l1")}</Label>
                        <Select value={formData.l1} onValueChange={handleL1Change}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder={language === "PT" ? `Selecione ${label("l1")}` : `Select ${label("l1")}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {l1Options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                            <SelectItem value="__new__" className="text-primary font-medium">
                              <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                {language === "PT" ? "Adicionar novo..." : "Add new..."}
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* L2 - filtered by L1 but can be selected directly */}
                      <div>
                        <Label htmlFor="l2">{label("l2")}</Label>
                        <Select 
                          value={formData.l2} 
                          onValueChange={handleL2Change}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder={language === "PT" ? `Selecione ${label("l2")}` : `Select ${label("l2")}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {l2Options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                            <SelectItem value="__new__" className="text-primary font-medium">
                              <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                {language === "PT" ? "Adicionar novo..." : "Add new..."}
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* L3 - filtered by L2 but can be selected directly */}
                      {hasLevel("l3") && (
                        <div>
                          <Label htmlFor="l3">{label("l3")}</Label>
                          <Select 
                            value={formData.l3} 
                            onValueChange={handleL3Change}
                          >
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder={language === "PT" ? `Selecione ${label("l3")}` : `Select ${label("l3")}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {l3Options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                              <SelectItem value="__new__" className="text-primary font-medium">
                                <span className="flex items-center gap-2">
                                  <Plus className="h-4 w-4" />
                                  {language === "PT" ? "Adicionar novo..." : "Add new..."}
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* L4 - filtered by L3 but can be selected directly with auto-fill */}
                      {hasLevel("l4") && (
                        <div>
                          <Label htmlFor="l4">{label("l4")}</Label>
                          <Select 
                            value={formData.l4} 
                            onValueChange={handleL4Change}
                          >
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder={language === "PT" ? `Selecione ${label("l4")}` : `Select ${label("l4")}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {l4Options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                              <SelectItem value="__new__" className="text-primary font-medium">
                                <span className="flex items-center gap-2">
                                  <Plus className="h-4 w-4" />
                                  {language === "PT" ? "Adicionar novo..." : "Add new..."}
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stakeholders */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      {language === "PT" ? "Responsáveis" : "Stakeholders"}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="executor">{language === "PT" ? "Executor" : "Executor"}</Label>
                        <Input
                          id="executor"
                          value={formData.executor}
                          onChange={(e) => updateField("executor", e.target.value)}
                          placeholder={language === "PT" ? "Cargo ou equipe" : "Role or team"}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="approver">{language === "PT" ? "Aprovador" : "Approver"}</Label>
                        <Input
                          id="approver"
                          value={formData.approver}
                          onChange={(e) => updateField("approver", e.target.value)}
                          placeholder={language === "PT" ? "Cargo ou equipe" : "Role or team"}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time & Frequency */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      {language === "PT" ? "Tempo e Frequência" : "Time & Frequency"}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="avgTime">
                          {language === "PT" ? "Tempo Médio de Execução" : "Average Execution Time"}
                        </Label>
                        <Input
                          id="avgTime"
                          value={formData.avgTime}
                          onChange={(e) => updateField("avgTime", e.target.value)}
                          placeholder={language === "PT" ? "Ex: 2 horas" : "e.g., 2 hours"}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="frequency">
                          {language === "PT" ? "Frequência de Execução" : "Execution Frequency"}
                        </Label>
                        <Select value={formData.frequency} onValueChange={(v) => updateField("frequency", v)}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder={language === "PT" ? "Selecione a frequência" : "Select frequency"} />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencies.map((freq) => (
                              <SelectItem key={freq} value={freq}>
                                {freq}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/processes")}>
                {language === "PT" ? "Cancelar" : "Cancel"}
              </Button>
              <Button type="submit" variant="corporate">
                {language === "PT" ? "Criar Processo" : "Create Process"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Dialog for adding new option */}
      <Dialog open={newOptionDialog.open} onOpenChange={(open) => setNewOptionDialog({ open, type: open ? newOptionDialog.type : null })}>
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
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
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
            <Button 
              onClick={handleAddNewOption}
              disabled={!newOptionValue.trim()}
              variant="corporate"
            >
              {language === "PT" ? "Adicionar" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
