export const SOP_HL_CLASS = "sop-hl";
export const SOP_HL_ACTIVE_CLASS = "sop-hl-active";

/** Removes all highlight <mark> wrappers previously injected in the container. */
export function clearSopHighlights(root: HTMLElement | null) {
  if (!root) return;
  root.querySelectorAll(`mark.${SOP_HL_CLASS}`).forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(mark.textContent || ""), mark);
    parent.normalize();
  });
}

/** Wraps every case-insensitive occurrence of `query` in <mark> tags. Returns hit count. */
export function applySopHighlights(root: HTMLElement | null, query: string): number {
  if (!root) return 0;
  const needle = query.trim().toLowerCase();
  if (!needle) return 0;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Node) {
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest("input, textarea, select, [data-no-highlight]")) {
        return NodeFilter.FILTER_REJECT;
      }
      const value = node.nodeValue?.toLowerCase() || "";
      return value.includes(needle) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  let count = 0;
  for (const node of textNodes) {
    let current: Text | null = node;
    while (current) {
      const idx = (current.nodeValue || "").toLowerCase().indexOf(needle);
      if (idx === -1) break;
      const matchNode = current.splitText(idx);
      const rest = matchNode.splitText(needle.length);
      const mark = document.createElement("mark");
      mark.className = SOP_HL_CLASS;
      mark.textContent = matchNode.nodeValue;
      matchNode.parentNode?.replaceChild(mark, matchNode);
      count += 1;
      current = rest;
    }
  }
  return count;
}

/** Marks the hit at `index` as active, scrolls it into view and returns the total hits. */
export function focusSopHighlight(root: HTMLElement | null, index: number): number {
  if (!root) return 0;
  const marks = Array.from(root.querySelectorAll<HTMLElement>(`mark.${SOP_HL_CLASS}`));
  marks.forEach((m) => m.classList.remove(SOP_HL_ACTIVE_CLASS));
  if (marks.length === 0) return 0;
  const safeIndex = ((index % marks.length) + marks.length) % marks.length;
  const target = marks[safeIndex];
  target.classList.add(SOP_HL_ACTIVE_CLASS);
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  return marks.length;
}

/** Finds the id of the closest step wrapper for the active hit. */
export function activeHitStepId(root: HTMLElement | null): string | null {
  const active = root?.querySelector<HTMLElement>(`mark.${SOP_HL_ACTIVE_CLASS}`);
  const wrapper = active?.closest<HTMLElement>("[data-step-id]");
  return wrapper?.dataset.stepId || null;
}

/** Strips HTML tags / bullets from substep descriptions for outline labels. */
export function plainTextLabel(html: string | undefined, max = 80): string {
  if (!html) return "";
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/[•\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}
