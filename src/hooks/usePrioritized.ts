import { useEffect, useState, useCallback } from "react";

const KEY = "ph_prioritized_processes";
const EVT = "ph:prioritized-changed";

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

export function addPrioritized(id: string) {
  const arr = read();
  if (!arr.includes(id)) {
    arr.push(id);
    write(arr);
  }
}

export function removePrioritized(id: string) {
  write(read().filter((x) => x !== id));
}

export function togglePrioritized(id: string) {
  const arr = read();
  if (arr.includes(id)) write(arr.filter((x) => x !== id));
  else write([...arr, id]);
}

export function usePrioritized() {
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
  return { ids, has, add: addPrioritized, remove: removePrioritized, toggle: togglePrioritized };
}
