import { GuidedDiscoveryFlow } from "./GuidedDiscoveryFlow";

export function GoalFlow({ onBack, onResultsChange }: { onBack: () => void; onResultsChange?: (v: boolean) => void }) {
  return <GuidedDiscoveryFlow mode="goal" onBack={onBack} onResultsChange={onResultsChange} />;
}
