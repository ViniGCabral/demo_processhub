import { L1Process } from "@/stores/valueChainStore";
import { L2MasterDetail } from "./L2MasterDetail";

interface L2DetailsViewProps {
  l1: L1Process;
  onBack: () => void;
}

export function L2DetailsView({ l1, onBack }: L2DetailsViewProps) {
  return <L2MasterDetail l1={l1} onBack={onBack} />;
}
