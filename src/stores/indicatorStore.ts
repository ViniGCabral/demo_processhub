import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  BusinessIndicator, 
  IndicatorMeasurement, 
  IndicatorStatus, 
  IndicatorUpdateStatus, 
  IndicatorTrend, 
  IndicatorPolarity 
} from '@/types/architectureContextTypes';

/**
 * Calcula o status de desempenho (dentro_da_meta, atencao, critico)
 */
export function calculatePerformanceStatus(
  valStr: string,
  targetStr: string,
  alertBandStr?: string,
  polarity: IndicatorPolarity = 'maior_melhor'
): IndicatorStatus {
  const val = parseFloat(valStr.replace(/[^0-9.-]/g, ''));
  const target = parseFloat(targetStr.replace(/[^0-9.-]/g, ''));
  if (isNaN(val) || isNaN(target)) return 'sem_dados';

  let alertThreshold: number | null = null;
  if (alertBandStr) {
    const parsed = parseFloat(alertBandStr.replace(/[^0-9.-]/g, ''));
    if (!isNaN(parsed)) alertThreshold = parsed;
  }

  if (polarity === 'maior_melhor') {
    if (val >= target) return 'dentro_da_meta';
    if (alertThreshold !== null) {
      if (val < alertThreshold) return 'critico';
      return 'atencao';
    }
    return val >= target * 0.9 ? 'atencao' : 'critico';
  } else {
    // menor_melhor
    if (val <= target) return 'dentro_da_meta';
    if (alertThreshold !== null) {
      if (val > alertThreshold) return 'critico';
      return 'atencao';
    }
    return val <= target * 1.1 ? 'atencao' : 'critico';
  }
}

/**
 * Calcula a tendência comparando a última medição com a anterior
 */
export function calculateTrend(measurements: IndicatorMeasurement[]): IndicatorTrend {
  if (!measurements || measurements.length < 2) return 'stable';
  const last = parseFloat(measurements[measurements.length - 1].measuredValue.replace(/[^0-9.-]/g, ''));
  const prev = parseFloat(measurements[measurements.length - 2].measuredValue.replace(/[^0-9.-]/g, ''));
  if (isNaN(last) || isNaN(prev) || last === prev) return 'stable';
  return last > prev ? 'up' : 'down';
}

/**
 * Calcula o status de atualização com base na periodicidade e prazos
 */
export function calculateUpdateStatus(
  measurements?: IndicatorMeasurement[],
  periodicity: string = 'Mensal',
  deadlineDays: number = 10
): { updateStatus: IndicatorUpdateStatus; delayMessage?: string } {
  if (!measurements || measurements.length === 0) {
    return { updateStatus: 'sem_medicao', delayMessage: 'Este indicador ainda não possui medições.' };
  }

  const latest = measurements[measurements.length - 1];
  const lastPeriod = latest.referencePeriod;

  // No cenário de demonstração simulado (referência: Setembro de 2026)
  if (lastPeriod.includes('2026-09') || lastPeriod.toLowerCase().includes('setembro')) {
    return { updateStatus: 'atualizado' };
  } else if (lastPeriod.includes('2026-08') || lastPeriod.toLowerCase().includes('agosto')) {
    return { updateStatus: 'pendente', delayMessage: 'Medição de setembro ainda em período de lançamento.' };
  } else {
    return { updateStatus: 'em_atraso', delayMessage: 'Medição de agosto ainda não registrada.' };
  }
}

