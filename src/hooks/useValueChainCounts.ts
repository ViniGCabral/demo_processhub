import { useMemo } from "react";
import { L1Process, L2Process, L3Process, L4Task } from "@/stores/valueChainStore";
import { useProcessStore } from "@/stores/processStore";
import { useTaxonomyStore } from "@/stores/taxonomyStore";

export interface CumulativeCounts {
  l2: number;
  l3: number;
  l4: number;
  processes: number;
}

function countL4Processes(l4: L4Task, processes: ReturnType<typeof useProcessStore.getState>["processes"]) {
  return processes.filter((p) => p.l4 === l4.name).length;
}

export function useValueChainCounts() {
  const processes = useProcessStore((s) => s.processes);
  const maxLevel = useTaxonomyStore((s) => s.maxLevel);

  return useMemo(() => {
    // When the chain stops at L3, processes are attached to the L3 itself.
    const countL3Processes = (l3: L3Process) =>
      maxLevel >= 4
        ? l3.l4Tasks.reduce((acc, l4c) => acc + countL4Processes(l4c, processes), 0)
        : processes.filter((p) => p.l3 === l3.name).length;

    const l1Counts = (l1: L1Process): CumulativeCounts => {
      let l3 = 0, l4 = 0, procs = 0;
      l1.l2Processes.forEach((l2c) => {
        l3 += l2c.l3Processes.length;
        l2c.l3Processes.forEach((l3c) => {
          l4 += l3c.l4Tasks.length;
          procs += countL3Processes(l3c);
        });
      });
      return { l2: l1.l2Processes.length, l3, l4, processes: procs };
    };

    const l2Counts = (l2: L2Process): CumulativeCounts => {
      let l4 = 0, procs = 0;
      l2.l3Processes.forEach((l3c) => {
        l4 += l3c.l4Tasks.length;
        procs += countL3Processes(l3c);
      });
      return { l2: 0, l3: l2.l3Processes.length, l4, processes: procs };
    };

    const l3Counts = (l3: L3Process): CumulativeCounts => {
      return { l2: 0, l3: 0, l4: l3.l4Tasks.length, processes: countL3Processes(l3) };
    };

    const l4Counts = (l4: L4Task): CumulativeCounts => {
      return { l2: 0, l3: 0, l4: 0, processes: countL4Processes(l4, processes) };
    };

    return { l1Counts, l2Counts, l3Counts, l4Counts };
  }, [processes, maxLevel]);
}
