import { useState, useEffect } from "react";
import {
  BrainCircuit,
  Sparkles,
  Network,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  GitBranch,
} from "lucide-react";
import { useOrgIntelligenceStore } from "@/stores/orgIntelligenceStore";
import { cn } from "@/lib/utils";

interface NeuralNode {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  color: string;
  pulseDelay: string;
}

const NEURAL_NODES: NeuralNode[] = [
  // Hemisfério Esquerdo (Operações, Finanças, Redes, Regulação)
  { id: "node-infra", name: "Rede & Infraestrutura", category: "Engenharia", x: 120, y: 110, color: "#ea580c", pulseDelay: "0ms" },
  { id: "node-fin", name: "Finanças & OPEX", category: "Controladoria", x: 90, y: 220, color: "#0284c7", pulseDelay: "400ms" },
  { id: "node-jur", name: "Jurídico & Anatel RGC", category: "Governança", x: 150, y: 320, color: "#8b5cf6", pulseDelay: "800ms" },
  { id: "node-p2p", name: "Suprimentos & P2P", category: "Procurement", x: 210, y: 190, color: "#059669", pulseDelay: "300ms" },

  // Hemisfério Direito (Clientes, Produtos, CX, Vendas, Atendimento)
  { id: "node-cx", name: "Experiência do Cliente (CX)", category: "NPS & Churn", x: 480, y: 110, color: "#f59e0b", pulseDelay: "200ms" },
  { id: "node-ops", name: "Atendimento & Field Service", category: "Operações", x: 510, y: 220, color: "#10b981", pulseDelay: "600ms" },
  { id: "node-prod", name: "Produto & Precificação", category: "Comercial", x: 450, y: 320, color: "#ec4899", pulseDelay: "900ms" },
  { id: "node-sys", name: "Sistemas & ERP / Radius", category: "Arquitetura TI", x: 390, y: 190, color: "#06b6d4", pulseDelay: "500ms" },
];

// Conexões sinápticas entre nós
const SYNAPSE_PATHS = [
  // Do centro para os nós da esquerda
  { from: [300, 215], to: [120, 110], control: [200, 140] },
  { from: [300, 215], to: [90, 220], control: [180, 220] },
  { from: [300, 215], to: [150, 320], control: [200, 290] },
  { from: [300, 215], to: [210, 190], control: [250, 200] },

  // Do centro para os nós da direita
  { from: [300, 215], to: [480, 110], control: [400, 140] },
  { from: [300, 215], to: [510, 220], control: [420, 220] },
  { from: [300, 215], to: [450, 320], control: [400, 290] },
  { from: [300, 215], to: [390, 190], control: [350, 200] },

  // Sinapses cruzadas interdepartamentais (Cross-functional)
  { from: [120, 110], to: [210, 190], control: [160, 140] },
  { from: [90, 220], to: [150, 320], control: [110, 270] },
  { from: [480, 110], to: [390, 190], control: [440, 140] },
  { from: [510, 220], to: [450, 320], control: [490, 270] },
  { from: [210, 190], to: [390, 190], control: [300, 160] },
  { from: [150, 320], to: [450, 320], control: [300, 350] },
];

const SYNAPSE_LOGS = [
  { step: 1, text: "Carregando a ontologia de processos e cadeia de valor corporativa...", delay: 200 },
  { step: 2, text: "Ativando sinapses neurais entre Políticas Internas e Base Regulatória (Anatel / SOX)...", delay: 900 },
  { step: 3, text: "Cruzando matriz de dependência sistêmica entre ERP SAP, CRM e provisionamento Radius...", delay: 1700 },
  { step: 4, text: "Simulando impactos em cascata sobre indicadores de Churn, NPS, TMA e PMR financeiro...", delay: 2400 },
  { step: 5, text: "Convergindo acordos do comitê multi-agente e consolidando Resumo Executivo v1...", delay: 3100 },
];

