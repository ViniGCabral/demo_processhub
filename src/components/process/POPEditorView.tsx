import { useState, useEffect, useRef } from "react";
import { 
  Upload, Sparkles, FileText, Check, Eye, Edit3, 
  Bold, Italic, Underline, List, ListOrdered, Link, Image, Plus, Trash2, 
  Download, Printer, MoreHorizontal, RefreshCw, Target, Shield, Clock, 
  Users, Monitor, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, AlertTriangle, Loader2, GripVertical,
  Repeat, Layers, BarChart3

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSopStore, SOPData, SOPStep, SOPSubstep } from "@/stores/sopStore";
import { PublishDialog } from "./PublishDialog";
import { ImageAlternatives } from "./ImageAlternatives";
import { ImageAnnotator, AnnotatedImage, type Annotation } from "./ImageAnnotator";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableStep } from "./SortableStep";
import { SortableSubstep } from "./SortableSubstep";
import { SOPOutlinePanel } from "./SOPOutlinePanel";
import {
  applySopHighlights,
  clearSopHighlights,
  focusSopHighlight,
  activeHitStepId,
} from "@/lib/sopSearchHighlight";
import { StepMicroAttributes } from "./StepMicroAttributes";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface POPEditorViewProps {
  hasPOP: boolean;
  processId?: string;
  processName?: string;
  isNewlyGenerated?: boolean;
}

interface Version {
  id: string;
  label: string;
  date: string;
  status: "Published" | "Draft" | "Archived";
}

const PROCESS_CLASSES = [
  { value: "core" as const, pt: "Core", en: "Core" },
  { value: "support" as const, pt: "Apoio", en: "Support" },
  { value: "management" as const, pt: "Gestão", en: "Management" },
];

const PROCESS_CLASS_STYLES: Record<string, string> = {
  core: "bg-sidebar-accent text-primary",
  support: "bg-muted text-muted-foreground",
  management: "bg-amber-50 text-amber-700",
};


const isSpanLayerDemo = (name?: string) => {
  if (!name) return false;
  const n = name.toLowerCase();
  return n.includes("span") && n.includes("layer");
};

