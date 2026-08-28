import { GuidedDiscoveryFlow } from "./GuidedDiscoveryFlow";

export function SimulateFlow({ onBack, onResultsChange }: { onBack: () => void; onResultsChange?: (v: boolean) => void }) {
  return <GuidedDiscoveryFlow mode="simulate" onBack={onBack} onResultsChange={onResultsChange} />;
}