export function OrgBrainLoadingView() {
  const { simulationLoadingMode, simulationLoadingSteps, activeSession } = useOrgIntelligenceStore();

  const [progress, setProgress] = useState(12);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  // Animação de progresso suave de 0 a 100%
  useEffect(() => {
    const startTime = Date.now();
    const duration = 3600; // 3.6 segundos

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 98);
      setProgress(pct);

      if (elapsed > 2800) {
        setActiveLogIndex(4);
      } else if (elapsed > 2100) {
        setActiveLogIndex(3);
      } else if (elapsed > 1400) {
        setActiveLogIndex(2);
      } else if (elapsed > 700) {
        setActiveLogIndex(1);
      } else {
        setActiveLogIndex(0);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const stepsToDisplay =
    simulationLoadingSteps && simulationLoadingSteps.length > 0
      ? simulationLoadingSteps
      : SYNAPSE_LOGS.map((l) => l.text);

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc]/95 backdrop-blur-xl text-slate-900 flex flex-col justify-between overflow-hidden select-none">
      {/* Background Decorativo: Glow radial sutil e Grid Tecnológico Claro */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glow central em tons quentes e ciano */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-orange-400/10 via-amber-300/10 to-sky-400/10 blur-3xl opacity-80" />
        {/* Linhas de grid sutis em tom slate suave */}
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* =====================================================================
          1. HEADER SUPERIOR DO CÉREBRO ORGANIZACIONAL
      ===================================================================== */}
      <header className="relative z-10 px-8 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-[#ea580c] flex items-center justify-center shadow-sm">
            <BrainCircuit className="h-5 w-5 animate-pulse text-[#ea580c]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                Org. Intelligence Neural Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200">
                {simulationLoadingMode === "reprocess" ? "Recalibrando Sinapses" : "Mapeamento Sináptico Ativo"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Processando raciocínio multi-agente em tempo real
            </p>
          </div>
        </div>

        {/* Telemetria Compacta no Topo */}
        <div className="hidden md:flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>8 Nós Departamentais Conectados</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[11px] font-medium">
            <Network className="h-3.5 w-3.5 text-[#ea580c]" />
            <span>1.840 cruzamentos de processos</span>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. PALCO CENTRAL: CÉREBRO VIRTUAL DA ORGANIZAÇÃO COM SINAPSES VIVAS
      ===================================================================== */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 my-auto">
        <div className="relative w-full max-w-[660px] h-[360px] sm:h-[400px] flex items-center justify-center">
          {/* SVG com as Sinapses / Conexões Neurais */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 600 420"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradiente da linha sináptica no tema claro */}
              <linearGradient id="synapseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.95" />
              </linearGradient>

              {/* Filtro de brilho neon sutil */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Linhas de Sinapses com Arcos Suaves */}
            {SYNAPSE_PATHS.map((path, idx) => (
              <g key={idx}>
                {/* Linha base sutil em tom neutro slate */}
                <path
                  d={`M ${path.from[0]} ${path.from[1]} Q ${path.control[0]} ${path.control[1]} ${path.to[0]} ${path.to[1]}`}
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeOpacity="0.75"
                  fill="none"
                />

                {/* Pulso de luz animado percorrendo a sinapse */}
                <path
                  d={`M ${path.from[0]} ${path.from[1]} Q ${path.control[0]} ${path.control[1]} ${path.to[0]} ${path.to[1]}`}
                  stroke="url(#synapseGradient)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="20 130"
                  className="animate-pulse"
                  style={{
                    animationDuration: `${1.4 + (idx % 4) * 0.4}s`,
                    animationDelay: `${(idx * 0.15).toFixed(2)}s`,
                  }}
                  filter="url(#neonGlow)"
                />
              </g>
            ))}

            {/* Ondas concêntricas emitidas pelo Núcleo Central */}
            <circle cx="300" cy="215" r="46" stroke="#ea580c" strokeWidth="1.5" strokeOpacity="0.3" className="animate-ping" style={{ animationDuration: "2.8s" }} />
            <circle cx="300" cy="215" r="76" stroke="#0284c7" strokeWidth="1.2" strokeOpacity="0.25" className="animate-ping" style={{ animationDuration: "3.4s", animationDelay: "0.8s" }} />
          </svg>

          {/* NÓS NEURAIS PERIFÉRICOS (ÁREAS CORPORATIVAS) */}
          {NEURAL_NODES.map((node) => (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
              style={{
                left: `${(node.x / 600) * 100}%`,
                top: `${(node.y / 420) * 100}%`,
              }}
            >
              {/* Ponto / Nó Neural com Halo */}
              <div className="relative flex items-center justify-center">
                <div
                  className="w-8 h-8 rounded-full border bg-white flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                  style={{
                    borderColor: `${node.color}50`,
                    boxShadow: `0 2px 8px -1px ${node.color}30, 0 1px 3px 0 rgba(0, 0, 0, 0.05)`,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: node.color,
                      boxShadow: `0 0 8px ${node.color}`,
                    }}
                  />
                </div>
              </div>

              {/* Rótulo da Área / Dimensão */}
              <div className="mt-1.5 text-center pointer-events-none max-w-[130px]">
                <div className="text-[11px] font-bold text-slate-800 tracking-tight leading-tight">
                  {node.name}
                </div>
                <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                  {node.category}
                </div>
              </div>
            </div>
          ))}

          {/* NÚCLEO CENTRAL DO CÉREBRO VIRTUAL (ORGANIZATIONAL BRAIN CORE) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
            <div className="relative">
              {/* Círculo com efeito de gradiente */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#ea580c] via-orange-500 to-amber-400 p-[2px] shadow-xl shadow-orange-500/20">
                <div className="w-full h-full bg-white rounded-[14px] flex flex-col items-center justify-center shadow-inner">
                  <BrainCircuit className="h-9 w-9 text-[#ea580c] animate-pulse" />
                </div>
              </div>

              {/* Badge no Núcleo */}
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-900 text-white shadow-md border border-slate-800 whitespace-nowrap">
                Cérebro Ativo
              </span>
            </div>

            <div className="mt-4 space-y-0.5">
              <div className="text-xs font-bold text-slate-900 tracking-tight">
                Núcleo da Inteligência
              </div>
              <div className="text-[10px] text-slate-500 font-mono font-medium">
                {progress}% das sinapses mapeadas
              </div>
            </div>
          </div>
        </div>

        {/* Título e Status de Ação em Andamento */}
        <div className="text-center space-y-1.5 mt-2 max-w-xl">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {simulationLoadingMode === "reprocess"
              ? `Reprocessando Relatório v${activeSession?.activeVersionNumber || 2} com Acordos da Mesa Redonda`
              : "Construindo o Modelo de Impacto Sistêmico da Decisão"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Conectando diretrizes de negócio, sistemas legados, regulação e indicadores da empresa
          </p>
        </div>
      </main>

      {/* =====================================================================
          3. TERMINAL DE TELEMETRIA E LOGS DINÂMICOS NO RODAPÉ
      ===================================================================== */}
      <footer className="relative z-10 px-6 sm:px-10 pb-8 max-w-3xl w-full mx-auto space-y-4">
        {/* Barra de Progresso Sináptica */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-[#ea580c] animate-spin" />
              <span>Disparando simulações nos processos organizacionais...</span>
            </span>
            <span className="font-mono font-bold text-[#ea580c]">{progress}%</span>
          </div>

          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ea580c] via-orange-400 to-amber-400 transition-all duration-150 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Log Ativo em Destaque com Transição */}
        <div className="bg-white/90 border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3 backdrop-blur-md shadow-md shadow-slate-200/50">
          <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-[#ea580c] flex items-center justify-center shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
              Passo {activeLogIndex + 1} de {stepsToDisplay.length}
            </div>
            <div className="text-xs text-slate-800 font-medium truncate mt-0.5">
              {stepsToDisplay[activeLogIndex] || stepsToDisplay[0]}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Convergindo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
