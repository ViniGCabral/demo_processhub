import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Plus, Trash2, RotateCcw, X, TableProperties, 
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  useRaciStore, RaciRole, RaciCell, RaciRow 
} from '@/stores/raciStore';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface RaciMatrixModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string;
  nodeTitle: string;
  stageName?: string;
  breadcrumbPath?: string;
  fallbackProcedures?: { id: string; name: string; description?: string }[];
}

export function RaciMatrixModal({
  open,
  onOpenChange,
  nodeId,
  nodeTitle,
  stageName = 'Conceituação',
  breadcrumbPath = 'Gestão da Inovação de Produtos › Funil de Produtos › Conceituação e Briefing',
  fallbackProcedures = []
}: RaciMatrixModalProps) {
  const { language } = useLanguage();
  const pt = language === 'PT';

  const {
    updateCellRoles,
    addArea,
    removeArea,
    addRow,
    resetToDefault
  } = useRaciStore();

  // Obter dados da matriz (persistidos ou inicializados)
  const matrix = useRaciStore((state) => 
    state.matrices[nodeId] || state.getMatrix(nodeId, nodeTitle, fallbackProcedures)
  );

  // Estados locais para adição de nova área e procedimento
  const [newAreaName, setNewAreaName] = useState('');
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);

  const handleAddArea = () => {
    if (!newAreaName.trim()) {
      toast.error(pt ? 'Digite o nome da área' : 'Enter area name');
      return;
    }
    addArea(nodeId, newAreaName.trim());
    toast.success(pt ? `Área "${newAreaName.trim()}" adicionada` : `Area added`);
    setNewAreaName('');
    setIsAddAreaOpen(false);
  };

  const handleRemoveArea = (area: string) => {
    removeArea(nodeId, area);
    toast.info(pt ? `Área "${area}" removida da matriz` : `Area removed`);
  };

  const handleReset = () => {
    resetToDefault(nodeId);
    toast.success(pt ? 'Matriz RACI restaurada para o padrão' : 'RACI Matrix reset to default');
  };

  const toggleRole = (rowId: string, area: string, role: RaciRole) => {
    const row = matrix.rows.find((r) => r.id === rowId);
    const currentCell = row?.cells[area] || { roles: [] };
    const currentRoles = currentCell.roles || [];

    let updatedRoles: RaciRole[];
    if (currentRoles.includes(role)) {
      updatedRoles = currentRoles.filter((r) => r !== role);
    } else {
      updatedRoles = [...currentRoles, role];
    }

    updateCellRoles(nodeId, rowId, area, updatedRoles, currentCell.note);
  };

  const updateCellNote = (rowId: string, area: string, note: string) => {
    const row = matrix.rows.find((r) => r.id === rowId);
    const currentCell = row?.cells[area] || { roles: [] };
    updateCellRoles(nodeId, rowId, area, currentCell.roles, note.trim() || undefined);
  };

  const clearCell = (rowId: string, area: string) => {
    updateCellRoles(nodeId, rowId, area, [], undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[96vw] xl:max-w-7xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white border-[#CFD7E6] shadow-2xl">
        {/* ── Top Header (Padrão Corporativo Azul) ────────────────────── */}
        <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-[#71809A] font-medium mb-1">
                <TableProperties className="h-3.5 w-3.5 text-[#1327b9]" />
                <span className="uppercase tracking-wider font-semibold text-[#1327b9]">
                  {pt ? 'Matriz RACI de Governança' : 'RACI Governance Matrix'}
                </span>
                <span>•</span>
                <span className="text-[#4D5A72]">{breadcrumbPath}</span>
              </div>
              <DialogTitle className="text-xl font-bold text-[#15233B] flex items-center gap-2">
                <span>{pt ? 'Matriz RACI' : 'RACI Matrix'}</span>
                <span className="text-sm font-normal text-[#71809A]">
                  — {nodeTitle || stageName}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-[#64748B] mt-0.5">
                {pt 
                  ? 'Definição clara de papéis (Responsável, Aprovador, Consultado, Informado) por procedimento e área funcional.'
                  : 'Clear definition of roles (Responsible, Accountable, Consulted, Informed) per procedure and functional area.'}
              </DialogDescription>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Adicionar Área Popover */}
              <Popover open={isAddAreaOpen} onOpenChange={setIsAddAreaOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs border-[#CFD7E6] bg-white hover:bg-[#F0F4FF] hover:border-[#1327b9] hover:text-[#1327b9] text-[#15233B] font-medium shadow-2xs gap-1.5 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#1327b9]" />
                    {pt ? 'Adicionar área' : 'Add area'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-3 bg-white border-[#CFD7E6] shadow-xl">
                  <h4 className="text-xs font-semibold text-[#15233B] mb-1.5">
                    {pt ? 'Nova Área / Coluna' : 'New Area Column'}
                  </h4>
                  <p className="text-[11px] text-[#64748B] mb-2.5">
                    {pt ? 'Insira o nome do departamento ou equipe:' : 'Enter department or team name:'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={pt ? 'Ex: Jurídico, Logística...' : 'e.g. Legal, Logistics...'}
                      value={newAreaName}
                      onChange={(e) => setNewAreaName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddArea()}
                      className="h-8 text-xs border-[#CFD7E6] focus-visible:ring-[#1327b9]"
                    />
                    <Button size="sm" onClick={handleAddArea} className="h-8 bg-[#1327b9] hover:bg-[#2743D7] text-white text-xs">
                      {pt ? 'Criar' : 'Add'}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Reset to Default */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                title={pt ? "Restaurar versão original da RACI" : "Reset RACI"}
                className="h-8 px-2.5 text-xs text-[#71809A] hover:text-[#1327b9] hover:bg-[#F0F4FF]"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">{pt ? 'Restaurar Padrão' : 'Reset'}</span>
              </Button>
            </div>
          </div>

          {/* ── Legend Bar (Padrão Corporativo Azul) ── */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#475569]">
            <div className="flex items-center gap-1.5 font-semibold text-[#1E293B]">
              <Info className="h-3.5 w-3.5 text-[#1327b9]" />
              <span>{pt ? 'Legenda RACI:' : 'RACI Legend:'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-[11px]">
              {/* R */}
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#475569] text-white font-bold flex items-center justify-center text-[10px] shadow-2xs">
                  R
                </span>
                <span className="font-semibold text-[#1E293B]">
                  {pt ? 'Responsável' : 'Responsible'}
                </span>
                <span className="text-[#64748B] hidden md:inline">
                  ({pt ? 'quem executa a entrega' : 'who does the work'})
                </span>
              </div>

              {/* A */}
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1327b9] text-white font-bold flex items-center justify-center text-[10px] shadow-2xs">
                  A
                </span>
                <span className="font-semibold text-[#1E293B]">
                  {pt ? 'Aprovador / Autorizador' : 'Accountable'}
                </span>
                <span className="text-[#64748B] hidden md:inline">
                  ({pt ? 'decisão final e aprovação' : 'final approval'})
                </span>
              </div>

              {/* C */}
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#0284C7] text-white font-bold flex items-center justify-center text-[10px] shadow-2xs">
                  C
                </span>
                <span className="font-semibold text-[#1E293B]">
                  {pt ? 'Consultado' : 'Consulted'}
                </span>
                <span className="text-[#64748B] hidden md:inline">
                  ({pt ? 'contribui com insumos e parecer' : 'provides inputs'})
                </span>
              </div>

              {/* I */}
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#6366F1] text-white font-bold flex items-center justify-center text-[10px] shadow-2xs">
                  I
                </span>
                <span className="font-semibold text-[#1E293B]">
                  {pt ? 'Informado' : 'Informed'}
                </span>
                <span className="text-[#64748B] hidden md:inline">
                  ({pt ? 'notificado do progresso e status' : 'kept informed'})
                </span>
              </div>
            </div>

            <div className="text-[10px] text-[#64748B] italic hidden xl:block">
              {pt ? 'Clique em qualquer célula para alterar papéis' : 'Click any cell to edit roles'}
            </div>
          </div>
        </div>

        {/* ── Table Content Container (Alinhamento 100% Rigoroso via HTML Table) ── */}
        <div className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
          <div className="w-full border border-[#CBD5E1] rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left table-fixed">
                {/* Definição estrita das larguras das colunas */}
                <colgroup>
                  <col style={{ width: '380px' }} />
                  {matrix.areas.map((area) => (
                    <col key={area} style={{ width: '110px' }} />
                  ))}
                </colgroup>

                {/* Table Header */}
                <thead>
                  <tr className="bg-[#F1F5F9] border-b-2 border-[#CBD5E1] text-[11px] font-bold text-[#1E293B]">
                    {/* Procedimento Column Header (Primeira coluna, sem coluna Etapa) */}
                    <th className="px-4 py-3.5 border-r border-[#CBD5E1] align-middle">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider font-bold text-[#15233B]">
                          {pt ? 'Procedimento' : 'Procedure'}
                        </span>
                      </div>
                    </th>

                    {/* Areas Column Headers */}
                    {matrix.areas.map((area) => (
                      <th 
                        key={area}
                        className="px-2 py-3.5 border-r last:border-r-0 border-[#CBD5E1] text-center align-middle relative group bg-[#F1F5F9]"
                      >
                        <div className="flex items-center justify-center relative px-2">
                          <span className="truncate text-xs font-semibold text-[#1E293B]" title={area}>
                            {area}
                          </span>
                          {/* Delete Area button on hover */}
                          <button
                            onClick={() => handleRemoveArea(area)}
                            title={pt ? `Remover coluna "${area}"` : `Remove area "${area}"`}
                            className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 p-0.5 rounded text-[#94A3B8] hover:text-red-600 hover:bg-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-[#E2E8F0]">
                  {matrix.rows.map((row) => (
                    <tr 
                      key={row.id}
                      className="hover:bg-[#F8FAFC] transition-colors duration-150"
                    >
                      {/* Procedimento Cell */}
                      <td className="px-4 py-3.5 border-r border-[#E2E8F0] align-middle bg-white">
                        <div className="text-xs font-semibold text-[#15233B] leading-snug">
                          {row.procedure}
                        </div>
                        {row.subDetail && (
                          <div className="text-[10px] text-[#64748B] italic mt-0.5 leading-tight">
                            {row.subDetail}
                          </div>
                        )}
                      </td>

                      {/* Area Cells */}
                      {matrix.areas.map((area) => {
                        const cellData = row.cells[area] || { roles: [] };
                        const roles = cellData.roles || [];
                        const note = cellData.note;

                        return (
                          <td
                            key={area}
                            className="p-1 border-r last:border-r-0 border-[#E2E8F0] text-center align-middle"
                          >
                            <CellPopover
                              row={row}
                              area={area}
                              roles={roles}
                              note={note}
                              onToggleRole={(role) => toggleRole(row.id, area, role)}
                              onUpdateNote={(newNote) => updateCellNote(row.id, area, newNote)}
                              onClear={() => clearCell(row.id, area)}
                              pt={pt}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div className="bg-white border-t border-[#E2E8F0] px-6 py-3 flex items-center justify-between text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              {matrix.rows.length} {pt ? 'procedimentos mapeados' : 'procedures mapped'} • {matrix.areas.length} {pt ? 'áreas participantes' : 'participating areas'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs border-[#CFD7E6] text-[#15233B] hover:bg-[#F0F4FF] hover:text-[#1327b9] hover:border-[#1327b9]"
            >
              {pt ? 'Fechar' : 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Cell Popover Component (Padrão Corporativo Azul) ──
interface CellPopoverProps {
  row: RaciRow;
  area: string;
  roles: RaciRole[];
  note?: string;
  onToggleRole: (role: RaciRole) => void;
  onUpdateNote: (note: string) => void;
  onClear: () => void;
  pt: boolean;
}

function CellPopover({
  row,
  area,
  roles,
  note,
  onToggleRole,
  onUpdateNote,
  onClear,
  pt
}: CellPopoverProps) {
  const [open, setOpen] = useState(false);
  const [tempNote, setTempNote] = useState(note || '');

  React.useEffect(() => {
    setTempNote(note || '');
  }, [note]);

  const handleSaveNote = () => {
    onUpdateNote(tempNote);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full h-full min-h-[46px] rounded-lg transition-all duration-150 flex flex-col items-center justify-center p-1 group hover:bg-[#F0F4FF]/70",
            roles.length > 0 ? "bg-transparent" : "hover:border hover:border-dashed hover:border-[#CCD9FF]"
          )}
        >
          {roles.length > 0 ? (
            <div className="flex flex-col items-center justify-center gap-0.5">
              <div className="flex items-center gap-1 justify-center flex-wrap">
                {roles.includes('R') && (
                  <span className="w-5 h-5 rounded-full bg-[#475569] text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
                    R
                  </span>
                )}
                {roles.includes('A') && (
                  <span className="w-5 h-5 rounded-full bg-[#1327b9] text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
                    A
                  </span>
                )}
                {roles.includes('C') && (
                  <span className="w-5 h-5 rounded-full bg-[#0284C7] text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
                    C
                  </span>
                )}
                {roles.includes('I') && (
                  <span className="w-5 h-5 rounded-full bg-[#6366F1] text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
                    I
                  </span>
                )}
              </div>
              {note && (
                <span className="text-[8px] text-[#64748B] max-w-[85px] truncate font-medium text-center leading-none mt-0.5" title={note}>
                  {note}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-transparent group-hover:text-[#1327b9] font-bold transition-colors">
              +
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-3 bg-white border-[#CFD7E6] shadow-xl" align="center">
        <div className="mb-2 pb-1.5 border-b border-[#E2E8F0]">
          <div className="text-[10px] text-[#1327b9] font-semibold uppercase tracking-wider">
            {area}
          </div>
          <div className="text-xs font-semibold text-[#15233B] truncate">
            {row.procedure}
          </div>
        </div>

        {/* RACI Buttons */}
        <div className="mb-3">
          <div className="text-[10px] text-[#475569] font-semibold mb-1.5">
            {pt ? 'Papéis da Área:' : 'Area Roles:'}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {/* R */}
            <button
              onClick={() => onToggleRole('R')}
              className={cn(
                "h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all",
                roles.includes('R')
                  ? "bg-[#475569] text-white shadow-xs ring-2 ring-[#475569]/30"
                  : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
              )}
            >
              R
            </button>

            {/* A */}
            <button
              onClick={() => onToggleRole('A')}
              className={cn(
                "h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all",
                roles.includes('A')
                  ? "bg-[#1327b9] text-white shadow-xs ring-2 ring-[#1327b9]/30"
                  : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
              )}
            >
              A
            </button>

            {/* C */}
            <button
              onClick={() => onToggleRole('C')}
              className={cn(
                "h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all",
                roles.includes('C')
                  ? "bg-[#0284C7] text-white shadow-xs ring-2 ring-[#0284C7]/30"
                  : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
              )}
            >
              C
            </button>

            {/* I */}
            <button
              onClick={() => onToggleRole('I')}
              className={cn(
                "h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all",
                roles.includes('I')
                  ? "bg-[#6366F1] text-white shadow-xs ring-2 ring-[#6366F1]/30"
                  : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
              )}
            >
              I
            </button>
          </div>
        </div>

        {/* Observação / Contexto */}
        <div className="mb-2.5">
          <div className="text-[10px] text-[#475569] font-semibold mb-1">
            {pt ? 'Observação / Sub-papel (opcional):' : 'Note / Sub-role (optional):'}
          </div>
          <Input
            placeholder={pt ? 'Ex: Insight de Inovação, Olhar de canais...' : 'e.g. Innovation insight...'}
            value={tempNote}
            onChange={(e) => setTempNote(e.target.value)}
            onBlur={handleSaveNote}
            className="h-7 text-xs border-[#CFD7E6] focus-visible:ring-[#1327b9]"
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
          <button
            onClick={onClear}
            className="text-[10px] text-red-600 hover:underline"
          >
            {pt ? 'Limpar célula' : 'Clear'}
          </button>
          <Button
            size="sm"
            onClick={() => {
              handleSaveNote();
              setOpen(false);
            }}
            className="h-6 px-2 text-[10px] bg-[#1327b9] hover:bg-[#2743D7] text-white"
          >
            {pt ? 'Concluído' : 'Done'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
