import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Network, BarChart3, Search, Star, ChevronRight, FileText, ArrowRight, Lightbulb, Sparkles, BookmarkCheck, LineChart, ScrollText } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import { TopBar } from "@/components/layout/TopBar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface DashboardProps {
  onLogout: () => void;
}

// All searchable processes with descriptions
const allProcesses = [
  { id: 1, name: "Cotação de Frete Emergencial", area: "S2P", description: "Realizar a cotação e aprovação de frete emergencial no sistema Mosaic" },
  { id: 2, name: "Adjust EHS Learning Schedules", area: "H2R", description: "Ajustar as datas de expiração dos cronogramas de aprendizado EHS no Workday" },
  { id: 3, name: "Quality Control", area: "Operations", description: "Processo de controle de qualidade para produtos e serviços" },
  { id: 4, name: "Budget Approval", area: "Finance", description: "Fluxo de aprovação de orçamentos e despesas corporativas" },
  { id: 5, name: "Performance Review", area: "HR", description: "Avaliação de desempenho de colaboradores e feedback 360" },
  { id: 6, name: "Incident Management", area: "IT", description: "Gerenciamento de incidentes e resolução de problemas técnicos" },
  { id: 7, name: "Purchase Request", area: "Finance", description: "Solicitação e aprovação de compras e aquisições" },
  { id: 8, name: "Onboarding", area: "HR", description: "Processo de integração de novos colaboradores na empresa" },
  { id: 9, name: "Vendor Qualification", area: "S2P", description: "Qualificação e homologação de fornecedores" },
  { id: 10, name: "Contract Review", area: "Legal", description: "Revisão e aprovação de contratos e acordos legais" },
];

const suggestionTags = ["Cotação de Frete", "Quality Control", "Budget Approval", "Onboarding"];

const favoriteProcesses = [
  { id: 1, area: "S2P", name: "Cotação de Frete Emergencial", docType: "POP", version: "v3.0" },
  { id: 2, area: "Operations", name: "Quality Control", docType: "POP", version: "v2.1" },
  { id: 3, area: "Finance", name: "Budget Approval", docType: "POP", version: "v1.2" },
  { id: 4, area: "HR", name: "Performance Review", docType: "BPMN", version: "v2.0" },
];

const recentProcesses = [
  { id: 1, name: "Cotação de Frete Emergencial", area: "S2P", timePT: "Acessado há 2 horas", timeEN: "Accessed 2 hours ago" },
  { id: 2, name: "Incident Management", area: "IT", timePT: "Acessado ontem", timeEN: "Accessed yesterday" },
  { id: 3, name: "Purchase Request", area: "Finance", timePT: "Acessado há 3 dias", timeEN: "Accessed 3 days ago" },
];

