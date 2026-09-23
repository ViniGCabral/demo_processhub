import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useProcessConnectionStore,
  ProcessConnection,
  ProcessConnectionType,
  RELATIONSHIP_LABELS,
} from "@/stores/processConnectionStore";
import { mockArchitectureData } from "@/data/architectureContextMock";
import { useProcessStore } from "@/stores/processStore";
import { Link2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface CreateEditConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProcessId: string;
  currentProcessName: string;
  currentDomain?: string;
  defaultDirection?: "predecessor" | "successor";
  editingConnection?: ProcessConnection | null;
}

export function CreateEditConnectionModal({
  open,
  onOpenChange,
  currentProcessId,
  currentProcessName,
  currentDomain = "Arquitetura",
  defaultDirection = "predecessor",
  editingConnection,
}: CreateEditConnectionModalProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const { addConnection, updateConnection, connections } =
    useProcessConnectionStore();
  const storeProcesses = useProcessStore((s) => s.processes);

  // Consolidação de todos os processos do sistema para seleção
  const availableProcesses = useMemo(() => {
    const list: Array<{ id: string; name: string; domain: string }> = [];
    const seen = new Set<string>();

    // Processos do mock de arquitetura
    mockArchitectureData.domainsL1.forEach((d) => {
      d.childrenL2.forEach((l2) => {
        l2.childrenL3.forEach((l3) => {
          l3.childrenL4.forEach((l4) => {
            l4.processes.forEach((p) => {
              if (p.id !== currentProcessId && !seen.has(p.id)) {
                seen.add(p.id);
                list.push({ id: p.id, name: p.name, domain: d.name });
              }
            });
          });
        });
      });
    });

    // Processos do store de processos
    storeProcesses.forEach((p) => {
      if (p.id !== currentProcessId && !seen.has(p.id)) {
        seen.add(p.id);
        list.push({
          id: p.id,
          name: p.name,
          domain: p.area || p.l1 || "Geral",
        });
      }
    });

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [currentProcessId, storeProcesses]);

  // Form State
  const [direction, setDirection] = useState<"predecessor" | "successor">(
    defaultDirection
  );
  const [relatedProcessId, setRelatedProcessId] = useState<string>("");
  const [relationshipType, setRelationshipType] =
    useState<ProcessConnectionType>("fornece_insumo_para");
  const [description, setDescription] = useState("");
  const [transferredObject, setTransferredObject] = useState("");
  const [relatedSystem, setRelatedSystem] = useState("");
  const [validationStatus, setValidationStatus] = useState<"validada" | "pendente">(
    "validada"
  );
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (editingConnection) {
      const isPredecessor =
        editingConnection.targetProcessId === currentProcessId ||
        editingConnection.targetProcessName.toLowerCase() ===
          currentProcessName.toLowerCase();

      setDirection(isPredecessor ? "predecessor" : "successor");
      setRelatedProcessId(
        isPredecessor
          ? editingConnection.sourceProcessId
          : editingConnection.targetProcessId
      );
      setRelationshipType(editingConnection.relationshipType);
      setDescription(editingConnection.description || "");
      setTransferredObject(editingConnection.transferredObject || "");
      setRelatedSystem(editingConnection.relatedSystem || "");
      setValidationStatus(editingConnection.validationStatus);
      setNotes(editingConnection.notes || "");
    } else {
      setDirection(defaultDirection);
      setRelatedProcessId(availableProcesses[0]?.id || "");
      setRelationshipType(
        defaultDirection === "predecessor"
          ? "fornece_insumo_para"
          : "fornece_insumo_para"
      );
      setDescription("");
      setTransferredObject("");
      setRelatedSystem("");
      setValidationStatus("validada");
      setNotes("");
    }
  }, [
    editingConnection,
    open,
    currentProcessId,
    currentProcessName,
    defaultDirection,
    availableProcesses,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!relatedProcessId) {
      toast.error(
        pt
          ? "Selecione o processo relacionado"
          : "Please select related process"
      );
      return;
    }

    if (!description.trim()) {
      toast.error(
        pt
          ? "Informe uma descrição para a relação"
          : "Please describe this relationship"
      );
      return;
    }

    const relatedProcess = availableProcesses.find(
      (p) => p.id === relatedProcessId
    );
    const relatedName = relatedProcess?.name || "Processo Relacionado";
    const relatedDomain = relatedProcess?.domain || "Domínio";

    let sourceId = "";
    let sourceName = "";
    let sourceDomain = "";
    let targetId = "";
    let targetName = "";
    let targetDomain = "";

    if (direction === "predecessor") {
      // Predecessor é a origem (source) e o processo atual é o destino (target)
      sourceId = relatedProcessId;
      sourceName = relatedName;
      sourceDomain = relatedDomain;
      targetId = currentProcessId;
      targetName = currentProcessName;
      targetDomain = currentDomain;
    } else {
      // O processo atual é a origem (source) e o sucessor é o destino (target)
      sourceId = currentProcessId;
      sourceName = currentProcessName;
      sourceDomain = currentDomain;
      targetId = relatedProcessId;
      targetName = relatedName;
      targetDomain = relatedDomain;
    }

    try {
      if (editingConnection) {
        updateConnection(editingConnection.id, {
          sourceProcessId: sourceId,
          sourceProcessName: sourceName,
          sourceDomain,
          targetProcessId: targetId,
          targetProcessName: targetName,
          targetDomain,
          relationshipType,
          description: description.trim(),
          transferredObject: transferredObject.trim() || undefined,
          relatedSystem: relatedSystem.trim() || undefined,
          validationStatus,
          notes: notes.trim() || undefined,
        });
        toast.success(
          pt ? "Conexão atualizada com sucesso!" : "Connection updated successfully!"
        );
      } else {
        addConnection({
          sourceProcessId: sourceId,
          sourceProcessName: sourceName,
          sourceDomain,
          targetProcessId: targetId,
          targetProcessName: targetName,
          targetDomain,
          relationshipType,
          description: description.trim(),
          transferredObject: transferredObject.trim() || undefined,
          relatedSystem: relatedSystem.trim() || undefined,
          validationStatus,
          notes: notes.trim() || undefined,
          createdBy: "Analista de Processos",
        });
        toast.success(
          pt ? "Conexão cadastrada com sucesso!" : "Connection created successfully!"
        );
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || (pt ? "Erro ao salvar conexão" : "Error saving connection"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#272727] flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#0C1BA8]" />
            {editingConnection
              ? pt
                ? "Editar Conexão de Processo"
                : "Edit Process Connection"
              : pt
              ? "Nova Conexão entre Processos"
              : "New Process Connection"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* Seletor de Direção da Conexão */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#272727]">
              {pt ? "Direção da Relação *" : "Relationship Direction *"}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection("predecessor")}
                className={`p-2.5 rounded-md border text-left flex items-center gap-2 transition-colors ${
                  direction === "predecessor"
                    ? "bg-[#0C1BA8]/5 border-[#0C1BA8] text-[#0C1BA8] font-bold"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <div>
                  <span className="block text-xs">
                    {pt ? "Predecessor" : "Predecessor"}
                  </span>
                  <span className="text-[10px] opacity-75 block font-normal">
                    {pt ? "Ocorre antes / fornece" : "Occurs before / supplies"}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDirection("successor")}
                className={`p-2.5 rounded-md border text-left flex items-center gap-2 transition-colors ${
                  direction === "successor"
                    ? "bg-[#0C1BA8]/5 border-[#0C1BA8] text-[#0C1BA8] font-bold"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ArrowRight className="w-4 h-4 shrink-0" />
                <div>
                  <span className="block text-xs">
                    {pt ? "Sucessor" : "Successor"}
                  </span>
                  <span className="text-[10px] opacity-75 block font-normal">
                    {pt ? "Ocorre depois / consome" : "Occurs after / consumes"}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Processo Relacionado */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#272727]">
              {direction === "predecessor"
                ? pt
                  ? "Processo Predecessor (Origem) *"
                  : "Predecessor Process (Source) *"
                : pt
                ? "Processo Sucessor (Destino) *"
                : "Successor Process (Target) *"}
            </Label>
            <Select
              value={relatedProcessId}
              onValueChange={setRelatedProcessId}
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue
                  placeholder={
                    pt ? "Selecione o processo..." : "Select process..."
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {availableProcesses.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    <span className="font-semibold text-[#272727]">{p.name}</span>{" "}
                    <span className="text-[10px] text-[#A5A7B0]">
                      ({p.domain})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Relação */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#272727]">
              {pt ? "Tipo de Relação *" : "Relationship Type *"}
            </Label>
            <Select
              value={relationshipType}
              onValueChange={(v) =>
                setRelationshipType(v as ProcessConnectionType)
              }
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-xs">
                    {pt ? label.pt : label.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descrição Curta */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#272727]">
              {pt ? "Descrição da Relação *" : "Description *"}
            </Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                pt
                  ? "Ex: Entrega os requisitos comerciais para análise de margem"
                  : "e.g., Hands off requirements for margin evaluation"
              }
              className="text-xs"
              required
            />
          </div>

          {/* Objeto de Dados e Sistema Envolvido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                {pt ? "Dado ou Objeto Transferido (Opcional)" : "Transferred Data/Object"}
              </Label>
              <Input
                value={transferredObject}
                onChange={(e) => setTransferredObject(e.target.value)}
                placeholder={pt ? "Ex: Minuta de Contrato, PO" : "e.g., Draft PO, Contract"}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                {pt ? "Sistema Envolvido (Opcional)" : "Related System"}
              </Label>
              <Input
                value={relatedSystem}
                onChange={(e) => setRelatedSystem(e.target.value)}
                placeholder={pt ? "Ex: CRM Salesforce, SAP" : "e.g., Salesforce, SAP"}
                className="text-xs"
              />
            </div>
          </div>

          {/* Status de Validação */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#272727]">
              {pt ? "Status de Validação *" : "Validation Status *"}
            </Label>
            <Select
              value={validationStatus}
              onValueChange={(v) =>
                setValidationStatus(v as "validada" | "pendente")
              }
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="validada">
                  {pt ? "Validada (Confirmada tecnicamente)" : "Validated"}
                </SelectItem>
                <SelectItem value="pendente">
                  {pt ? "Pendente (Aguardando confirmação)" : "Pending"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              {pt ? "Observações Adicionais (Opcional)" : "Additional Notes"}
            </Label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                pt
                  ? "Informações operacionais, regras de handoff..."
                  : "Operational rules or handoff context..."
              }
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              {pt ? "Cancelar" : "Cancel"}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#0C1BA8] hover:bg-[#04223D] text-white"
            >
              {editingConnection
                ? pt
                  ? "Salvar Alterações"
                  : "Save Changes"
                : pt
                ? "Cadastrar Conexão"
                : "Create Connection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
