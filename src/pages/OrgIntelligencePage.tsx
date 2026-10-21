import { AppLayout } from "@/components/layout/AppLayout";
import { useOrgIntelligenceStore } from "@/stores/orgIntelligenceStore";
import { OrgIntelligenceHomeView } from "@/components/org-intelligence/OrgIntelligenceHomeView";
import { AreaQAChatView } from "@/components/org-intelligence/AreaQAChatView";
import { NewSimulationView } from "@/components/org-intelligence/NewSimulationView";
import { SimulationHistoryView } from "@/components/org-intelligence/SimulationHistoryView";
import { ImpactSimulatorView } from "@/components/org-intelligence/ImpactSimulatorView";
import { VirtualCommitteeView } from "@/components/org-intelligence/VirtualCommitteeView";
import { ContextManagerView } from "@/components/org-intelligence/ContextManagerView";
import { OrgBrainLoadingView } from "@/components/org-intelligence/OrgBrainLoadingView";

interface OrgIntelligencePageProps {
  onLogout: () => void;
}

export function OrgIntelligencePage({ onLogout }: OrgIntelligencePageProps) {
  const { activeModuleTab, isSimulating } = useOrgIntelligenceStore();

  return (
    <AppLayout activeMenu="org-intelligence" onLogout={onLogout}>
      <div className="flex flex-col flex-1 min-h-[calc(100vh-64px)] bg-[#f8fafc]">
        {/* TELA DE CARREGAMENTO NEURAL / SINAPSES DO CÉREBRO VIRTUAL */}
        {isSimulating && <OrgBrainLoadingView />}

        {/* CONTEÚDO ATIVO (OCULTO DURANTE O PROCESSAMENTO PARA NÃO EXIBIR DADOS PRÉVIOS) */}
        {!isSimulating && (
          <main className="flex-1">
            {activeModuleTab === "home" && <OrgIntelligenceHomeView />}
            {activeModuleTab === "qa_chat" && <AreaQAChatView />}
            {activeModuleTab === "new_simulation" && <NewSimulationView />}
            {activeModuleTab === "history" && <SimulationHistoryView />}
            {activeModuleTab === "simulator" && <ImpactSimulatorView />}
            {activeModuleTab === "committee" && <VirtualCommitteeView />}
            {activeModuleTab === "context" && <ContextManagerView />}
          </main>
        )}
      </div>
    </AppLayout>
  );
}

export default OrgIntelligencePage;
