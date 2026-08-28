import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ChevronDown, Upload, Download, Plus, ArrowLeft, Filter, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/layout/TopBar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ColumnConfigPopover,
  ColumnId,
  COLUMN_ORDER,
  getStoredColumns,
  saveColumns,
  clearColumns,
  getVisibleColumns,
  useColumnLabel,
} from "@/components/process/ColumnConfigPopover";
import { HealthMetricCell } from "@/components/process/HealthMetricCell";
import { useProcessStore, ProcessData } from "@/stores/processStore";
import { useTaxonomy } from "@/stores/taxonomyStore";
import { toast } from "sonner";

interface ProcessListProps {
  onLogout: () => void;
}

const statuses = ["All Status", "Documentation Generated", "Documentation Pending"];
const statusesPT = ["Todos os Status", "Documentação Gerada", "Documentação Pendente"];
const favorites = ["All", "Favorites Only"];
const favoritesPT = ["Todos", "Apenas Favoritos"];

export function ProcessList({ onLogout }: ProcessListProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const { processes, deleteProcess } = useProcessStore();
  const { maxLevel, label: lvl } = useTaxonomy();
  const columnLabel = useColumnLabel();
  
  // Get L4 filter from URL
  const l4Filter = searchParams.get("l4") || "";
  const l3Filter = searchParams.get("l3") || "";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState(language === "PT" ? "Todas as Áreas" : "All Areas");
  const [selectedStatus, setSelectedStatus] = useState(language === "PT" ? "Todos os Status" : "All Status");
  const [selectedFavorite, setSelectedFavorite] = useState(language === "PT" ? "Todos" : "All");
  const [showFilters, setShowFilters] = useState(!!l4Filter || !!l3Filter);
  const [enabledColumns, setEnabledColumns] = useState<ColumnId[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processToDelete, setProcessToDelete] = useState<ProcessData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Generate areas dynamically from processes
  const uniqueAreas = [...new Set(processes.map(p => p.area))];
  const currentAreas = language === "PT" 
    ? ["Todas as Áreas", ...uniqueAreas] 
    : ["All Areas", ...uniqueAreas];
  const currentStatuses = language === "PT" ? statusesPT : statuses;
  const currentFavorites = language === "PT" ? favoritesPT : favorites;

  const activeFiltersCount = [
    selectedArea !== (language === "PT" ? "Todas as Áreas" : "All Areas"),
    selectedStatus !== (language === "PT" ? "Todos os Status" : "All Status"),
    selectedFavorite !== (language === "PT" ? "Todos" : "All"),
    !!l4Filter,
    !!l3Filter,
  ].filter(Boolean).length;

  useEffect(() => {
    setEnabledColumns(getStoredColumns());
  }, []);

  const handleApplyColumns = (columns: ColumnId[]) => {
    setEnabledColumns(columns);
    if (columns.length === 0) {
      clearColumns();
    } else {
      saveColumns(columns);
    }
  };

  const filteredProcesses = processes.filter((process) => {
    // Filter out template processes (used as demo data source)
    if (process.isTemplate) return false;
    
    const matchesSearch =
      process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      process.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea =
      selectedArea === "All Areas" ||
      selectedArea === "Todas as Áreas" ||
      process.area === selectedArea;
    
    const hasDoc = process.hasDocumentation;
    const matchesStatus =
      selectedStatus === "All Status" ||
      selectedStatus === "Todos os Status" ||
      (selectedStatus === "Documentation Generated" && hasDoc) ||
      (selectedStatus === "Documentação Gerada" && hasDoc) ||
      (selectedStatus === "Documentation Pending" && !hasDoc) ||
      (selectedStatus === "Documentação Pendente" && !hasDoc);

    const matchesFavorite =
      selectedFavorite === "All" ||
      selectedFavorite === "Todos" ||
      process.isFavorite === true;
    
    const matchesL4 = !l4Filter || process.l4 === l4Filter;
    const matchesL3 = !l3Filter || process.l3 === l3Filter;
    
    return matchesSearch && matchesArea && matchesStatus && matchesFavorite && matchesL4 && matchesL3;
  });

  // Hide value-chain levels deeper than the configured taxonomy depth
  const allowedColumns = enabledColumns.filter(
    (c) => !((c === "l3" && maxLevel < 3) || (c === "l4" && maxLevel < 4))
  );
  const visibleColumns = getVisibleColumns(allowedColumns);

  const clearAllFilters = () => {
    setSelectedArea(language === "PT" ? "Todas as Áreas" : "All Areas");
    setSelectedStatus(language === "PT" ? "Todos os Status" : "All Status");
    setSelectedFavorite(language === "PT" ? "Todos" : "All");
    setSearchParams({});
  };

  const clearL4Filter = () => {
    setSearchParams({});
  };

  const handleDeleteClick = (e: React.MouseEvent, process: ProcessData) => {
    e.stopPropagation();
    setProcessToDelete(process);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (processToDelete) {
      deleteProcess(processToDelete.id);
      toast.success(language === "PT" ? "Processo excluído com sucesso" : "Process deleted successfully");
    }
    setDeleteDialogOpen(false);
    setProcessToDelete(null);
  };

  const getCellValue = (process: ProcessData, colId: ColumnId) => {
    switch (colId) {
      case "area": return process.area;
      case "l1": return process.l1;
      case "l2": return process.l2;
      case "l3": return process.l3;
      case "l4": return process.l4;
      case "name": return process.name;
      case "description": return process.description;
      case "automation": return process.automation;
      case "dataIntegrity": return process.dataIntegrity;
      case "governance": return process.governance;
      case "executor": return process.executor;
      case "approver": return process.approver;
      case "frequency": return process.frequency;
      case "avgTime": return process.avgTime;
      case "lastUpdate": return process.lastUpdate;
      case "status": return process.hasDocumentation;
      default: return null;
    }
  };

  const renderCell = (process: ProcessData, colId: ColumnId, value: unknown) => {
    if (value === null || value === undefined || value === "" || value === "—") {
      return <span style={{ color: "#A5A7B0", fontStyle: "italic", fontSize: "12px" }}>N/A</span>;
    }

    switch (colId) {
      case "area":
        return (
          <span 
            className="inline-flex whitespace-nowrap"
            style={{ 
              padding: "4px 12px",
              backgroundColor: "#F3F4F6",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 500,
              color: "#6B7280"
            }}
          >
            {value as string}
          </span>
        );
      
      case "name":
        return (
          <span 
            className="block truncate"
            style={{ fontSize: "15px", fontWeight: 600, color: "#272727" }}
            title={value as string}
          >
            {value as string}
          </span>
        );
      
      case "description":
        return (
          <span 
            className="block"
            style={{ 
              fontSize: "14px", 
              fontWeight: 400, 
              color: "#6B7280",
              maxWidth: "400px",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              lineHeight: "1.4",
            }}
            title={value as string}
          >
            {value as string}
          </span>
        );
      
      case "automation":
      case "dataIntegrity":
      case "governance":
        const health = value as { maturity: number; risk: number };
        return <HealthMetricCell maturity={health.maturity} risk={health.risk} />;
      
      case "status":
        const hasDoc = value as boolean;
        return (
          <div className="flex justify-center relative group">
            <div 
              style={{ 
                width: "8px", 
                height: "8px", 
                borderRadius: "50%",
                backgroundColor: hasDoc ? "#0C1BA8" : "#D1D5DB"
              }}
            />
            <div 
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
              style={{ backgroundColor: "#272727", color: "#FFFFFF", fontSize: "11px" }}
            >
              {hasDoc 
                ? (language === "PT" ? "Documentação gerada" : "Documentation generated")
                : (language === "PT" ? "Documentação pendente" : "Documentation pending")
              }
            </div>
          </div>
        );
      
      case "l1":
      case "l2":
      case "l3":
      case "l4":
      case "executor":
      case "approver":
      case "frequency":
      case "avgTime":
      case "lastUpdate":
        return (
          <span 
            className="block truncate"
            style={{ fontSize: "13px", color: "#6B7280" }}
            title={value as string}
          >
            {value as string}
          </span>
        );
      
      default:
        return <span>{String(value)}</span>;
    }
  };

  const getColumnStyles = (colId: ColumnId, colIndex: number, isHeader: boolean = false) => {
    const col = COLUMN_ORDER.find(c => c.id === colId);
    const baseStyles: React.CSSProperties = {
      width: col?.width || "auto",
      minWidth: col?.minWidth || col?.width || "auto",
    };

    // Sticky left for area (first column)
    if (colId === "area") {
      return {
        ...baseStyles,
        position: "sticky" as const,
        left: 0,
        zIndex: isHeader ? 20 : 10,
        backgroundColor: isScrolled 
          ? (isHeader ? "#EEEEF2" : "#F4F5F8") 
          : (isHeader ? "#FAFAFA" : "#FFFFFF"),
      };
    }

    // Sticky left for name (after area)
    if (colId === "name") {
      return {
        ...baseStyles,
        position: "sticky" as const,
        left: "100px",
        zIndex: isHeader ? 20 : 10,
        backgroundColor: isScrolled 
          ? (isHeader ? "#EEEEF2" : "#F4F5F8") 
          : (isHeader ? "#FAFAFA" : "#FFFFFF"),
        boxShadow: isScrolled ? "6px 0 12px rgba(0,0,0,0.12)" : "none",
      };
    }

    // Sticky right for status (last column)
    if (colId === "status") {
      return {
        ...baseStyles,
        position: "sticky" as const,
        right: 0,
        zIndex: isHeader ? 20 : 10,
        backgroundColor: isHeader ? "#FAFAFA" : "#FFFFFF",
        boxShadow: "-2px 0 4px rgba(0,0,0,0.04)",
      };
    }

    return baseStyles;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F9F9F9" }}>
      <TopBar onLogout={onLogout} />

      <main className="flex-1 px-6 py-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:opacity-70"
            style={{ color: "#6B7280", fontSize: "14px" }}
          >
            <ArrowLeft className="h-4 w-4" />
            {language === "PT" ? "Voltar para a tela inicial" : "Back to Home"}
          </button>

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 
                className="mb-1"
                style={{ fontSize: "28px", fontWeight: 500, color: "#272727" }}
              >
                {language === "PT" ? "Processos" : "Processes"}
              </h1>
              <p style={{ fontSize: "14px", color: "#A5A7B0" }}>
                {language === "PT" 
                  ? "Gerencie e documente seus processos organizacionais" 
                  : "Manage and document your organizational processes"}
              </p>
            </div>
            <Button 
              onClick={() => navigate("/processes/new")}
              className="flex items-center gap-2"
              style={{ 
                backgroundColor: "#0C1BA8", 
                color: "white", 
                borderRadius: "10px",
                padding: "12px 20px",
                height: "auto"
              }}
            >
              <Plus className="h-4 w-4" />
              {language === "PT" ? "Novo Processo" : "New Process"}
            </Button>
          </div>

          {/* Unified Filter Bar */}
          <div 
            className="flex flex-col gap-3"
            style={{ 
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8E8EA",
              borderRadius: "12px",
              padding: "12px 16px"
            }}
          >
            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search 
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
                  style={{ color: "#6B7280" }}
                />
                <input
                  type="text"
                  placeholder={language === "PT" ? "Buscar por nome do processo..." : "Search by process name..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm outline-none bg-transparent"
                  style={{ color: "#272727" }}
                />
              </div>

              {/* Divider */}
              <div style={{ width: "1px", height: "24px", backgroundColor: "#E8E8EA" }} />

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: activeFiltersCount > 0 || showFilters ? "#0C1BA8" : "#6B7280",
                  backgroundColor: activeFiltersCount > 0 || showFilters ? "#EEF0FF" : "transparent",
                  border: activeFiltersCount > 0 || showFilters ? "1px solid #0C1BA8" : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (activeFiltersCount === 0 && !showFilters) {
                    e.currentTarget.style.borderColor = "#0C1BA8";
                    e.currentTarget.style.color = "#0C1BA8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFiltersCount === 0 && !showFilters) {
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.color = "#6B7280";
                  }
                }}
              >
                <Filter className="h-4 w-4" />
                <span>{language === "PT" ? "Filtros" : "Filters"}</span>
                {activeFiltersCount > 0 && (
                  <span 
                    className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded"
                    style={{ backgroundColor: "#0C1BA8", color: "white", fontSize: "10px" }}
                  >
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown 
                  className="h-3 w-3 transition-transform" 
                  style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {/* Divider */}
              <div style={{ width: "1px", height: "24px", backgroundColor: "#E8E8EA" }} />

              {/* Columns Button */}
              <ColumnConfigPopover 
                enabledColumns={enabledColumns}
                onApply={handleApplyColumns}
              />

              {/* Divider */}
              <div style={{ width: "1px", height: "24px", backgroundColor: "#E8E8EA" }} />

              {/* Icon Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 rounded-md transition-colors hover:bg-gray-100"
                  style={{ color: "#6B7280" }}
                >
                  <Download className="h-4 w-4" />
                </button>
                <button 
                  className="p-2 rounded-md transition-colors hover:bg-gray-100"
                  style={{ color: "#6B7280" }}
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
              <div 
                className="flex items-center gap-4 pt-3 flex-wrap"
                style={{ borderTop: "1px solid #E8E8EA" }}
              >
                {/* Area Filter */}
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "12px", color: "#A5A7B0", fontWeight: 500 }}>
                    {language === "PT" ? "Área:" : "Area:"}
                  </span>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger 
                      className="border shadow-none bg-transparent min-w-[120px] h-8 focus:ring-0"
                      style={{ color: "#6B7280", borderColor: "#E8E8EA", borderRadius: "6px", fontSize: "13px" }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "12px", color: "#A5A7B0", fontWeight: 500 }}>
                    Status:
                  </span>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger 
                      className="border shadow-none bg-transparent min-w-[160px] h-8 focus:ring-0"
                      style={{ color: "#6B7280", borderColor: "#E8E8EA", borderRadius: "6px", fontSize: "13px" }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Favorites Filter */}
                <div className="flex items-center gap-2">
                  <Star className="h-3.5 w-3.5" style={{ color: "#A5A7B0" }} />
                  <span style={{ fontSize: "12px", color: "#A5A7B0", fontWeight: 500 }}>
                    {language === "PT" ? "Favoritos:" : "Favorites:"}
                  </span>
                  <Select value={selectedFavorite} onValueChange={setSelectedFavorite}>
                    <SelectTrigger 
                      className="border shadow-none bg-transparent min-w-[120px] h-8 focus:ring-0"
                      style={{ color: "#6B7280", borderColor: "#E8E8EA", borderRadius: "6px", fontSize: "13px" }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentFavorites.map((fav) => (
                        <SelectItem key={fav} value={fav}>
                          {fav}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* L4 Filter Badge (from URL) */}
                {(l4Filter || l3Filter) && (
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "12px", color: "#A5A7B0", fontWeight: 500 }}>
                      {l4Filter ? lvl("l4") : lvl("l3")}:
                    </span>
                    <div 
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                      style={{ backgroundColor: "#EEF0FF", border: "1px solid #0C1BA8" }}
                    >
                      <span style={{ fontSize: "13px", color: "#0C1BA8", fontWeight: 500 }}>
                        {l4Filter || l3Filter}
                      </span>
                      <button
                        onClick={clearL4Filter}
                        className="hover:opacity-70 transition-opacity"
                      >
                        <X className="h-3.5 w-3.5" style={{ color: "#0C1BA8" }} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm hover:underline transition-colors ml-auto"
                    style={{ color: "#6B7280" }}
                  >
                    {language === "PT" ? "Limpar filtros" : "Clear filters"}
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Process Table */}
          <div 
            className="mt-6 overflow-x-auto"
            style={{ 
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E8E8EA",
              scrollbarWidth: "thin",
              scrollbarColor: "#D1D5DB #F3F4F6"
            }}
          >
            <style>{`
              .process-table-container::-webkit-scrollbar {
                height: 8px;
              }
              .process-table-container::-webkit-scrollbar-track {
                background: #F3F4F6;
                border-radius: 4px;
              }
              .process-table-container::-webkit-scrollbar-thumb {
                background: #D1D5DB;
                border-radius: 4px;
              }
              .process-table-container::-webkit-scrollbar-thumb:hover {
                background: #A5A7B0;
              }
            `}</style>
            <div 
              className="process-table-container overflow-x-auto"
              onScroll={(e) => {
                const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
                setIsScrolled(scrollLeft > 10);
              }}
            >
              <table className="w-full" style={{ minWidth: enabledColumns.length > 0 ? "1200px" : "auto" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #E8E8EA" }}>
                    {visibleColumns.map((col, index) => (
                      <th
                        key={col.id}
                        className="px-6 py-3 text-left"
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          letterSpacing: "0.5px",
                          color: "#A5A7B0",
                          textTransform: "uppercase",
                          ...getColumnStyles(col.id, index, true),
                        }}
                      >
                        {columnLabel(col)}
                      </th>
                    ))}
                    {/* Actions column header */}
                    <th
                      className="px-4 py-3 text-center"
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        color: "#A5A7B0",
                        textTransform: "uppercase",
                        width: "60px",
                        position: "sticky",
                        right: 0,
                        backgroundColor: "#FAFAFA",
                        zIndex: 20,
                      }}
                    >
                      {language === "PT" ? "Ações" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProcesses.map((process, rowIndex) => (
                    <tr
                      key={process.id}
                      onClick={() => navigate(`/processes/${process.id}`)}
                      className="cursor-pointer transition-colors group"
                      style={{ 
                        borderBottom: rowIndex === filteredProcesses.length - 1 ? "none" : "1px solid #F3F4F6"
                      }}
                      onMouseEnter={(e) => {
                        const cells = e.currentTarget.querySelectorAll('td');
                        cells.forEach(cell => {
                          const isSticky = cell.style.position === 'sticky';
                          if (isSticky) {
                            cell.style.backgroundColor = "#FAFBFC";
                          }
                        });
                        e.currentTarget.style.backgroundColor = "#FAFBFC";
                      }}
                      onMouseLeave={(e) => {
                        const cells = e.currentTarget.querySelectorAll('td');
                        cells.forEach(cell => {
                          const isSticky = cell.style.position === 'sticky';
                          if (isSticky) {
                            cell.style.backgroundColor = "#FFFFFF";
                          }
                        });
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {visibleColumns.map((col, colIndex) => {
                        const value = getCellValue(process, col.id);
                        return (
                          <td
                            key={col.id}
                            className="px-6 py-4"
                            style={getColumnStyles(col.id, colIndex)}
                          >
                            {renderCell(process, col.id, value)}
                          </td>
                        );
                      })}
                      {/* Actions column */}
                      <td
                        className="px-4 py-4 text-center"
                        style={{
                          width: "60px",
                          position: "sticky",
                          right: 0,
                          backgroundColor: "#FFFFFF",
                          zIndex: 10,
                        }}
                      >
                        <button
                          onClick={(e) => handleDeleteClick(e, process)}
                          className="p-2 rounded-md transition-colors hover:bg-red-50 text-muted-foreground hover:text-red-600"
                          title={language === "PT" ? "Excluir processo" : "Delete process"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredProcesses.length === 0 && (
            <div className="py-16 text-center">
              <p style={{ color: "#A5A7B0" }}>
                {language === "PT" ? "Nenhum processo encontrado" : "No processes found"}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4">
            <p style={{ fontSize: "13px", color: "#A5A7B0" }}>
              {language === "PT" 
                ? `Mostrando ${filteredProcesses.length} de ${processes.length} processos`
                : `Showing ${filteredProcesses.length} of ${processes.length} processes`}
            </p>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "PT" ? "Excluir Processo" : "Delete Process"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "PT" 
                ? `Tem certeza que deseja excluir o processo "${processToDelete?.name}"? Esta ação não pode ser desfeita.`
                : `Are you sure you want to delete the process "${processToDelete?.name}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "PT" ? "Cancelar" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {language === "PT" ? "Excluir" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