export function POPEditorView({ hasPOP, processId = "1", processName, isNewlyGenerated = false }: POPEditorViewProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [showEditor, setShowEditor] = useState(hasPOP);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [annotationsMap, setAnnotationsMap] = useState<Record<string, Annotation[]>>({});
  const [annotatingSubstep, setAnnotatingSubstep] = useState<{ stepId: string; substepId: string; imageSrc: string } | null>(null);
  
  // Get the correct SOP data based on process ID
  // DEMO MODE: For new processes (no explicit data), use IT Prepaid mock data
  // For "Span & Layer" demo process, use the dedicated mock SOP
  const getSOP = useSopStore(state => state.getSOP);
  const upsertSOP = useSopStore(state => state.upsertSOP);
  const lookupId = isSpanLayerDemo(processName) ? "span-layer" : processId;
  const currentSopData: SOPData = getSOP(lookupId) || { id: '', title: '', code: '', area: '', objective: '', steps: [] };
  
  // Editable state
  const [editableTitle, setEditableTitle] = useState(currentSopData.title);
  const [editableProcessId, setEditableProcessId] = useState(currentSopData.processId || "");
  const [editableObjective, setEditableObjective] = useState(currentSopData.objective);
  const [editableSteps, setEditableSteps] = useState<SOPStep[]>(currentSopData.steps);

  // Navigation / search
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<string>("__header__");
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Editable metadata state
  const [editableMetadata, setEditableMetadata] = useState({
    soxControls: currentSopData.metadata?.soxControls || "",
    sla: currentSopData.metadata?.sla || "",
    frequency: currentSopData.metadata?.frequency || "",
    estimatedTime: currentSopData.metadata?.estimatedTime || "",
    volumetry: currentSopData.metadata?.volumetry || "",
    classification: (currentSopData.metadata?.classification || "") as "" | "core" | "support" | "management",
    kpis: currentSopData.metadata?.kpis || "",
    responsible: currentSopData.metadata?.raci?.responsible || "",
    approver: currentSopData.metadata?.raci?.approver || "",
    systems: currentSopData.metadata?.systems?.join(", ") || "",
  });

  // Initialize all steps as expanded
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    currentSopData.steps.forEach(step => {
      initialExpanded[step.id] = true;
    });
    setExpandedSteps(initialExpanded);
  }, [currentSopData.steps]);

  // Version management - always start as V1 Draft for demo
  const [versions, setVersions] = useState<Version[]>([
    { id: "v1", label: "v1.0", date: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }), status: "Draft" }
  ]);
  const [selectedVersion, setSelectedVersion] = useState("v1");

  // Reset data when processId changes
  useEffect(() => {
    const targetId = isSpanLayerDemo(processName) ? "span-layer" : processId;
    const newSopData = getSOP(targetId) || { id: '', title: '', code: '', area: '', objective: '', steps: [] as SOPStep[], metadata: undefined };
    setEditableTitle(newSopData.title);
    setEditableProcessId(newSopData.processId || "");
    setEditableObjective(newSopData.objective);
    setEditableSteps(newSopData.steps);
    setEditableMetadata({
      soxControls: newSopData.metadata?.soxControls || "",
      sla: newSopData.metadata?.sla || "",
      frequency: newSopData.metadata?.frequency || "",
      estimatedTime: newSopData.metadata?.estimatedTime || "",
      volumetry: newSopData.metadata?.volumetry || "",
      classification: (newSopData.metadata?.classification || "") as "" | "core" | "support" | "management",
      kpis: newSopData.metadata?.kpis || "",
      responsible: newSopData.metadata?.raci?.responsible || "",
      approver: newSopData.metadata?.raci?.approver || "",
      systems: newSopData.metadata?.systems?.join(", ") || "",
    });
    setHasUnsavedChanges(false);
  }, [processId, processName]);

  // Search matches per step (title + substeps + nested)
  const searchMatches: Record<string, number> = {};
  const q = search.trim().toLowerCase();
  if (q) {
    editableSteps.forEach((step) => {
      let count = 0;
      const countIn = (text?: string) => {
        if (!text) return;
        count += text.toLowerCase().split(q).length - 1;
      };
      countIn(step.title);
      countIn(step.executor);
      countIn(step.system);
      step.substeps?.forEach((sub) => {
        countIn(sub.description);
        sub.children?.forEach((child) => countIn(child.description));
      });
      searchMatches[step.id] = count;
    });
  }

  // ---- Google Docs style search highlight + hit navigation ----
  const [totalHits, setTotalHits] = useState(0);
  const [currentHit, setCurrentHit] = useState(0);

  // Expand every step that has matches so hits are reachable
  useEffect(() => {
    if (!q) return;
    setExpandedSteps((prev) => {
      const next = { ...prev };
      editableSteps.forEach((s) => {
        if ((searchMatches[s.id] || 0) > 0) next[s.id] = true;
      });
      return next;
    });
    setCurrentHit(0);
  }, [q]);

  // (Re)apply highlights whenever the query or rendered content changes
  useEffect(() => {
    const root = scrollRef.current;
    clearSopHighlights(root);
    if (!q) {
      setTotalHits(0);
      return;
    }
    const hits = applySopHighlights(root, q);
    setTotalHits(hits);
    return () => clearSopHighlights(root);
  }, [q, editableSteps, expandedSteps, isEditMode]);

  // Focus the current hit
  useEffect(() => {
    if (!q || totalHits === 0) return;
    focusSopHighlight(scrollRef.current, currentHit);
    const stepId = activeHitStepId(scrollRef.current);
    if (stepId) setActiveSection(stepId);
  }, [currentHit, totalHits, q]);

  const goToHit = (delta: number) => {
    if (totalHits === 0) return;
    setCurrentHit((prev) => (prev + delta + totalHits) % totalHits);
  };

  const handleScrollSpy = () => {
    const container = scrollRef.current;
    if (!container) return;
    const top = container.getBoundingClientRect().top;
    let current = "__header__";
    for (const s of editableSteps) {
      const el = stepRefs.current[s.id];
      if (!el) continue;
      if (el.getBoundingClientRect().top - top <= 100) current = s.id;
    }
    setActiveSection((prev) => (prev === current ? prev : current));
  };

  const handleSelectSection = (sectionId: string) => {

    setActiveSection(sectionId);
    const target = sectionId === "__header__" ? headerRef.current : stepRefs.current[sectionId];
    if (sectionId !== "__header__") {
      setExpandedSteps((prev) => ({ ...prev, [sectionId]: true }));
    }
    requestAnimationFrame(() => {
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSelectSubstep = (stepId: string, substepId: string) => {
    setActiveSection(stepId);
    setExpandedSteps((prev) => ({ ...prev, [stepId]: true }));
    requestAnimationFrame(() => {
      const el = scrollRef.current?.querySelector<HTMLElement>(
        `[data-substep-id="${substepId}"]`
      );
      (el || stepRefs.current[stepId])?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const handleStepFieldChange = (stepId: string, field: keyof SOPStep, value: string | boolean | undefined) => {
    setEditableSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, [field]: value } : step))
    );
    setHasUnsavedChanges(true);
  };


  // PDF export ref
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Renumber all steps and substeps
  const renumberSteps = (steps: SOPStep[]): SOPStep[] => {
    return steps.map((step, stepIndex) => {
      const stepNumber = stepIndex + 1;
      const renumberedSubsteps = step.substeps?.map((substep, subIndex) => {
        const substepNumber = `${stepNumber}.${subIndex + 1}`;
        const renumberedChildren = substep.children?.map((child, childIndex) => ({
          ...child,
          id: `${substepNumber}.${childIndex + 1}`,
        }));
        return {
          ...substep,
          id: substepNumber,
          children: renumberedChildren,
        };
      });
      return {
        ...step,
        substeps: renumberedSubsteps,
      };
    });
  };

  // Handle step reorder
  const handleStepDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setEditableSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        return renumberSteps(reordered);
      });
      setHasUnsavedChanges(true);
    }
  };

  // Handle substep reorder within a step - preserve expanded state
  const handleSubstepDragEnd = (stepId: string, event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Preserve current expanded state before update
      const currentExpanded = { ...expandedSteps };
      
      setEditableSteps((steps) => {
        const updatedSteps = steps.map((step) => {
          if (step.id === stepId && step.substeps) {
            const oldIndex = step.substeps.findIndex((sub) => sub.id === active.id);
            const newIndex = step.substeps.findIndex((sub) => sub.id === over.id);
            return {
              ...step,
              substeps: arrayMove(step.substeps, oldIndex, newIndex),
            };
          }
          return step;
        });
        return renumberSteps(updatedSteps);
      });
      
      // Ensure step stays expanded after reorder
      setExpandedSteps(prev => ({
        ...prev,
        ...currentExpanded,
        [stepId]: true
      }));
      
      setHasUnsavedChanges(true);
    }
  };

  // Handle nested substep reorder
  const handleNestedDragEnd = (stepId: string, parentSubstepId: string, event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setEditableSteps((steps) => {
        const updatedSteps = steps.map((step) => {
          if (step.id === stepId) {
            return {
              ...step,
              substeps: step.substeps?.map((sub) => {
                if (sub.id === parentSubstepId && sub.children) {
                  const oldIndex = sub.children.findIndex((child) => child.id === active.id);
                  const newIndex = sub.children.findIndex((child) => child.id === over.id);
                  return {
                    ...sub,
                    children: arrayMove(sub.children, oldIndex, newIndex),
                  };
                }
                return sub;
              }),
            };
          }
          return step;
        });
        return renumberSteps(updatedSteps);
      });
      setHasUnsavedChanges(true);
    }
  };

  // Export to PDF
  const handleExportPDF = async () => {
    if (!pdfContentRef.current) return;

    setIsExporting(true);
    
    try {
      // Temporarily expand all steps for PDF
      const previousExpanded = { ...expandedSteps };
      const allExpanded: Record<string, boolean> = {};
      editableSteps.forEach((step) => {
        allExpanded[step.id] = true;
      });
      setExpandedSteps(allExpanded);

      // Wait for re-render
      await new Promise((resolve) => setTimeout(resolve, 300));

      const element = pdfContentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const totalPdfHeight = imgHeight * ratio;

      let heightLeft = totalPdfHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, totalPdfHeight);
      heightLeft -= pdfHeight;

      // Add more pages if needed
      while (heightLeft > 0) {
        position = heightLeft - totalPdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, totalPdfHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${currentSopData.code} - ${editableTitle}.pdf`);

      // Restore expanded state
      setExpandedSteps(previousExpanded);

      toast({
        title: language === "PT" ? "PDF exportado" : "PDF exported",
        description: language === "PT"
          ? "O documento foi exportado com sucesso."
          : "The document was exported successfully.",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: language === "PT" ? "Erro ao exportar" : "Export error",
        description: language === "PT"
          ? "Ocorreu um erro ao exportar o PDF."
          : "An error occurred while exporting the PDF.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const handleStepTitleChange = (stepId: string, newTitle: string) => {
    setEditableSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, title: newTitle } : step
    ));
    setHasUnsavedChanges(true);
  };

  const handleSubstepDescriptionChange = (stepId: string, substepId: string, newDescription: string) => {
    setEditableSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            substeps: step.substeps?.map(sub => 
              sub.id === substepId ? { ...sub, description: newDescription } : sub
            ) 
          } 
        : step
    ));
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (newTitle: string) => {
    setEditableTitle(newTitle);
    setHasUnsavedChanges(true);
  };

  const handleObjectiveChange = (newObjective: string) => {
    setEditableObjective(newObjective);
    setHasUnsavedChanges(true);
  };

  const handleMetadataChange = (field: keyof typeof editableMetadata, value: string) => {
    setEditableMetadata(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleAddStep = () => {
    const newStepNumber = editableSteps.length + 1;
    const newStep: SOPStep = {
      id: `new-${Date.now()}`,
      title: language === "PT" ? `Novo Passo ${newStepNumber}` : `New Step ${newStepNumber}`,
      substeps: [
        {
          id: `${newStepNumber}.1`,
          description: language === "PT" ? "Descreva o substep aqui..." : "Describe the substep here..."
        }
      ]
    };
    setEditableSteps(prev => [...prev, newStep]);
    setExpandedSteps(prev => ({ ...prev, [newStep.id]: true }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteStep = (stepId: string) => {
    setEditableSteps(prev => prev.filter(step => step.id !== stepId));
    setHasUnsavedChanges(true);
  };

  const handleAddSubstep = (stepId: string) => {
    setEditableSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        const currentSubsteps = step.substeps || [];
        const stepIndex = prev.findIndex(s => s.id === stepId) + 1;
        const newSubstepNumber = currentSubsteps.length + 1;
        const newSubstep: SOPSubstep = {
          id: `${stepIndex}.${newSubstepNumber}`,
          description: language === "PT" ? "Descreva o substep aqui..." : "Describe the substep here..."
        };
        return { ...step, substeps: [...currentSubsteps, newSubstep] };
      }
      return step;
    }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteSubstep = (stepId: string, substepId: string) => {
    setEditableSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          substeps: step.substeps?.filter(sub => sub.id !== substepId)
        };
      }
      return step;
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddNestedSubstep = (stepId: string, parentSubstepId: string) => {
    setEditableSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          substeps: step.substeps?.map(sub => {
            if (sub.id === parentSubstepId) {
              const currentChildren = sub.children || [];
              const newChildNumber = currentChildren.length + 1;
              const newChild: SOPSubstep = {
                id: `${parentSubstepId}.${newChildNumber}`,
                description: language === "PT" ? "Descreva o substep aqui..." : "Describe the substep here..."
              };
              return { ...sub, children: [...currentChildren, newChild] };
            }
            return sub;
          })
        };
      }
      return step;
    }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteNestedSubstep = (stepId: string, parentSubstepId: string, nestedSubstepId: string) => {
    setEditableSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          substeps: step.substeps?.map(sub => {
            if (sub.id === parentSubstepId) {
              return {
                ...sub,
                children: sub.children?.filter(child => child.id !== nestedSubstepId)
              };
            }
            return sub;
          })
        };
      }
      return step;
    }));
    setHasUnsavedChanges(true);
  };

  const handleNestedSubstepDescriptionChange = (stepId: string, parentSubstepId: string, nestedSubstepId: string, newDescription: string) => {
    setEditableSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          substeps: step.substeps?.map(sub => {
            if (sub.id === parentSubstepId) {
              return {
                ...sub,
                children: sub.children?.map(child => 
                  child.id === nestedSubstepId ? { ...child, description: newDescription } : child
                )
              };
            }
            return sub;
          })
        };
      }
      return step;
    }));
    setHasUnsavedChanges(true);
  };

  const handleImageChange = (stepId: string, substepId: string, newImage: string) => {
    setEditableSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            substeps: step.substeps?.map(sub => 
              sub.id === substepId ? { ...sub, image: newImage } : sub
            ) 
          } 
        : step
    ));
    setHasUnsavedChanges(true);
  };

  const handleSaveDraft = async () => {
    const existingDraft = versions.find(v => v.status === "Draft");
    
    if (!existingDraft) {
      const publishedVersion = versions.find(v => v.status === "Published");
      const newVersionNumber = publishedVersion 
        ? `v${parseFloat(publishedVersion.label.slice(1)) + 0.1}` 
        : "v1.1";
      
      const newDraft: Version = {
        id: `draft-${Date.now()}`,
        label: newVersionNumber,
        date: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }),
        status: "Draft",
      };
      
      setVersions(prev => [newDraft, ...prev]);
      setSelectedVersion(newDraft.id);
    }

    // Persist to database
    await upsertSOP(processId, {
      title: editableTitle,
      code: currentSopData.code,
      area: currentSopData.area,
      processId: editableProcessId,
      objective: editableObjective,
      metadata: {
        objective: editableObjective,
        soxControls: editableMetadata.soxControls,
        sla: editableMetadata.sla,
        frequency: editableMetadata.frequency,
        estimatedTime: editableMetadata.estimatedTime,
        volumetry: editableMetadata.volumetry,
        classification: editableMetadata.classification || undefined,
        kpis: editableMetadata.kpis,
        raci: {
          responsible: editableMetadata.responsible,
          approver: editableMetadata.approver,
        },
        systems: editableMetadata.systems.split(",").map(s => s.trim()).filter(Boolean),
        inputsOutputs: currentSopData.metadata?.inputsOutputs,
      },
      steps: editableSteps,

    });
    
    setHasUnsavedChanges(false);
    toast({
      title: language === "PT" ? "Rascunho salvo" : "Draft saved",
      description: language === "PT" 
        ? "Suas alterações foram salvas no banco de dados."
        : "Your changes have been saved to the database.",
    });
  };

  const handlePublish = () => {
    setShowPublishDialog(true);
  };

  const confirmPublish = () => {
    setVersions(prev => prev.map(v => {
      if (v.status === "Published") return { ...v, status: "Archived" as const };
      if (v.status === "Draft") return { 
        ...v, 
        status: "Published" as const,
        label: `v${Math.ceil(parseFloat(v.label.slice(1)))}.0`,
        date: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })
      };
      return v;
    }));
    
    setHasUnsavedChanges(false);
    toast({
      title: language === "PT" ? "Versão publicada" : "Version published",
      description: language === "PT"
        ? "A nova versão foi publicada com sucesso."
        : "The new version has been published successfully.",
    });
  };

  const currentVersion = versions.find(v => v.id === selectedVersion);
  const publishedVersion = versions.find(v => v.status === "Published");
  const draftVersion = versions.find(v => v.status === "Draft");

  const getStatusBadgeStyles = (status: string) => {
    if (status === "Published") return "bg-success text-success";
    if (status === "Draft") return "bg-warning text-warning";
    return "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    if (language === "PT") {
      if (status === "Published") return "Publicado";
      if (status === "Draft") return "Rascunho";
      if (status === "Archived") return "Arquivado";
    }
    return status;
  };

  // Calculate total substeps for progress
  const totalSubsteps = editableSteps.reduce((acc, step) => acc + (step.substeps?.length || 0), 0);

  if (!showEditor) {
    return <POPEmptyState onUpload={() => setShowEditor(true)} onGenerate={() => setShowEditor(true)} />;
  }

  return (
    <div className="fixed inset-0 top-[56px] left-[220px] flex animate-fade-in bg-surface-document z-10">
      {/* Outline + Versions Panel */}
      <SOPOutlinePanel
        steps={editableSteps}
        activeStepId={activeSection}
        onSelectStep={handleSelectSection}
        search={search}
        onSearchChange={setSearch}
        matches={searchMatches}
        onSelectSubstep={handleSelectSubstep}
        totalHits={totalHits}
        currentHit={currentHit}
        onNextHit={() => goToHit(1)}
        onPrevHit={() => goToHit(-1)}
        versionsSlot={
          <div className="flex flex-col h-full">
            <div className="space-y-2.5 flex-1">
              {versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => setSelectedVersion(version.id)}
                  className={cn(
                    "w-full text-left p-3.5 rounded-[10px] transition-all",
                    selectedVersion === version.id
                      ? "bg-card border-2 border-primary"
                      : "bg-card border border-border hover:border-muted-foreground/40"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "text-[14px]",
                      selectedVersion === version.id ? "font-semibold text-foreground" : "font-medium text-foreground"
                    )}>
                      {version.label}
                    </span>
                    {selectedVersion === version.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground mb-2">{version.date}</p>
                  <span className={cn(
                    "inline-flex text-[11px] font-medium px-2 py-0.5 rounded",
                    getStatusBadgeStyles(version.status)
                  )}>
                    {getStatusLabel(version.status)}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <button className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-primary transition-colors">
                <RefreshCw className="h-4 w-4" />
                {language === "PT" ? "Comparar versões" : "Compare versions"}
              </button>
            </div>
          </div>
        }
      />


      {/* Document Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Toolbar */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-8 py-3 flex items-center justify-between">
          {/* Left side - Toggle */}
          <div className="inline-flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setIsEditMode(false)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-[13px] transition-colors",
                !isEditMode 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="h-4 w-4" />
              {language === "PT" ? "Visualizar" : "View"}
            </button>
            <button
              onClick={() => setIsEditMode(true)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-[13px] transition-colors",
                isEditMode 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <Edit3 className="h-4 w-4" />
              {language === "PT" ? "Editar" : "Edit"}
            </button>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <a 
              href="/documents/SOP_IT_Prepaid_Amortization_Process_NA.docx"
              download="SOP_IT_Prepaid_Amortization_Process_NA.docx"
              className="flex items-center gap-2 px-3.5 py-2 border border-border rounded-lg text-[13px] text-foreground hover:bg-muted transition-colors no-underline"
              onClick={() => {
                toast({
                  title: language === "PT" ? "Download iniciado" : "Download started",
                  description: language === "PT" ? "O arquivo Word está sendo baixado." : "The Word file is being downloaded.",
                });
              }}
            >
              <Download className="h-4 w-4" />
              {language === "PT" ? "Baixar Word" : "Download Word"}
            </a>
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-3.5 py-2 border border-border rounded-lg text-[13px] text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {language === "PT" ? "Exportar PDF" : "Export PDF"}
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 border border-border rounded-lg text-[13px] text-foreground hover:bg-muted transition-colors">
              <Printer className="h-4 w-4" />
              {language === "PT" ? "Imprimir" : "Print"}
            </button>
            <button className="w-9 h-9 flex items-center justify-center border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Edit Toolbar - Only in Edit mode */}
        {isEditMode && (
          <div className="bg-card border-b border-border px-8 py-2.5 flex items-center gap-3">
            {/* Paragraph Dropdown */}
            <select className="text-[13px] px-2.5 py-1.5 bg-muted border-none rounded-md text-foreground">
              <option>{language === "PT" ? "Parágrafo" : "Paragraph"}</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
              <option>Heading 3</option>
            </select>
            
            <div className="w-px h-6 bg-border" />
            
            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Bold className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Italic className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Underline className="h-4 w-4" />
              </button>
            </div>
            
            <div className="w-px h-6 bg-border" />
            
            {/* Lists */}
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <List className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <ListOrdered className="h-4 w-4" />
              </button>
            </div>
            
            <div className="w-px h-6 bg-border" />
            
            {/* Insert */}
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Link className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Image className="h-4 w-4" />
              </button>
            </div>
            
            <div className="w-px h-6 bg-border" />
            
            {/* Add Step */}
            <button 
              onClick={handleAddStep}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-muted rounded-md text-[13px] text-foreground hover:bg-border transition-colors"
            >
              <Plus className="h-4 w-4" />
              {language === "PT" ? "Adicionar Etapa" : "Add Step"}
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Save/Publish */}
            {hasUnsavedChanges && (
              <span className="text-[12px] text-warning mr-2">
                {language === "PT" ? "Alterações não salvas" : "Unsaved changes"}
              </span>
            )}
            <button 
              onClick={handleSaveDraft}
              className="px-3.5 py-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {language === "PT" ? "Salvar Rascunho" : "Save Draft"}
            </button>
            <Button 
              variant="corporate" 
              size="sm" 
              className="h-8"
              onClick={handlePublish}
              disabled={!hasUnsavedChanges && !draftVersion}
            >
              {language === "PT" ? "Publicar" : "Publish"}
            </Button>
          </div>
        )}

        {/* Document Canvas */}
        <div ref={scrollRef} onScroll={handleScrollSpy} className="flex-1 p-8 flex justify-center items-start overflow-y-auto scroll-smooth">
          {/* Document Paper */}
          <div ref={pdfContentRef} className="w-full max-w-[1000px] bg-card rounded shadow-[0_4px_12px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] py-14 px-16">
            {/* Document Header */}
            <div ref={headerRef} className="mb-7 scroll-mt-6">
              {/* Badge Row */}
              <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                <span className="inline-flex px-3 py-1.5 bg-sidebar-accent text-primary text-[12px] font-semibold rounded-md">
                  {currentSopData.code}
                </span>
                {/* Process ID - editable */}
                {isEditMode ? (
                  <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-surface-subtle border border-border rounded-md">
                    <span className="text-[11px] uppercase tracking-[0.3px] text-muted-foreground">
                      {language === "PT" ? "ID do processo" : "Process ID"}
                    </span>
                    <Input
                      value={editableProcessId}
                      onChange={(e) => {
                        setEditableProcessId(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Ex: PRC-0001"
                      className="h-6 w-[130px] text-[12px] font-medium bg-card border border-border rounded px-2"
                    />
                  </span>
                ) : (
                  editableProcessId && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-subtle border border-border rounded-md text-[12px]">
                      <span className="text-[11px] uppercase tracking-[0.3px] text-muted-foreground">
                        {language === "PT" ? "ID" : "ID"}
                      </span>
                      <span className="font-medium text-foreground">{editableProcessId}</span>
                    </span>
                  )
                )}
                <span className="text-[13px] text-muted-foreground">{currentSopData.area}</span>
              </div>
              
              {/* Title */}
              {isEditMode ? (
                <Input
                  value={editableTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-[26px] font-semibold text-foreground border-none bg-transparent px-0 h-auto focus-visible:ring-1 focus-visible:ring-primary/30 mb-3.5"
                />
              ) : (

                <h1 className="text-[26px] font-semibold text-foreground mb-3.5">
                  {editableTitle}
                </h1>
              )}
              
              {/* Metadata Bar */}
              <div className="flex items-center gap-8 bg-surface-subtle rounded-lg px-4 py-3.5 mb-6">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.3px] text-muted-foreground">
                    {language === "PT" ? "VERSÃO" : "VERSION"}
                  </span>
                  <span className="text-[13px] font-medium text-foreground ml-1.5">{currentVersion?.label}</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.3px] text-muted-foreground">
                    {language === "PT" ? "ÚLTIMA ATUALIZAÇÃO" : "LAST UPDATE"}
                  </span>
                  <span className="text-[13px] font-medium text-foreground ml-1.5">{currentVersion?.date}</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.3px] text-muted-foreground">STATUS</span>
                  <span className={cn(
                    "text-[13px] font-medium ml-1.5",
                    currentVersion?.status === "Published" ? "text-success" : 
                    currentVersion?.status === "Draft" ? "text-warning" : "text-foreground"
                  )}>
                    {currentVersion ? getStatusLabel(currentVersion.status) : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* ==================== INFORMATION SECTION ==================== */}
            {currentSopData.metadata && (
              <div className="bg-[#F9F9F9] rounded-xl p-6 mb-8">
                {/* All items stacked vertically */}
                <div className="space-y-4">
                  {/* Objetivo */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[#272727] mb-1">
                        {language === "PT" ? "Objetivo" : "Objective"}
                      </h4>
                      {isEditMode ? (
                        <Textarea
                          value={editableObjective}
                          onChange={(e) => handleObjectiveChange(e.target.value)}
                          className="text-[14px] text-[#6B7280] leading-relaxed bg-white border border-border rounded-md p-2 min-h-[60px] w-full"
                        />
                      ) : (
                        <p className="text-[14px] text-[#6B7280] leading-relaxed">
                          {editableObjective}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Controles SoX e Políticas */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[#272727] mb-1">
                        {language === "PT" ? "Controles SoX e Políticas" : "SoX Controls & Policies"}
                      </h4>
                      {isEditMode ? (
                        <Textarea
                          value={editableMetadata.soxControls}
                          onChange={(e) => handleMetadataChange("soxControls", e.target.value)}
                          placeholder={language === "PT" ? "Descreva os controles SoX..." : "Describe SoX controls..."}
                          className="text-[14px] text-[#6B7280] leading-relaxed bg-white border border-border rounded-md p-2 min-h-[60px] w-full"
                        />
                      ) : (
                        <p className="text-[14px] text-[#6B7280] leading-relaxed">
                          {editableMetadata.soxControls || (language === "PT" ? "Não definido" : "Not defined")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SLA */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[#272727] mb-1">SLA</h4>
                      {isEditMode ? (
                        <Input
                          value={editableMetadata.sla}
                          onChange={(e) => handleMetadataChange("sla", e.target.value)}
                          placeholder={language === "PT" ? "Ex: 24 horas" : "Ex: 24 hours"}
                          className="text-[14px] text-[#6B7280] bg-white border border-border rounded-md"
                        />
                      ) : (
                        <p className="text-[14px] text-[#6B7280] leading-relaxed">
                          {editableMetadata.sla || (language === "PT" ? "Não definido" : "Not defined")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Frequência e Tempo */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[#272727] mb-1">
                        {language === "PT" ? "Frequência e Tempo" : "Frequency & Time"}
                      </h4>
                      {isEditMode ? (
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-[12px] text-muted-foreground mb-1 block">
                              {language === "PT" ? "Frequência" : "Frequency"}
                            </label>
                            <Input
                              value={editableMetadata.frequency}
                              onChange={(e) => handleMetadataChange("frequency", e.target.value)}
                              placeholder={language === "PT" ? "Ex: Semanal" : "Ex: Weekly"}
                              className="text-[14px] text-[#6B7280] bg-white border border-border rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-[12px] text-muted-foreground mb-1 block">
                              {language === "PT" ? "Tempo Estimado" : "Estimated Time"}
                            </label>
                            <Input
                              value={editableMetadata.estimatedTime}
                              onChange={(e) => handleMetadataChange("estimatedTime", e.target.value)}
                              placeholder={language === "PT" ? "Ex: 15-20 min" : "Ex: 15-20 min"}
                              className="text-[14px] text-[#6B7280] bg-white border border-border rounded-md"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-[14px] text-[#6B7280]">
                          {language === "PT" ? "Frequência" : "Frequency"}: {editableMetadata.frequency || "-"} | {language === "PT" ? "Tempo Estimado" : "Estimated Time"}: {editableMetadata.estimatedTime || "-"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Volumetria */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Repeat className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[#272727] mb-1">
                        {language === "PT" ? "Volumetria" : "Volumetry"}
                      </h4>
                      {isEditMode ? (
                        <>
                          <Input
                            value={editableMetadata.volumetry}
                            onChange={(e) => handleMetadataChange("volumetry", e.target.value)}
                            placeholder={language === "PT" ? "Ex: 3x ao mês / 12x ao dia" : "Ex: 3x per month / 12x per day"}
                            className="text-[14px] text-[#6B7280] bg-white border border-border rounded-md"
                          />
                          <p className="text-[12px] text-muted-foreground mt-1">
                            {language === "PT"
                              ? "Quantas vezes o processo roda dentro da frequência definida."
                              : "How many times the process runs within the defined frequency."}
                          </p>
                        </>
                      ) : (
                        <p className="text-[14px] text-[#6B7280] leading-relaxed">
                          {editableMetadata.volumetry || (language === "PT" ? "Não definido" : "Not defined")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Classificação do processo */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Layers className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[#272727] mb-1">
                        {language === "PT" ? "Classificação do Processo" : "Process Classification"}
                      </h4>
                      {isEditMode ? (
                        <div className="flex gap-2">
                          {PROCESS_CLASSES.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleMetadataChange("classification", opt.value)}
                              className={cn(
                                "px-3 py-1.5 rounded-md text-[13px] font-medium border transition-colors",
                                editableMetadata.classification === opt.value
                                  ? "bg-sidebar-accent border-primary text-primary"
                                  : "bg-white border-border text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {language === "PT" ? opt.pt : opt.en}
                            </button>
                          ))}
                        </div>
                      ) : editableMetadata.classification ? (
                        <span className={cn(
                          "inline-flex px-2.5 py-1 rounded text-[12px] font-medium",
                          PROCESS_CLASS_STYLES[editableMetadata.classification]
                        )}>
                          {language === "PT"
                            ? PROCESS_CLASSES.find(o => o.value === editableMetadata.classification)?.pt
                            : PROCESS_CLASSES.find(o => o.value === editableMetadata.classification)?.en}
                        </span>
                      ) : (
                        <p className="text-[14px] text-[#6B7280]">
                          {language === "PT" ? "Não definido" : "Not defined"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[#272727] mb-1">
                        {language === "PT" ? "KPIs Vinculados" : "Linked KPIs"}
                      </h4>
                      {isEditMode ? (
                        <Textarea
                          value={editableMetadata.kpis}
                          onChange={(e) => handleMetadataChange("kpis", e.target.value)}
                          placeholder={language === "PT" ? "Ex: SLA de atendimento; % de retrabalho (separe por ;)" : "Ex: Service SLA; % rework (separate with ;)"}
                          className="text-[14px] text-[#6B7280] leading-relaxed bg-white border border-border rounded-md p-2 min-h-[56px] w-full"
                        />
                      ) : editableMetadata.kpis ? (
                        <div className="flex flex-wrap gap-1.5">
                          {editableMetadata.kpis.split(/[;\n]/).map(k => k.trim()).filter(Boolean).map((kpi, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-card border border-border text-[12px] text-[#272727]">
                              {kpi}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[14px] text-[#6B7280]">
                          {language === "PT" ? "Não definido" : "Not defined"}
                        </p>
                      )}
                    </div>
                  </div>



                  {/* RACI */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[#272727] mb-1">
                        {language === "PT" ? "Responsabilidades (RACI)" : "Responsibilities (RACI)"}
                      </h4>
                      {isEditMode ? (
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-[12px] text-muted-foreground mb-1 block">
                              {language === "PT" ? "Responsável" : "Responsible"}
                            </label>
                            <Input
                              value={editableMetadata.responsible}
                              onChange={(e) => handleMetadataChange("responsible", e.target.value)}
                              placeholder={language === "PT" ? "Ex: Analista" : "Ex: Analyst"}
                              className="text-[14px] text-[#6B7280] bg-white border border-border rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-[12px] text-muted-foreground mb-1 block">
                              {language === "PT" ? "Aprovador" : "Approver"}
                            </label>
                            <Input
                              value={editableMetadata.approver}
                              onChange={(e) => handleMetadataChange("approver", e.target.value)}
                              placeholder={language === "PT" ? "Ex: Gerente" : "Ex: Manager"}
                              className="text-[14px] text-[#6B7280] bg-white border border-border rounded-md"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-[14px] text-[#6B7280] space-y-0.5">
                          <p><span className="font-medium">{language === "PT" ? "Responsável" : "Responsible"}:</span> {editableMetadata.responsible || "-"}</p>
                          <p><span className="font-medium">{language === "PT" ? "Aprovador" : "Approver"}:</span> {editableMetadata.approver || "-"}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sistemas */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Monitor className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[#272727] mb-1">
                        {language === "PT" ? "Sistemas" : "Systems"}
                      </h4>
                      {isEditMode ? (
                        <Input
                          value={editableMetadata.systems}
                          onChange={(e) => handleMetadataChange("systems", e.target.value)}
                          placeholder={language === "PT" ? "Ex: SAP, ServiceNow (separados por vírgula)" : "Ex: SAP, ServiceNow (comma separated)"}
                          className="text-[14px] text-[#6B7280] bg-white border border-border rounded-md"
                        />
                      ) : (
                        <p className="text-[14px] text-[#6B7280]">
                          {editableMetadata.systems || (language === "PT" ? "Não definido" : "Not defined")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inputs/Outputs Section */}
                {currentSopData.metadata.inputsOutputs && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <h4 className="text-[14px] font-semibold text-[#272727] mb-4">
                      {language === "PT" ? "Entradas e Saídas" : "Inputs & Outputs"}
                    </h4>
                    
                    <div className="bg-card rounded-lg border border-border overflow-hidden">
                      {/* Table Header */}
                      <div className="grid grid-cols-3 bg-[#F3F4F6] border-b border-border">
                        <div className="px-4 py-2.5 text-[12px] font-semibold text-[#272727] uppercase tracking-wide">
                          {language === "PT" ? "Tipo" : "Type"}
                        </div>
                        <div className="px-4 py-2.5 text-[12px] font-semibold text-[#272727] uppercase tracking-wide">
                          {language === "PT" ? "Descrição" : "Description"}
                        </div>
                        <div className="px-4 py-2.5 text-[12px] font-semibold text-[#272727] uppercase tracking-wide">
                          {language === "PT" ? "Fonte" : "Source"}
                        </div>
                      </div>
                      
                      {/* Input Rows */}
                      {currentSopData.metadata.inputsOutputs.inputs.map((input, idx) => (
                        <div key={`input-${idx}`} className="grid grid-cols-3 border-b border-border last:border-b-0">
                          <div className="px-4 py-3 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary text-[12px] font-medium rounded">
                              <ArrowRight className="h-3 w-3" />
                              Input
                            </span>
                          </div>
                          <div className="px-4 py-3 text-[14px] text-[#272727]">
                            {input.description}
                          </div>
                          <div className="px-4 py-3 text-[14px] text-[#6B7280]">
                            {input.source}
                          </div>
                        </div>
                      ))}
                      
                      {/* Output Rows */}
                      {currentSopData.metadata.inputsOutputs.outputs.map((output, idx) => (
                        <div key={`output-${idx}`} className="grid grid-cols-3 border-b border-border last:border-b-0">
                          <div className="px-4 py-3 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-success/10 text-success text-[12px] font-medium rounded">
                              <ArrowLeft className="h-3 w-3" />
                              Output
                            </span>
                          </div>
                          <div className="px-4 py-3 text-[14px] text-[#272727]">
                            {output.description}
                          </div>
                          <div className="px-4 py-3 text-[14px] text-[#6B7280]">
                            {output.source}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-border mb-8" />
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
                {language === "PT" ? "PROCEDIMENTO" : "PROCEDURE"}
              </h2>
              <span className="text-[12px] text-muted-foreground">
                {editableSteps.length} {language === "PT" ? "etapas" : "steps"} • {totalSubsteps} {language === "PT" ? "substeps" : "substeps"}
              </span>
            </div>

            {/* ==================== STEPS WITH HIERARCHY ==================== */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleStepDragEnd}
            >
              <SortableContext
                items={editableSteps.map((step) => step.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-6">
                  {editableSteps.map((step, stepIndex) => (
                    <SortableStep key={step.id} id={step.id} isEditMode={isEditMode}>
                      <div
                        ref={(el) => { stepRefs.current[step.id] = el; }}
                        data-step-id={step.id}
                        className="scroll-mt-6"
                      >
                      <Collapsible 
                        open={expandedSteps[step.id]} 
                        onOpenChange={() => toggleStep(step.id)}
                      >
                        <div className={cn(
                          "bg-card border rounded-xl overflow-hidden transition-colors",
                          activeSection === step.id ? "border-primary/60" : "border-border"
                        )}>
                    {/* Step Header with Blue Left Border */}
                    <div className="border-l-4 border-l-primary">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors group">
                          {/* Step Number Badge */}
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[16px] font-semibold shrink-0">
                            {stepIndex + 1}
                          </div>
                          
                          {/* Step Title */}
                          <div className="flex-1 text-left">
                            {isEditMode ? (
                              <Input
                                value={step.title}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleStepTitleChange(step.id, e.target.value);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[18px] font-semibold text-foreground border-none bg-transparent px-0 h-auto focus-visible:ring-1 focus-visible:ring-primary/30"
                              />
                            ) : (
                              <h3 className="text-[18px] font-semibold text-[#272727]">{step.title}</h3>
                            )}
                            {!isEditMode && (
                              <StepMicroAttributes step={step} isEditMode={false} onChange={() => {}} />
                            )}
                          </div>


                          {/* Expand/Collapse Icon */}
                          <div className="flex items-center gap-2">
                            {isEditMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStep(step.id);
                                }}
                                className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                title={language === "PT" ? "Remover etapa" : "Remove step"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                            {expandedSteps[step.id] ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      {/* Substeps Content */}
                      <CollapsibleContent>
                        <div className="px-4 pb-4 pl-[72px] space-y-4">
                          {isEditMode && (
                            <StepMicroAttributes
                              step={step}
                              isEditMode
                              onChange={(field, value) => handleStepFieldChange(step.id, field, value)}
                            />
                          )}

                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(event) => handleSubstepDragEnd(step.id, event)}
                          >
                            <SortableContext
                              items={step.substeps?.map((sub) => sub.id) || []}
                              strategy={verticalListSortingStrategy}
                            >
                              {step.substeps?.map((substep) => (
                                <SortableSubstep key={substep.id} id={substep.id} isEditMode={isEditMode}>
                                  <div 
                                    data-substep-id={substep.id}
                                    className={cn(
                                      "rounded-lg p-4 group/substep pl-8 scroll-mt-6",
                                      substep.isConditional 
                                        ? "bg-[#FEF3C7] border-l-[3px] border-l-[#F59E0B]" 
                                        : "bg-surface-subtle"
                                    )}
                                  >
                              {/* Substep Header */}
                              <div className="flex items-start gap-3">
                                {/* Substep Number Tag */}
                                <span className={cn(
                                  "inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium shrink-0",
                                  substep.isConditional 
                                    ? "bg-[#F59E0B]/20 text-[#92400E]" 
                                    : "bg-[#E5E7EB] text-[#6B7280]"
                                )}>
                                  {substep.isConditional && (
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                  )}
                                  {substep.id}
                                </span>

                                {/* Substep Content */}
                                <div className="flex-1">
                                  {substep.isConditional && substep.conditionalText && (
                                    <span className="text-[12px] font-medium text-[#92400E] block mb-1">
                                      {language === "PT" ? "Condicional" : "Conditional"}: {substep.conditionalText}
                                    </span>
                                  )}
                                  
                                  {isEditMode ? (
                                    <Textarea
                                      value={substep.description}
                                      onChange={(e) => handleSubstepDescriptionChange(step.id, substep.id, e.target.value)}
                                      className="text-[14px] text-[#272727] leading-relaxed border-none bg-transparent px-0 resize-none focus-visible:ring-1 focus-visible:ring-primary/30 min-h-fit"
                                      rows={Math.max(2, substep.description.split('\n').length)}
                                    />
                                  ) : (
                                    <p className="text-[14px] text-[#272727] leading-relaxed whitespace-pre-line">
                                      {substep.description}
                                    </p>
                                  )}

                                  {/* Substep Image */}
                                  {substep.image && (
                                    <div className="mt-4">
                                      {isEditMode ? (
                                        <>
                                          {(annotationsMap[`${step.id}-${substep.id}`]?.length > 0) ? (
                                            <div 
                                              className="relative group"
                                              onMouseEnter={() => {}}
                                              onMouseLeave={() => {}}
                                            >
                                              <AnnotatedImage
                                                imageSrc={substep.image}
                                                annotations={annotationsMap[`${step.id}-${substep.id}`] || []}
                                                className="max-w-[600px]"
                                              />
                                              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                  onClick={() => {
                                                    // Open alternatives - need ImageAlternatives dialog
                                                  }}
                                                  className="flex items-center gap-2 px-4 py-2.5 bg-white/95 hover:bg-white text-foreground rounded-lg shadow-lg transition-all hover:scale-105"
                                                >
                                                  <Image className="h-4 w-4" />
                                                  <span className="text-sm font-medium">
                                                    {language === "PT" ? "Alternativas" : "Alternatives"}
                                                  </span>
                                                </button>
                                                <button
                                                  onClick={() => setAnnotatingSubstep({ stepId: step.id, substepId: substep.id, imageSrc: substep.image! })}
                                                  className="flex items-center gap-2 px-4 py-2.5 bg-white/95 hover:bg-white text-foreground rounded-lg shadow-lg transition-all hover:scale-105"
                                                >
                                                  <Edit3 className="h-4 w-4" />
                                                  <span className="text-sm font-medium">
                                                    {language === "PT" ? "Editar" : "Edit"}
                                                  </span>
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <ImageAlternatives
                                              currentImage={substep.image}
                                              stepId={substep.id}
                                              processId={processId}
                                              onImageSelect={(id, newImage) => handleImageChange(step.id, id, newImage)}
                                              onAnnotate={() => setAnnotatingSubstep({ stepId: step.id, substepId: substep.id, imageSrc: substep.image! })}
                                            />
                                          )}
                                        </>
                                      ) : (
                                        <AnnotatedImage
                                          imageSrc={substep.image}
                                          annotations={annotationsMap[`${step.id}-${substep.id}`] || []}
                                          className="max-w-[600px]"
                                        />
                                      )}
                                    </div>
                                  )}

                                  {/* Nested Substeps */}
                                  {substep.children && substep.children.length > 0 && (
                                    <div className="mt-4 ml-4 space-y-3 border-l-2 border-border pl-4">
                                      {substep.children.map((nestedSubstep) => (
                                        <div 
                                          key={nestedSubstep.id} 
                                          className="bg-card rounded-lg p-3 group/nested"
                                        >
                                          <div className="flex items-start gap-2">
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-primary/10 text-primary shrink-0">
                                              {nestedSubstep.id}
                                            </span>
                                            <div className="flex-1">
                                              {isEditMode ? (
                                                <Textarea
                                                  value={nestedSubstep.description}
                                                  onChange={(e) => handleNestedSubstepDescriptionChange(step.id, substep.id, nestedSubstep.id, e.target.value)}
                                                  className="text-[13px] text-[#272727] leading-relaxed border-none bg-transparent px-0 resize-none focus-visible:ring-1 focus-visible:ring-primary/30 min-h-fit"
                                                  rows={Math.max(1, nestedSubstep.description.split('\n').length)}
                                                />
                                              ) : (
                                                <p className="text-[13px] text-[#272727] leading-relaxed whitespace-pre-line">
                                                  {nestedSubstep.description}
                                                </p>
                                              )}
                                            </div>
                                            {isEditMode && (
                                              <button
                                                onClick={() => handleDeleteNestedSubstep(step.id, substep.id, nestedSubstep.id)}
                                                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover/nested:opacity-100"
                                                title={language === "PT" ? "Remover" : "Remove"}
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Add Nested Substep Button */}
                                  {isEditMode && (
                                    <button
                                      onClick={() => handleAddNestedSubstep(step.id, substep.id)}
                                      className="mt-3 flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      <Plus className="h-3 w-3" />
                                      {language === "PT" ? "Adicionar sub-substep" : "Add nested substep"}
                                    </button>
                                  )}
                                </div>

                                {/* Delete Substep Button */}
                                {isEditMode && (
                                  <button
                                    onClick={() => handleDeleteSubstep(step.id, substep.id)}
                                    className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover/substep:opacity-100"
                                    title={language === "PT" ? "Remover substep" : "Remove substep"}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </SortableSubstep>
                        ))}
                      </SortableContext>
                    </DndContext>

                    {/* Add Substep Button */}
                    {isEditMode && (
                      <button
                        onClick={() => handleAddSubstep(step.id)}
                        className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-2 text-[13px]"
                      >
                        <Plus className="h-4 w-4" />
                        {language === "PT" ? "Adicionar Substep" : "Add Substep"}
                      </button>
                    )}
                  </div>
                </CollapsibleContent>
                    </div>
                  </div>
                      </Collapsible>
                      </div>
                    </SortableStep>

                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Add Step Button - Only in edit mode */}
            {isEditMode && (
              <button
                onClick={handleAddStep}
                className="w-full mt-6 py-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {language === "PT" ? "Adicionar Etapa" : "Add Step"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image Annotator Dialog */}
      {annotatingSubstep && (
        <ImageAnnotator
          imageSrc={annotatingSubstep.imageSrc}
          annotations={annotationsMap[`${annotatingSubstep.stepId}-${annotatingSubstep.substepId}`] || []}
          isOpen={true}
          onClose={() => setAnnotatingSubstep(null)}
          onAnnotationsChange={(anns) => {
            setAnnotationsMap(prev => ({
              ...prev,
              [`${annotatingSubstep.stepId}-${annotatingSubstep.substepId}`]: anns,
            }));
            setHasUnsavedChanges(true);
          }}
        />
      )}

      {/* Publish Confirmation Dialog */}
      <PublishDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        onConfirm={confirmPublish}
        currentVersion={publishedVersion?.label || "v1.0"}
        newVersion={draftVersion?.label || `v${parseFloat(publishedVersion?.label.slice(1) || "1") + 1}.0`}
      />
    </div>
  );
}

function POPEmptyState({ onUpload, onGenerate }: { onUpload: () => void; onGenerate: () => void }) {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-lg mx-auto py-20 animate-fade-in">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-sidebar-accent flex items-center justify-center mx-auto mb-4">
          <FileText className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-medium text-foreground mb-2">{t.noDocument}</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {t.noDocumentDescription}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onUpload}
          className="group bg-card rounded-2xl border border-border p-6 text-left hover:border-primary/40 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-sidebar-accent transition-colors">
            <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-medium text-foreground mb-1">{t.uploadDocument}</h3>
          <p className="text-sm text-muted-foreground">
            {t.uploadExistingPop}
          </p>
        </button>

        <button
          onClick={onGenerate}
          className="group bg-card rounded-2xl border border-border p-6 text-left hover:border-primary/40 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-sidebar-accent transition-colors">
            <Sparkles className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-medium text-foreground mb-1">
            {language === "PT" ? "Gerar POP" : "Generate SOP"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t.generatePopDescription}
          </p>
        </button>
      </div>
    </div>
  );
}
