

## Ajustes para Demo TO-BE

### Contexto
Dois ajustes para preparar o protótipo para apresentação ao cliente.

### Mudanças

**1. Remover Overview do menu TO-BE e usar upload como tela inicial**

- **ProcessSidebar.tsx**: Remover o item `tobe-overview` do array `toBeItems`.
- **ProcessSidebar.tsx**: Adicionar prop `toBeGenerated` (boolean) para controlar se a sidebar TO-BE mostra os itens de navegação ou fica sem itens (durante o upload).
- **ProcessDetail.tsx**: Adicionar estado `toBeGenerated` (iniciar como `false`). Quando o usuário clicar em TO-BE pela primeira vez, mostrar a tela de upload (ToBeOverview). Após "gerar", setar `toBeGenerated = true` e navegar para `tobe-bpmn`.
- **ProcessDetail.tsx**: No `handleModeChange`, quando mudar para TO-BE: se `toBeGenerated` é false, mostrar ToBeOverview; se true, ir direto para `tobe-bpmn`.
- **ProcessDetail.tsx**: No `renderToBeContent`, o case default (quando não gerado) continua mostrando `<ToBeOverview />`. Remover o case `tobe-overview` pois não existirá mais como tab.

**2. Ocultar aba Integrations da sidebar**

- **ProcessSidebar.tsx**: Remover o item `tobe-integrations` do array `toBeItems` (ou comentar para fácil reativação).

### Arquivos impactados
- `src/components/layout/ProcessSidebar.tsx`
- `src/pages/ProcessDetail.tsx`