// Initial indicators seed enriched with structured measurements
export const INITIAL_BUSINESS_INDICATORS: BusinessIndicator[] = [
  // 1. SLA de Fechamento de Vendas (Atualizado - Gestão Comercial)
  {
    id: 'ind-bus-sla-comercial',
    type: 'business',
    name: 'SLA de Fechamento de Vendas',
    objective: 'Acompanhar o cumprimento dos prazos acordados da proposta ao fechamento',
    formula: '(Casos concluídos no SLA ÷ Casos concluídos) × 100',
    unit: '%',
    currentValue: '92',
    target: '95',
    alertBand: '< 90%',
    periodicity: 'Mensal',
    trend: 'up',
    status: 'dentro_da_meta',
    updateStatus: 'atualizado',
    valueSource: 'proprio',
    responsible: 'Mariana Vasconcelos (Gerente Comercial)',
    source: 'Atualização manual',
    scope: 'Gestão Comercial',
    category: 'Prazo/SLA',
    polarity: 'maior_melhor',
    aggregationRule: 'percentual_recalculado',
    domainId: 'l1-gestao-comercial',
    updateDeadlineDays: 10,
    trackingStartDate: '2026-04-01',
    dataSourceType: 'manual',
    lastMeasurementDate: '2026-09-15',
    lastMeasurementPeriod: 'Setembro/2026',
    measurementHistory: [
      { date: '2026-04', value: '88' },
      { date: '2026-05', value: '89' },
      { date: '2026-06', value: '90' },
      { date: '2026-07', value: '91' },
      { date: '2026-08', value: '91' },
      { date: '2026-09', value: '92' }
    ],
    measurements: [
      { id: 'm-sla-1', indicatorId: 'ind-bus-sla-comercial', referencePeriod: '2026-04', measuredValue: '88', targetApplied: '95', status: 'atencao', registeredAt: '2026-05-08', registeredBy: 'Mariana Vasconcelos', source: 'Atualização manual' },
      { id: 'm-sla-2', indicatorId: 'ind-bus-sla-comercial', referencePeriod: '2026-05', measuredValue: '89', targetApplied: '95', status: 'atencao', registeredAt: '2026-06-09', registeredBy: 'Mariana Vasconcelos', source: 'Atualização manual' },
      { id: 'm-sla-3', indicatorId: 'ind-bus-sla-comercial', referencePeriod: '2026-06', measuredValue: '90', targetApplied: '95', status: 'dentro_da_meta', registeredAt: '2026-07-07', registeredBy: 'Mariana Vasconcelos', source: 'Atualização manual' },
      { id: 'm-sla-4', indicatorId: 'ind-bus-sla-comercial', referencePeriod: '2026-07', measuredValue: '91', targetApplied: '95', status: 'dentro_da_meta', registeredAt: '2026-08-08', registeredBy: 'Mariana Vasconcelos', source: 'Atualização manual' },
      { id: 'm-sla-5', indicatorId: 'ind-bus-sla-comercial', referencePeriod: '2026-08', measuredValue: '91', targetApplied: '95', status: 'dentro_da_meta', registeredAt: '2026-09-06', registeredBy: 'Mariana Vasconcelos', source: 'Atualização manual' },
      { id: 'm-sla-6', indicatorId: 'ind-bus-sla-comercial', referencePeriod: '2026-09', measuredValue: '92', targetApplied: '95', status: 'dentro_da_meta', registeredAt: '2026-09-15', registeredBy: 'Mariana Vasconcelos', source: 'Atualização manual', comment: 'Fechamento de contas prioritárias no prazo acordado.' }
    ]
  },

  // 2. Tempo Médio de Ciclo Comercial (EM ATRASO - com última medição em Julho/2026)
  {
    id: 'ind-bus-tempo-ciclo',
    type: 'business',
    name: 'Tempo Médio de Ciclo Comercial',
    objective: 'Reduzir o lead time entre primeiro contato e assinatura do contrato',
    formula: 'Média ponderada dos dias de negociação por valor de oportunidade',
    unit: 'dias',
    currentValue: '18',
    target: '15',
    alertBand: '> 22 dias',
    periodicity: 'Mensal',
    trend: 'down',
    status: 'atencao',
    updateStatus: 'em_atraso',
    valueSource: 'proprio',
    responsible: 'Lucas Nogueira (Coordenador de Vendas)',
    source: 'Atualização manual',
    scope: 'Gestão Comercial',
    category: 'Eficiência',
    polarity: 'menor_melhor',
    aggregationRule: 'media_ponderada',
    domainId: 'l1-gestao-comercial',
    updateDeadlineDays: 10,
    trackingStartDate: '2026-04-01',
    dataSourceType: 'manual',
    lastMeasurementDate: '2026-07-10',
    lastMeasurementPeriod: 'Julho/2026',
    measurementHistory: [
      { date: '2026-04', value: '25' },
      { date: '2026-05', value: '23' },
      { date: '2026-06', value: '21' },
      { date: '2026-07', value: '18' }
    ],
    measurements: [
      { id: 'm-ciclo-1', indicatorId: 'ind-bus-tempo-ciclo', referencePeriod: '2026-04', measuredValue: '25', targetApplied: '15', status: 'critico', registeredAt: '2026-05-09', registeredBy: 'Lucas Nogueira', source: 'Atualização manual' },
      { id: 'm-ciclo-2', indicatorId: 'ind-bus-tempo-ciclo', referencePeriod: '2026-05', measuredValue: '23', targetApplied: '15', status: 'critico', registeredAt: '2026-06-08', registeredBy: 'Lucas Nogueira', source: 'Atualização manual' },
      { id: 'm-ciclo-3', indicatorId: 'ind-bus-tempo-ciclo', referencePeriod: '2026-06', measuredValue: '21', targetApplied: '15', status: 'atencao', registeredAt: '2026-07-06', registeredBy: 'Lucas Nogueira', source: 'Atualização manual' },
      { id: 'm-ciclo-4', indicatorId: 'ind-bus-tempo-ciclo', referencePeriod: '2026-07', measuredValue: '18', targetApplied: '15', status: 'atencao', registeredAt: '2026-07-10', registeredBy: 'Lucas Nogueira', source: 'Atualização manual', comment: 'Gargalo em validações de alçadas pendentes.' }
    ]
  },

  // 3. Volume Total Faturado (Consolidado automático)
  {
    id: 'ind-bus-volume-vendas',
    type: 'business',
    name: 'Volume Total Faturado',
    objective: 'Monitorar o montante financeiro total faturado no período',
    formula: '∑ Valor dos pedidos aprovados no ERP',
    unit: 'R$',
    currentValue: '14.2M',
    target: '15.0M',
    alertBand: '< 12.0M',
    periodicity: 'Mensal',
    trend: 'up',
    status: 'dentro_da_meta',
    updateStatus: 'atualizado',
    valueSource: 'consolidado',
    responsible: 'Mariana Vasconcelos (Gerente Comercial)',
    source: 'ERP Financeiro SAP',
    scope: 'Gestão Comercial',
    category: 'Volume',
    polarity: 'maior_melhor',
    aggregationRule: 'soma',
    domainId: 'l1-gestao-comercial',
    updateDeadlineDays: 10,
    trackingStartDate: '2026-04-01',
    dataSourceType: 'calculado',
    lastMeasurementDate: '2026-09-14',
    lastMeasurementPeriod: 'Setembro/2026',
    measurementHistory: [
      { date: '2026-04', value: '11.8M' },
      { date: '2026-05', value: '12.5M' },
      { date: '2026-06', value: '13.1M' },
      { date: '2026-07', value: '13.6M' },
      { date: '2026-08', value: '13.9M' },
      { date: '2026-09', value: '14.2M' }
    ],
    measurements: [
      { id: 'm-vol-1', indicatorId: 'ind-bus-volume-vendas', referencePeriod: '2026-04', measuredValue: '11.8M', targetApplied: '15.0M', status: 'atencao', registeredAt: '2026-05-05', registeredBy: 'Sistema ERP', source: 'Consolidação Automática' },
      { id: 'm-vol-2', indicatorId: 'ind-bus-volume-vendas', referencePeriod: '2026-05', measuredValue: '12.5M', targetApplied: '15.0M', status: 'dentro_da_meta', registeredAt: '2026-06-05', registeredBy: 'Sistema ERP', source: 'Consolidação Automática' },
      { id: 'm-vol-3', indicatorId: 'ind-bus-volume-vendas', referencePeriod: '2026-06', measuredValue: '13.1M', targetApplied: '15.0M', status: 'dentro_da_meta', registeredAt: '2026-07-05', registeredBy: 'Sistema ERP', source: 'Consolidação Automática' },
      { id: 'm-vol-4', indicatorId: 'ind-bus-volume-vendas', referencePeriod: '2026-07', measuredValue: '13.6M', targetApplied: '15.0M', status: 'dentro_da_meta', registeredAt: '2026-08-05', registeredBy: 'Sistema ERP', source: 'Consolidação Automática' },
      { id: 'm-vol-5', indicatorId: 'ind-bus-volume-vendas', referencePeriod: '2026-08', measuredValue: '13.9M', targetApplied: '15.0M', status: 'dentro_da_meta', registeredAt: '2026-09-05', registeredBy: 'Sistema ERP', source: 'Consolidação Automática' },
      { id: 'm-vol-6', indicatorId: 'ind-bus-volume-vendas', referencePeriod: '2026-09', measuredValue: '14.2M', targetApplied: '15.0M', status: 'dentro_da_meta', registeredAt: '2026-09-14', registeredBy: 'Sistema ERP', source: 'Consolidação Automática' }
    ]
  },

  // 4. Taxa de Conversão de Propostas (Atualizado)
  {
    id: 'ind-bus-conversao-propostas',
    type: 'business',
    name: 'Taxa de Conversão de Propostas',
    objective: 'Acompanhar a eficiência na conversão de propostas enviadas em contratos',
    formula: '(Contratos assinados ÷ Propostas apresentadas) × 100',
    unit: '%',
    currentValue: '34',
    target: '30',
    alertBand: '< 25%',
    periodicity: 'Mensal',
    trend: 'up',
    status: 'dentro_da_meta',
    updateStatus: 'atualizado',
    valueSource: 'proprio',
    responsible: 'Lucas Nogueira (Coordenador de Vendas)',
    source: 'Atualização manual',
    scope: 'Gestão Comercial',
    category: 'Resultado',
    polarity: 'maior_melhor',
    aggregationRule: 'percentual_recalculado',
    domainId: 'l1-gestao-comercial',
    updateDeadlineDays: 10,
    trackingStartDate: '2026-04-01',
    dataSourceType: 'manual',
    lastMeasurementDate: '2026-09-12',
    lastMeasurementPeriod: 'Setembro/2026',
    measurementHistory: [
      { date: '2026-04', value: '27' },
      { date: '2026-05', value: '29' },
      { date: '2026-06', value: '31' },
      { date: '2026-07', value: '32' },
      { date: '2026-08', value: '33' },
      { date: '2026-09', value: '34' }
    ],
    measurements: [
      { id: 'm-conv-1', indicatorId: 'ind-bus-conversao-propostas', referencePeriod: '2026-04', measuredValue: '27', targetApplied: '30', status: 'atencao', registeredAt: '2026-05-08', registeredBy: 'Lucas Nogueira', source: 'Atualização manual' },
      { id: 'm-conv-2', indicatorId: 'ind-bus-conversao-propostas', referencePeriod: '2026-05', measuredValue: '29', targetApplied: '30', status: 'atencao', registeredAt: '2026-06-08', registeredBy: 'Lucas Nogueira', source: 'Atualização manual' },
      { id: 'm-conv-3', indicatorId: 'ind-bus-conversao-propostas', referencePeriod: '2026-06', measuredValue: '31', targetApplied: '30', status: 'dentro_da_meta', registeredAt: '2026-07-08', registeredBy: 'Lucas Nogueira', source: 'Atualização manual' },
      { id: 'm-conv-4', indicatorId: 'ind-bus-conversao-propostas', referencePeriod: '2026-07', measuredValue: '32', targetApplied: '30', status: 'dentro_da_meta', registeredAt: '2026-08-08', registeredBy: 'Lucas Nogueira', source: 'Atualização manual' },
      { id: 'm-conv-5', indicatorId: 'ind-bus-conversao-propostas', referencePeriod: '2026-08', measuredValue: '33', targetApplied: '30', status: 'dentro_da_meta', registeredAt: '2026-09-08', registeredBy: 'Lucas Nogueira', source: 'Atualização manual' },
      { id: 'm-conv-6', indicatorId: 'ind-bus-conversao-propostas', referencePeriod: '2026-09', measuredValue: '34', targetApplied: '30', status: 'dentro_da_meta', registeredAt: '2026-09-12', registeredBy: 'Lucas Nogueira', source: 'Atualização manual' }
    ]
  },

  // 5. Saving de Compras (Suprimentos)
  {
    id: 'ind-bus-saving',
    type: 'business',
    name: 'Saving de Compras',
    objective: 'Aumentar a economia nas compras homologadas',
    formula: 'Valor Orçado - Valor Negociado',
    unit: 'R$',
    currentValue: '1.2M',
    target: '2.0M',
    alertBand: '< 1.0M',
    periodicity: 'Mensal',
    trend: 'down',
    status: 'atencao',
    updateStatus: 'atualizado',
    valueSource: 'proprio',
    responsible: 'Diretor de Suprimentos',
    source: 'Atualização manual',
    scope: 'Suprimentos e Logística',
    category: 'Custo',
    polarity: 'maior_melhor',
    aggregationRule: 'soma',
    domainId: 'l1-suprimentos',
    updateDeadlineDays: 10,
    trackingStartDate: '2026-04-01',
    dataSourceType: 'manual',
    lastMeasurementDate: '2026-09-10',
    lastMeasurementPeriod: 'Setembro/2026',
    measurementHistory: [
      { date: '2026-04', value: '0.8M' },
      { date: '2026-05', value: '0.9M' },
      { date: '2026-06', value: '1.1M' },
      { date: '2026-07', value: '1.5M' },
      { date: '2026-08', value: '1.0M' },
      { date: '2026-09', value: '1.2M' }
    ],
    measurements: [
      { id: 'm-sav-1', indicatorId: 'ind-bus-saving', referencePeriod: '2026-04', measuredValue: '0.8M', targetApplied: '2.0M', status: 'critico', registeredAt: '2026-05-09', registeredBy: 'Suprimentos Lead', source: 'Atualização manual' },
      { id: 'm-sav-2', indicatorId: 'ind-bus-saving', referencePeriod: '2026-05', measuredValue: '0.9M', targetApplied: '2.0M', status: 'critico', registeredAt: '2026-06-09', registeredBy: 'Suprimentos Lead', source: 'Atualização manual' },
      { id: 'm-sav-3', indicatorId: 'ind-bus-saving', referencePeriod: '2026-06', measuredValue: '1.1M', targetApplied: '2.0M', status: 'atencao', registeredAt: '2026-07-09', registeredBy: 'Suprimentos Lead', source: 'Atualização manual' },
      { id: 'm-sav-4', indicatorId: 'ind-bus-saving', referencePeriod: '2026-07', measuredValue: '1.5M', targetApplied: '2.0M', status: 'atencao', registeredAt: '2026-08-09', registeredBy: 'Suprimentos Lead', source: 'Atualização manual' },
      { id: 'm-sav-5', indicatorId: 'ind-bus-saving', referencePeriod: '2026-08', measuredValue: '1.0M', targetApplied: '2.0M', status: 'atencao', registeredAt: '2026-09-09', registeredBy: 'Suprimentos Lead', source: 'Atualização manual' },
      { id: 'm-sav-6', indicatorId: 'ind-bus-saving', referencePeriod: '2026-09', measuredValue: '1.2M', targetApplied: '2.0M', status: 'atencao', registeredAt: '2026-09-10', registeredBy: 'Suprimentos Lead', source: 'Atualização manual' }
    ]
  },

  // 6. Exposição de Risco Trabalhista (Jurídico)
  {
    id: 'ind-bus-risco',
    type: 'business',
    name: 'Exposição de Risco Trabalhista',
    objective: 'Reduzir provisão financeira de contingências trabalhistas',
    formula: 'Soma do valor de causa de casos com prognóstico provável',
    unit: 'R$',
    currentValue: '35M',
    target: '30M',
    alertBand: '> 40M',
    periodicity: 'Trimestral',
    trend: 'stable',
    status: 'atencao',
    updateStatus: 'atualizado',
    valueSource: 'proprio',
    responsible: 'Diretor Jurídico',
    source: 'Atualização manual',
    scope: 'Jurídico',
    category: 'Risco',
    polarity: 'menor_melhor',
    aggregationRule: 'maior_valor',
    domainId: 'l1-juridico',
    updateDeadlineDays: 15,
    trackingStartDate: '2025-01-01',
    dataSourceType: 'manual',
    lastMeasurementDate: '2026-07-02',
    lastMeasurementPeriod: '2026-Q2',
    measurementHistory: [
      { date: '2025-Q1', value: '28M' },
      { date: '2025-Q2', value: '30M' },
      { date: '2025-Q3', value: '32M' },
      { date: '2025-Q4', value: '31M' },
      { date: '2026-Q1', value: '34M' },
      { date: '2026-Q2', value: '35M' }
    ],
    measurements: [
      { id: 'm-risco-1', indicatorId: 'ind-bus-risco', referencePeriod: '2025-Q1', measuredValue: '28M', targetApplied: '30M', status: 'dentro_da_meta', registeredAt: '2025-04-10', registeredBy: 'Jurídico', source: 'Atualização manual' },
      { id: 'm-risco-2', indicatorId: 'ind-bus-risco', referencePeriod: '2025-Q2', measuredValue: '30M', targetApplied: '30M', status: 'dentro_da_meta', registeredAt: '2025-07-10', registeredBy: 'Jurídico', source: 'Atualização manual' },
      { id: 'm-risco-3', indicatorId: 'ind-bus-risco', referencePeriod: '2025-Q3', measuredValue: '32M', targetApplied: '30M', status: 'atencao', registeredAt: '2025-10-10', registeredBy: 'Jurídico', source: 'Atualização manual' },
      { id: 'm-risco-4', indicatorId: 'ind-bus-risco', referencePeriod: '2025-Q4', measuredValue: '31M', targetApplied: '30M', status: 'atencao', registeredAt: '2026-01-10', registeredBy: 'Jurídico', source: 'Atualização manual' },
      { id: 'm-risco-5', indicatorId: 'ind-bus-risco', referencePeriod: '2026-Q1', measuredValue: '34M', targetApplied: '30M', status: 'atencao', registeredAt: '2026-04-10', registeredBy: 'Jurídico', source: 'Atualização manual' },
      { id: 'm-risco-6', indicatorId: 'ind-bus-risco', referencePeriod: '2026-Q2', measuredValue: '35M', targetApplied: '30M', status: 'atencao', registeredAt: '2026-07-02', registeredBy: 'Jurídico', source: 'Atualização manual' }
    ]
  }
];