export function Dashboard({ onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasFavorites] = useState(true);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [showUseCaseDialog, setShowUseCaseDialog] = useState(false);
  const [savedUseCases, setSavedUseCases] = useState<any[]>([]);

  const modules = [
    {
      id: "normatives",
      title: language === "PT" ? "Gestão de Normativos" : "Policy Management",
      description: language === "PT"
        ? "Crie, revise, aprove e acompanhe todo o ciclo de vida dos normativos corporativos."
        : "Create, review, approve and monitor the full lifecycle of corporate policies.",
      icon: ScrollText,
      active: true,
      path: "/normatives",
      count: 7,
      isNew: true,
      cta: language === "PT" ? "Entrar no módulo" : "Enter module",
    },
    {
      id: "processes",
      title: language === "PT" ? "Processos" : "Processes",
      description: language === "PT" 
        ? "Registre, documente e gerencie seus processos organizacionais com POP/SOP e BPMN" 
        : "Register, document and manage your organizational processes with SOP and BPMN",
      icon: Layers,
      active: true,
      path: "/processes",
      count: 12,
    },
    {
      id: "architecture",
      title: language === "PT" ? "Arquitetura de Processos" : "Process Architecture",
      description: language === "PT" 
        ? "Desenhe e visualize a arquitetura corporativa e cadeias de valor" 
        : "Design and visualize corporate architecture and value chains",
      icon: Network,
      active: true,
      path: "/architecture",
    },
    {
      id: "process-analysis",
      title: "Process Analysis",
      description: language === "PT"
        ? "Visão consolidada de performance, sinergias e business case dos processos."
        : "Consolidated view of performance, synergies and business case across processes.",
      icon: LineChart,
      active: true,
      path: "/process-analysis",
    },
    {
      id: "org-intelligence-hub",
      title: "Org. Intelligence Hub",
      description: language === "PT"
        ? "Identifique oportunidades, priorize iniciativas e transforme processos com apoio de IA e benchmarks de mercado."
        : "Identify opportunities, prioritize initiatives and transform processes with AI and market benchmarks.",
      icon: Sparkles,
      active: false,
      path: "/org-intelligence-hub",
      isNew: true,
      cta: language === "PT" ? "Entrar no módulo" : "Enter module",
    },
  ] as Array<{
    id: string;
    title: string;
    description: string;
    icon: typeof Layers;
    active: boolean;
    path: string | null;
    count?: number;
    isNew?: boolean;
    cta?: string;
  }>;

  // Filter processes based on search query
  const filteredProcesses = searchQuery.trim().length > 0 
    ? allProcesses.filter(process => 
        process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        process.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        process.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  // Fetch saved use cases
  useEffect(() => {
    const fetchSaved = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("saved_use_cases")
        .select("*, use_cases(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setSavedUseCases(data);
    };
    fetchSaved();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      navigate(`/processes?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setShowDropdown(false);
    navigate(`/processes?search=${encodeURIComponent(tag)}`);
  };

  const handleProcessClick = (processId: number) => {
    setShowDropdown(false);
    setSearchQuery("");
    navigate(`/processes/${processId}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.trim().length > 0);
  };

  const handleModuleClick = (module: typeof modules[0]) => {
    if (!module.active) return;
    if (module.id === "usecases") {
      setShowUseCaseDialog(true);
      return;
    }
    if (module.path) navigate(module.path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onLogout={onLogout} />

      <main className="flex-1" style={{ padding: "48px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          
          {/* SECTION 1: HERO WITH SEARCH */}
          <section style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 
              style={{ 
                fontSize: "28px", 
                fontWeight: 600, 
                color: "#272727", 
                marginBottom: "24px" 
              }}
            >
              {language === "PT" ? "Encontre o processo que você precisa" : "Find the process you need"}
            </h1>

            <div ref={searchContainerRef} style={{ maxWidth: "600px", margin: "0 auto 16px", position: "relative" }}>
              <form onSubmit={handleSearch}>
                <Search 
                  style={{
                    position: "absolute",
                    left: "18px",
                    top: "24px",
                    transform: "translateY(-50%)",
                    color: "#A5A7B0",
                    width: "20px",
                    height: "20px",
                    zIndex: 10
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => {
                    setSearchFocused(true);
                    if (searchQuery.trim().length > 0) setShowDropdown(true);
                  }}
                  onBlur={() => setSearchFocused(false)}
                  placeholder={language === "PT" ? "Buscar processos, POPs, áreas..." : "Search processes, SOPs, areas..."}
                  style={{
                    width: "100%",
                    background: "#FFFFFF",
                    border: searchFocused ? "1px solid #0C1BA8" : "1px solid #E8E8EA",
                    borderRadius: showDropdown && filteredProcesses.length > 0 ? "12px 12px 0 0" : "12px",
                    padding: "16px 20px 16px 48px",
                    fontSize: "16px",
                    color: "#272727",
                    boxShadow: searchFocused 
                      ? "0 2px 12px rgba(12, 27, 168, 0.1)" 
                      : "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.2s ease",
                    outline: "none"
                  }}
                />
              </form>

              {/* Search Dropdown */}
              {showDropdown && filteredProcesses.length > 0 && (
                <div 
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#FFFFFF",
                    border: "1px solid #E8E8EA",
                    borderTop: "none",
                    borderRadius: "0 0 12px 12px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    zIndex: 50,
                    maxHeight: "360px",
                    overflowY: "auto"
                  }}
                >
                  {filteredProcesses.map((process, index) => (
                    <div
                      key={process.id}
                      onClick={() => handleProcessClick(process.id)}
                      onMouseDown={(e) => e.preventDefault()}
                      className="hover:bg-[#F9F9F9]"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "14px 18px",
                        cursor: "pointer",
                        borderBottom: index < filteredProcesses.length - 1 ? "1px solid #F3F4F6" : "none",
                        transition: "background 0.15s"
                      }}
                    >
                      <div 
                        style={{
                          width: "32px",
                          height: "32px",
                          background: "#EEF0FF",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "2px"
                        }}
                      >
                        <FileText size={14} style={{ color: "#0C1BA8" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span 
                            style={{ 
                              fontSize: "14px", 
                              fontWeight: 500, 
                              color: "#272727",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            {process.name}
                          </span>
                          <span 
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#6B7280",
                              background: "#F3F4F6",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              flexShrink: 0
                            }}
                          >
                            {process.area}
                          </span>
                        </div>
                        <p 
                          style={{ 
                            fontSize: "13px", 
                            color: "#A5A7B0", 
                            lineHeight: 1.4,
                            margin: 0,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}
                        >
                          {process.description}
                        </p>
                      </div>
                      <ChevronRight 
                        size={16} 
                        style={{ color: "#D1D5DB", flexShrink: 0, marginTop: "8px" }} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
              {suggestionTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="hover:bg-[#E8E8EA] hover:text-[#272727]"
                  style={{
                    background: "#F3F4F6",
                    color: "#6B7280",
                    fontSize: "13px",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    border: "none"
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 2: MODULES */}
          <section style={{ marginBottom: "40px" }}>
            <span 
              style={{ 
                fontSize: "11px", 
                fontWeight: 600, 
                letterSpacing: "0.5px", 
                color: "#A5A7B0", 
                textTransform: "uppercase",
                display: "block",
                marginBottom: "16px"
              }}
            >
              {language === "PT" ? "MÓDULOS" : "MODULES"}
            </span>

            <div 
              className="grid gap-5"
              style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            >
              {modules.map((module) => {
                if (module.active) {
                  return (
                    <div
                      key={module.id}
                      onClick={() => handleModuleClick(module)}
                      className="group relative rounded-2xl hover:-translate-y-0.5"
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <GlowingEffect
                        disabled={false}
                        proximity={64}
                        borderWidth={2}
                      />

                      <div
                        className="relative rounded-2xl h-full"
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #E8E8EA",
                          padding: "28px",
                          overflow: "hidden",
                        }}
                      >
                        <div 
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "3px",
                            background: "#0C1BA8",
                            borderRadius: "16px 16px 0 0"
                          }}
                        />

                        <div 
                          style={{
                            width: "48px",
                            height: "48px",
                            background: "#EEF0FF",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "20px"
                          }}
                        >
                          <module.icon size={24} style={{ color: "#0C1BA8" }} />
                        </div>

                        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#272727", marginBottom: "8px" }}>
                          {module.title}
                        </h3>

                        <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.5, marginBottom: "20px" }}>
                          {module.description}
                        </p>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          {module.count ? (
                            <span style={{ fontSize: "14px", fontWeight: 500, color: "#0C1BA8" }}>
                              {module.count} {language === "PT" ? "processos" : "processes"}
                            </span>
                          ) : module.cta ? (
                            <span style={{ fontSize: "13px", fontWeight: 500, color: "#0C1BA8" }}>
                              {module.cta}
                            </span>
                          ) : (
                            <span />
                          )}
                          <ArrowRight size={18} style={{ color: "#0C1BA8" }} />
                        </div>

                        {module.isNew && (
                          <span
                            style={{
                              position: "absolute",
                              top: "16px",
                              right: "16px",
                              fontSize: "10px",
                              fontWeight: 700,
                              letterSpacing: "0.5px",
                              color: "#0C1BA8",
                              background: "#EEF0FF",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              textTransform: "uppercase",
                            }}
                          >
                            {language === "PT" ? "Novo" : "New"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={module.id}
                    className="relative rounded-2xl hover:bg-[#F5F5F5]"
                    style={{
                      background: "#FAFAFA",
                      border: "1px solid #E8E8EA",
                      padding: "28px",
                      cursor: "default",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div 
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "#F3F4F6",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px"
                      }}
                    >
                      <module.icon size={24} style={{ color: "#A5A7B0" }} />
                    </div>

                    <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#6B7280", marginBottom: "8px" }}>
                      {module.title}
                    </h3>

                    <p style={{ fontSize: "14px", color: "#A5A7B0", lineHeight: 1.5, marginBottom: "20px" }}>
                      {module.description}
                    </p>

                    <span 
                      style={{
                        display: "inline-flex",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#6B7280",
                        background: "#E8E8EA",
                        padding: "5px 14px",
                        borderRadius: "6px"
                      }}
                    >
                      {language === "PT" ? "Em breve" : "Coming soon"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: USER FAVORITES */}
          <section style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span 
                style={{ 
                  fontSize: "11px", 
                  fontWeight: 600, 
                  letterSpacing: "0.5px", 
                  color: "#A5A7B0", 
                  textTransform: "uppercase" 
                }}
              >
                {language === "PT" ? "SEUS FAVORITOS" : "YOUR FAVORITES"}
              </span>
              <button 
                className="hover:text-primary"
                style={{ 
                  fontSize: "13px", 
                  color: "#6B7280", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  transition: "color 0.15s"
                }}
              >
                {language === "PT" ? "Gerenciar" : "Manage"} <ArrowRight size={14} />
              </button>
            </div>

            {hasFavorites ? (
              <div 
                className="grid gap-4"
                style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
              >
                {favoriteProcesses.map((process) => (
                  <div
                    key={process.id}
                    onClick={() => navigate(`/processes/${process.id}`)}
                    className="group hover:border-primary hover:shadow-[0_4px_12px_rgba(12,27,168,0.08)] hover:-translate-y-0.5"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E8E8EA",
                      borderRadius: "14px",
                      padding: "20px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative"
                    }}
                  >
                    <Star 
                      size={16} 
                      fill="#FBBF24"
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        color: "#FBBF24",
                        opacity: 0.8
                      }}
                    />
                    <span 
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#6B7280",
                        background: "#F3F4F6",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        display: "inline-flex",
                        marginBottom: "12px"
                      }}
                    >
                      {process.area}
                    </span>
                    <h3 
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#272727",
                        lineHeight: 1.35,
                        marginBottom: "16px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "40px"
                      }}
                    >
                      {process.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6B7280" }}>
                      <span style={{ fontSize: "14px" }}>{process.docType === "BPMN" ? "🔀" : "📄"}</span>
                      <span>{process.docType} {process.version}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                style={{
                  background: "#FFFFFF",
                  border: "1px dashed #D1D5DB",
                  borderRadius: "14px",
                  padding: "40px",
                  textAlign: "center"
                }}
              >
                <Star size={32} style={{ color: "#D1D5DB", marginBottom: "16px" }} />
                <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#6B7280", marginBottom: "8px" }}>
                  {language === "PT" ? "Você ainda não tem processos favoritos" : "You don't have any favorite processes yet"}
                </h3>
                <p style={{ fontSize: "14px", color: "#A5A7B0", marginBottom: "20px" }}>
                  {language === "PT" ? "Adicione processos aos favoritos para acessá-los rapidamente" : "Add processes to favorites for quick access"}
                </p>
                <button
                  onClick={() => navigate("/processes")}
                  className="hover:border-primary hover:text-primary"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E8E8EA",
                    color: "#272727",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  {language === "PT" ? "Explorar processos" : "Explore processes"}
                </button>
              </div>
            )}
          </section>

          {/* SECTION 4: RECENTLY ACCESSED */}
          <section style={{ marginBottom: "40px" }}>
            <div 
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8EA",
                borderRadius: "16px",
                padding: "24px 28px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span 
                  style={{ 
                    fontSize: "11px", 
                    fontWeight: 600, 
                    letterSpacing: "0.5px", 
                    color: "#A5A7B0", 
                    textTransform: "uppercase" 
                  }}
                >
                  {language === "PT" ? "ACESSADOS RECENTEMENTE" : "RECENTLY ACCESSED"}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {recentProcesses.map((process) => (
                  <div
                    key={process.id}
                    onClick={() => navigate(`/processes/${process.id}`)}
                    className="group hover:bg-[#FAFAFA]"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      gap: "16px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "background 0.15s"
                    }}
                  >
                    <div 
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "#EEF0FF",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <FileText size={16} style={{ color: "#0C1BA8" }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#272727" }}>
                        {process.name}
                      </span>
                      <span 
                        style={{
                          fontSize: "12px",
                          color: "#6B7280",
                          background: "#F3F4F6",
                          padding: "2px 8px",
                          borderRadius: "4px"
                        }}
                      >
                        {process.area}
                      </span>
                    </div>
                    <span style={{ fontSize: "13px", color: "#A5A7B0", marginLeft: "auto" }}>
                      {language === "PT" ? process.timePT : process.timeEN}
                    </span>
                    <ChevronRight 
                      size={16} 
                      className="group-hover:text-muted-foreground"
                      style={{ color: "#D1D5DB", transition: "color 0.15s" }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: SAVED USE CASES */}
          {savedUseCases.length > 0 && (
            <section style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span 
                  style={{ 
                    fontSize: "11px", 
                    fontWeight: 600, 
                    letterSpacing: "0.5px", 
                    color: "#A5A7B0", 
                    textTransform: "uppercase" 
                  }}
                >
                  {language === "PT" ? "CASOS DE USO SALVOS" : "SAVED USE CASES"}
                </span>
                <button 
                  onClick={() => navigate("/saved-use-cases")}
                  className="hover:text-primary"
                  style={{ 
                    fontSize: "13px", 
                    color: "#6B7280", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "none",
                    border: "none",
                    transition: "color 0.15s"
                  }}
                >
                  {language === "PT" ? "Ver todos" : "View all"} <ArrowRight size={14} />
                </button>
              </div>

              <div 
                className="grid gap-4"
                style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
              >
                {savedUseCases.map((saved) => {
                  const uc = saved.use_cases;
                  if (!uc) return null;
                  return (
                    <div
                      key={saved.id}
                      className="group hover:border-primary hover:shadow-[0_4px_12px_rgba(12,27,168,0.08)] hover:-translate-y-0.5"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E8E8EA",
                        borderRadius: "14px",
                        padding: "20px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        position: "relative"
                      }}
                    >
                      <BookmarkCheck 
                        size={16} 
                        style={{
                          position: "absolute",
                          top: "16px",
                          right: "16px",
                          color: "#0C1BA8",
                          opacity: 0.6
                        }}
                      />
                      <span 
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#6B7280",
                          background: "#F3F4F6",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          display: "inline-flex",
                          marginBottom: "12px"
                        }}
                      >
                        {uc.category || "IA"}
                      </span>
                      <h3 
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#272727",
                          lineHeight: 1.35,
                          marginBottom: "12px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "40px"
                        }}
                      >
                        {uc.title}
                      </h3>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {uc.impact && (
                          <span style={{ fontSize: "11px", color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: "4px" }}>
                            {language === "PT" ? "Impacto" : "Impact"}: {uc.impact}
                          </span>
                        )}
                        {uc.effort && (
                          <span style={{ fontSize: "11px", color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: "4px" }}>
                            {language === "PT" ? "Esforço" : "Effort"}: {uc.effort}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* Use Case Dialog */}
      <Dialog open={showUseCaseDialog} onOpenChange={setShowUseCaseDialog}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 rounded-2xl">
          <div style={{ padding: "40px 36px", textAlign: "center" }}>
            <div 
              style={{
                width: "64px",
                height: "64px",
                background: "#EEF0FF",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px"
              }}
            >
              <Lightbulb size={28} style={{ color: "#0C1BA8" }} />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#272727", marginBottom: "8px" }}>
              {language === "PT" ? "Casos de Uso" : "Use Cases"}
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "32px", lineHeight: 1.5 }}>
              {language === "PT" 
                ? "Explore novas oportunidades de automação e IA ou reveja os casos de uso já salvos." 
                : "Explore new automation and AI opportunities or review your saved use cases."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowUseCaseDialog(false);
                  navigate("/use-cases");
                }}
                className="hover:shadow-[0_4px_16px_rgba(12,27,168,0.15)]"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  width: "100%",
                  background: "#0C1BA8",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left"
                }}
              >
                <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Sparkles size={20} style={{ color: "#FFFFFF" }} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "2px" }}>
                    {language === "PT" ? "Explorar Novos Casos de Uso" : "Explore New Use Cases"}
                  </div>
                  <div style={{ fontSize: "13px", opacity: 0.8 }}>
                    {language === "PT" ? "Gere sugestões com IA para seus processos" : "Generate AI suggestions for your processes"}
                  </div>
                </div>
                <ArrowRight size={18} style={{ marginLeft: "auto", opacity: 0.7 }} />
              </button>

              <button
                onClick={() => {
                  setShowUseCaseDialog(false);
                  navigate("/saved-use-cases");
                }}
                className="hover:border-primary hover:shadow-[0_4px_12px_rgba(12,27,168,0.08)]"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  width: "100%",
                  background: "#FFFFFF",
                  color: "#272727",
                  border: "1px solid #E8E8EA",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left"
                }}
              >
                <div style={{ width: "40px", height: "40px", background: "#EEF0FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookmarkCheck size={20} style={{ color: "#0C1BA8" }} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "2px" }}>
                    {language === "PT" ? "Ver Casos de Uso Salvos" : "View Saved Use Cases"}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6B7280" }}>
                    {language === "PT" ? "Acesse os casos que você já marcou" : "Access your bookmarked use cases"}
                  </div>
                </div>
                <ArrowRight size={18} style={{ marginLeft: "auto", color: "#A5A7B0" }} />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1100px) {
          .grid[style*="repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 1000px) {
          .grid[style*="repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .grid[style*="repeat(4, 1fr)"],
          .grid[style*="repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          main {
            padding: 32px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
