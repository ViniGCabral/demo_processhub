import { useEffect, useState, useCallback } from "react";

const KEY = "ph_saved_clusters";
const EVT = "ph:saved-clusters-changed";

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(arr: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr));
    window.dispatchEvent(new Event(EVT));
  } catch {}
}

export function useSavedClusters() {
  const [ids, setIds] = useState<string[]>(() => read());
  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback((id: string) => {
    const arr = read();
    if (arr.includes(id)) write(arr.filter((x) => x !== id));
    else write([...arr, id]);
  }, []);
  return { ids, has, toggle };
}
