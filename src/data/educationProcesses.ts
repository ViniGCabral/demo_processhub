// Processos mockados da Jornada "Construção do Produto" (demo comercial).
import type { ProcessData } from "@/stores/processStore";
import { CONSTRUCAO_PRODUTO_MACROS } from "@/data/educationValueChain";

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);

export const EDUCATION_DEMO_PROCESSES: ProcessData[] = CONSTRUCAO_PRODUTO_MACROS.flatMap(
  ({ macro, processos }) =>
    processos.map((name) => ({
      id: `edu-${slug(macro)}-${slug(name)}`,
      area: "Conteúdo",
      name,
      description: `${name} — macroprocesso "${macro}" da Jornada de Construção do Produto.`,
      hasDocumentation: false,
      documentationStatus: "pending" as const,
      businessUnit: "SOMOS/Saber",
      l1: "Conteúdo",
      l2: "Construção do Produto",
      l3: macro,
      l4: name,
    }))
);