export interface LogMeasurementInput {
  referencePeriod?: string;
  period?: string;
  measuredValue: string | number;
  registeredAt?: string;
  entryDate?: string;
  registeredBy?: string;
  comment?: string;
  evidence?: string;
}

export interface EditMeasurementInput {
  measuredValue?: string | number;
  comment?: string;
  evidence?: string;
  correctionReason: string;
}

interface IndicatorStoreState {
  indicators: BusinessIndicator[];
  addIndicator: (indicator: Omit<BusinessIndicator, 'id' | 'currentValue' | 'trend' | 'status' | 'updateStatus' | 'measurements' | 'measurementHistory'>) => string;
  updateIndicator: (id: string, updates: Partial<BusinessIndicator>) => void;
  deleteIndicator: (id: string) => void;
  logMeasurement: (indicatorId: string, input: LogMeasurementInput) => { measurementId: string; wasReplaced: boolean };
  editMeasurement: (indicatorId: string, measurementId: string, input: EditMeasurementInput) => void;
  resetToDefaults: () => void;
  getIndicatorsByDomain: (domainNameOrId: string) => BusinessIndicator[];
  getIndicatorsByProcess: (processIdOrName: string) => BusinessIndicator[];
  getIndicatorsByJourney: (journeyId: string) => BusinessIndicator[];
}

export const useIndicatorStore = create<IndicatorStoreState>()(
  persist(
    (set, get) => ({
      indicators: INITIAL_BUSINESS_INDICATORS,

      // ── CADASTRO DE INDICADOR (SEM VALOR ATUAL) ──────────────
      addIndicator: (newInd) => {
        const id = `ind-bus-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        
        const indicator: BusinessIndicator = {
          ...newInd,
          id,
          currentValue: 'Sem medição',
          trend: 'stable',
          status: 'sem_dados',
          updateStatus: 'sem_medicao',
          measurements: [],
          measurementHistory: []
        };

        set((state) => ({
          indicators: [indicator, ...state.indicators]
        }));

        return id;
      },

      // ── EDIÇÃO DA DEFINIÇÃO (PRESERVA MEDIÇÕES) ───────────────
      updateIndicator: (id, updates) => {
        set((state) => ({
          indicators: state.indicators.map((ind) => {
            if (ind.id !== id) return ind;
            const nextInd = { ...ind, ...updates };

            // Recalcular se periodicidade ou prazo mudaram
            if (nextInd.measurements && nextInd.measurements.length > 0) {
              const latest = nextInd.measurements[nextInd.measurements.length - 1];
              const { updateStatus } = calculateUpdateStatus(
                nextInd.measurements, 
                nextInd.periodicity, 
                nextInd.updateDeadlineDays
              );
              nextInd.updateStatus = updateStatus;
              nextInd.status = calculatePerformanceStatus(
                latest.measuredValue,
                nextInd.target,
                nextInd.alertBand,
                nextInd.polarity
              );
            }

            return nextInd;
          })
        }));
      },

      deleteIndicator: (id) => {
        set((state) => ({
          indicators: state.indicators.filter((ind) => ind.id !== id)
        }));
      },

      // ── LANÇAMENTO DE MEDIÇÃO PERIÓDICA ───────────────────────
      logMeasurement: (indicatorId, input) => {
        const state = get();
        const ind = state.indicators.find(i => i.id === indicatorId);
        if (!ind) throw new Error('Indicador não encontrado');

        const refPeriod = (input.referencePeriod || input.period || '').trim();
        const measuredValStr = String(input.measuredValue);
        const registeredAt = input.registeredAt || input.entryDate || new Date().toISOString().split('T')[0];
        const registeredBy = input.registeredBy || ind.responsible || 'Usuário Atual';

        const existingMeasurements = [...(ind.measurements || [])];
        const existingIndex = existingMeasurements.findIndex(
          m => (m.referencePeriod || m.period) === refPeriod
        );

        const status = calculatePerformanceStatus(
          measuredValStr,
          ind.target,
          ind.alertBand,
          ind.polarity
        );

        let wasReplaced = false;
        let measurementId = '';

        if (existingIndex >= 0) {
          // Substituir/atualizar medição existente do mesmo período
          wasReplaced = true;
          measurementId = existingMeasurements[existingIndex].id;
          existingMeasurements[existingIndex] = {
            ...existingMeasurements[existingIndex],
            referencePeriod: refPeriod,
            period: refPeriod,
            measuredValue: measuredValStr,
            targetApplied: ind.target,
            status,
            registeredAt,
            entryDate: registeredAt,
            registeredBy,
            comment: input.comment || existingMeasurements[existingIndex].comment,
            evidence: input.evidence || existingMeasurements[existingIndex].evidence
          };
        } else {
          // Nova medição
          measurementId = `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
          existingMeasurements.push({
            id: measurementId,
            indicatorId,
            referencePeriod: refPeriod,
            period: refPeriod,
            measuredValue: measuredValStr,
            targetApplied: ind.target,
            status,
            registeredAt,
            entryDate: registeredAt,
            registeredBy,
            source: ind.source || 'Atualização manual',
            comment: input.comment,
            evidence: input.evidence
          });
        }

        // Ordenar medições por período/data
        existingMeasurements.sort((a, b) => ((a.referencePeriod || a.period || '')).localeCompare(b.referencePeriod || b.period || ''));

        // Recalcular métricas derivadas do indicador
        const latest = existingMeasurements[existingMeasurements.length - 1];
        const trend = calculateTrend(existingMeasurements);
        const { updateStatus } = calculateUpdateStatus(existingMeasurements, ind.periodicity, ind.updateDeadlineDays);

        // Atualizar também measurementHistory para retrocompatibilidade
        const measurementHistory = existingMeasurements.map(m => ({
          date: m.referencePeriod || m.period || '',
          value: m.measuredValue
        }));

        set((s) => ({
          indicators: s.indicators.map((item) => {
            if (item.id !== indicatorId) return item;
            return {
              ...item,
              measurements: existingMeasurements,
              measurementHistory,
              currentValue: latest.measuredValue,
              status: latest.status,
              trend,
              updateStatus,
              lastMeasurementDate: latest.registeredAt || latest.entryDate,
              lastMeasurementPeriod: latest.referencePeriod || latest.period
            };
          })
        }));

        return { measurementId, wasReplaced };
      },

      // ── EDIÇÃO / CORREÇÃO DE MEDIÇÃO HISTÓRICA ────────────────
      editMeasurement: (indicatorId, measurementId, input) => {
        const state = get();
        const ind = state.indicators.find(i => i.id === indicatorId);
        if (!ind || !ind.measurements) return;

        const updatedMeasurements = ind.measurements.map(m => {
          if (m.id !== measurementId) return m;

          const newVal = input.measuredValue !== undefined ? String(input.measuredValue) : m.measuredValue;
          const status = calculatePerformanceStatus(
            newVal,
            m.targetApplied || ind.target,
            ind.alertBand,
            ind.polarity
          );

          return {
            ...m,
            measuredValue: newVal,
            status,
            comment: input.comment !== undefined ? input.comment : m.comment,
            evidence: input.evidence !== undefined ? input.evidence : m.evidence,
            correctionReason: input.correctionReason
          };
        });

        const latest = updatedMeasurements[updatedMeasurements.length - 1];
        const trend = calculateTrend(updatedMeasurements);
        const { updateStatus } = calculateUpdateStatus(updatedMeasurements, ind.periodicity, ind.updateDeadlineDays);
        const measurementHistory = updatedMeasurements.map(m => ({
          date: m.referencePeriod || m.period || '',
          value: m.measuredValue
        }));

        set((s) => ({
          indicators: s.indicators.map((item) => {
            if (item.id !== indicatorId) return item;
            return {
              ...item,
              measurements: updatedMeasurements,
              measurementHistory,
              currentValue: latest.measuredValue,
              status: latest.status,
              trend,
              updateStatus,
              lastMeasurementDate: latest.registeredAt || latest.entryDate,
              lastMeasurementPeriod: latest.referencePeriod || latest.period
            };
          })
        }));
      },

      resetToDefaults: () => {
        set({ indicators: INITIAL_BUSINESS_INDICATORS });
      },

      getIndicatorsByDomain: (domainNameOrId) => {
        const state = get();
        const term = domainNameOrId.toLowerCase().trim();
        return state.indicators.filter((i) => 
          (i.domainId && i.domainId.toLowerCase() === term) ||
          (i.scope && i.scope.toLowerCase().includes(term)) ||
          term.includes(i.scope ? i.scope.toLowerCase() : '')
        );
      },

      getIndicatorsByProcess: (processIdOrName) => {
        const state = get();
        const term = processIdOrName.toLowerCase().trim();
        return state.indicators.filter((i) => 
          (i.processId && i.processId.toLowerCase() === term) ||
          (i.processName && i.processName.toLowerCase().includes(term)) ||
          (i.scope && i.scope.toLowerCase().includes(term)) ||
          term.includes(i.scope ? i.scope.toLowerCase() : '')
        );
      },

      getIndicatorsByJourney: (journeyId) => {
        const state = get();
        return state.indicators.filter((i) => i.journeyId === journeyId);
      }
    }),
    {
      name: 'business-indicators-storage',
      version: 3
    }
  )
);
