import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, Clock, Plus, ArrowLeft, History, PenSquare, 
  Trash2, Info, AlertCircle, TrendingDown, CheckCircle2, ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  LineChart, Line, ResponsiveContainer, YAxis, ReferenceLine, Tooltip 
} from "recharts";
import { BusinessIndicator } from "@/types/architectureContextTypes";
import { toast } from "sonner";

// Mock history data for charts
const generateMockHistory = (baseValue: number, trend: 'up'|'down'|'stable') => {
  return [
    { month: "2026-04", value: baseValue - (trend === 'up' ? 5 : trend === 'down' ? -5 : 1) },
    { month: "2026-05", value: baseValue - (trend === 'up' ? 4 : trend === 'down' ? -4 : -1) },
    { month: "2026-06", value: baseValue - (trend === 'up' ? 2 : trend === 'down' ? -2 : 0) },
    { month: "2026-07", value: baseValue - (trend === 'up' ? 1 : trend === 'down' ? -1 : 1) },
    { month: "2026-08", value: baseValue },
    { month: "2026-09", value: baseValue + (trend === 'up' ? 1 : trend === 'down' ? -1 : 0) },
  ];
};

export interface ArchitectureIndicatorsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  levelLabel: string;
  indicators: BusinessIndicator[];
}

export function ArchitectureIndicatorsModal({
  isOpen,
  onOpenChange,
  levelLabel,
  indicators: initialIndicators
}: ArchitectureIndicatorsModalProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  
  const [view, setView] = useState<'list' | 'history' | 'add_indicator' | 'add_measurement'>('list');
  const [selectedInd, setSelectedInd] = useState<BusinessIndicator | null>(null);

  // Extend mock indicators with history data
  const indicatorsWithHistory = initialIndicators.map(ind => {
    const val = parseFloat(ind.currentValue.replace(/[^0-9.-]+/g,""));
    return {
      ...ind,
      history: generateMockHistory(val || 50, ind.status === 'dentro_da_meta' ? 'up' : ind.status === 'critico' ? 'down' : 'stable')
    };
  });

  const handleOpenHistory = (ind: any) => {
    setSelectedInd(ind);
    setView('history');
  };

  const handleOpenAddMeasurement = (ind: any) => {
    setSelectedInd(ind);
    setView('add_measurement');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedInd(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setTimeout(() => handleBackToList(), 200);
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden bg-[#F5F7FB] border-[#DFE5EF] shadow-2xl h-[90vh] flex flex-col rounded-xl">
        
        {/* === LIST VIEW === */}
        {view === 'list' && (
          <div className="flex flex-col h-full">
            <div className="bg-white border-b border-[#DFE5EF] p-5 px-8 flex items-center justify-between shadow-sm z-10">
              <div>
                <h2 className="text-xl font-bold text-[#15233B] flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#1327b9]" />
                  {pt ? "Painel de Indicadores" : "Indicators Dashboard"}
                </h2>
                <p className="text-sm text-[#71809A] mt-1">
                  {pt ? "Gerenciamento e medição de KPIs vinculados a: " : "Management and measurement of KPIs linked to: "} 
                  <strong className="text-[#1327b9]">{levelLabel}</strong>
                </p>
              </div>
              <Button onClick={() => setView('add_indicator')} className="bg-[#1327b9] hover:bg-[#2743D7] text-white h-10 px-5 rounded-lg shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                {pt ? "Adicionar Indicador" : "Add Indicator"}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {indicatorsWithHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                  <div className="w-16 h-16 rounded-full bg-white border border-[#DFE5EF] flex items-center justify-center mb-4 shadow-sm">
                    <TrendingUp className="h-8 w-8 text-[#A5A7B0]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#15233B] mb-2">
                    {pt ? "Nenhum indicador cadastrado" : "No indicators registered"}
                  </h3>
                  <p className="text-sm text-[#71809A] mb-6">
                    {pt ? "Cadastre KPIs estratégicos ou operacionais para acompanhar o desempenho deste nível da arquitetura." : "Register strategic or operational KPIs to track the performance of this architecture level."}
                  </p>
                  <Button onClick={() => setView('add_indicator')} className="bg-[#1327b9] hover:bg-[#2743D7] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    {pt ? "Criar meu primeiro indicador" : "Create my first indicator"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                  {indicatorsWithHistory.map((ind, idx) => (
                    <div key={idx} className="bg-white border border-[#DFE5EF] rounded-xl shadow-[0_4px_16px_rgba(20,35,70,0.04)] overflow-hidden flex flex-col">
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="bg-[#E3FAEF] text-[#008B5C] border-none text-[9px] uppercase font-bold tracking-wider rounded-sm px-1.5 py-0.5">
                            OPERACIONAL
                          </Badge>
                          <Badge variant="outline" className={cn(
                            "border-none text-[9px] uppercase font-bold tracking-wider rounded-sm px-2 py-0.5 shadow-sm",
                            ind.status === 'dentro_da_meta' ? "bg-[#E3FAEF] text-[#008B5C]" :
                            ind.status === 'atencao' ? "bg-[#FFF2D2] text-[#B97100]" :
                            "bg-[#FFEAEA] text-[#E2484E]"
                          )}>
                            {ind.status === 'dentro_da_meta' ? 'META ATINGIDA' : ind.status === 'atencao' ? 'ATENÇÃO' : 'CRÍTICO'}
                          </Badge>
                        </div>
                        <h4 className="text-[15px] font-bold text-[#15233B] mb-1 leading-tight line-clamp-1">{ind.name}</h4>
                        <p className="text-xs text-[#71809A] line-clamp-2 mb-4 h-8">
                          Acompanhar o cumprimento das metas estabelecidas para este processo.
                        </p>

                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-[10px] text-[#A5A7B0] font-bold uppercase tracking-wider mb-1">MENSAL</div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-[#15233B] leading-none">{ind.currentValue}</span>
                              <span className="text-sm font-semibold text-[#15233B] leading-none">{ind.unit || ''}</span>
                              {ind.status === 'dentro_da_meta' ? (
                                <TrendingUp className="h-3.5 w-3.5 text-[#008B5C] ml-1" />
                              ) : (
                                <TrendingDown className="h-3.5 w-3.5 text-[#E2484E] ml-1" />
                              )}
                            </div>
                            <div className="text-[11px] text-[#71809A] mt-1 font-medium">Meta: {ind.target}</div>
                          </div>
                          
                          {/* Mini Sparkline */}
                          <div className="h-10 w-24 relative -mb-1 opacity-70">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={ind.history}>
                                <Line 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke={ind.status === 'dentro_da_meta' ? '#008B5C' : ind.status === 'atencao' ? '#ED9C12' : '#E2484E'} 
                                  strokeWidth={2} 
                                  dot={false}
                                  isAnimationActive={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#F9FAFC] border-t border-[#DFE5EF] p-3 px-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleOpenHistory(ind)}
                            className="h-8 text-xs font-semibold bg-white border-[#CFD7E6] text-[#4D5A72] hover:text-[#1327b9] hover:border-[#1327b9] rounded-md px-3 shadow-sm"
                          >
                            <History className="h-3.5 w-3.5 mr-1.5" /> Histórico
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleOpenAddMeasurement(ind)}
                            className="h-8 text-xs font-semibold bg-[#1327b9] hover:bg-[#2743D7] text-white rounded-md px-3 shadow-sm"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1.5" /> Medição
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 text-[#A5A7B0]">
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-[#15233B] rounded-md"><PenSquare className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-[#E2484E] rounded-md"><Trash2 className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-[#15233B] rounded-md"><Info className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* === HISTORY VIEW === */}
        {view === 'history' && selectedInd && (
          <div className="flex flex-col h-full bg-white">
            <div className="border-b border-[#DFE5EF] p-4 px-6 flex items-center justify-between z-10 bg-white">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBackToList} className="h-9 w-9 rounded-full bg-[#F5F7FB] hover:bg-[#E8EDFF] hover:text-[#1327b9]">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <History className="h-4 w-4 text-[#1327b9]" />
                    <h2 className="text-lg font-bold text-[#15233B]">{selectedInd.name}</h2>
                  </div>
                  <p className="text-xs text-[#71809A]">Acompanhar o cumprimento das metas estabelecidas</p>
                </div>
              </div>
              <Button onClick={() => setView('add_measurement')} className="bg-[#1327b9] hover:bg-[#2743D7] text-white h-9 px-4 rounded-lg shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Lançar Medição
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Header Stats */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 min-w-[140px] shadow-[0_2px_8px_rgba(20,35,70,0.02)]">
                  <div className="text-[10px] font-bold text-[#8A96A9] uppercase mb-1">VALOR ATUAL</div>
                  <div className="text-2xl font-black text-[#15233B]">{selectedInd.currentValue} <span className="text-sm font-semibold">{selectedInd.unit}</span></div>
                </div>
                <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 min-w-[140px] shadow-[0_2px_8px_rgba(20,35,70,0.02)]">
                  <div className="text-[10px] font-bold text-[#8A96A9] uppercase mb-1">META</div>
                  <div className="text-2xl font-black text-[#1327b9]">{selectedInd.target}</div>
                </div>
                <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 min-w-[140px] shadow-[0_2px_8px_rgba(20,35,70,0.02)]">
                  <div className="text-[10px] font-bold text-[#8A96A9] uppercase mb-1">VARIAÇÃO</div>
                  <div className="text-lg font-bold text-[#008B5C] flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4" /> Evolução
                  </div>
                </div>
                <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 min-w-[140px] shadow-[0_2px_8px_rgba(20,35,70,0.02)]">
                  <div className="text-[10px] font-bold text-[#8A96A9] uppercase mb-2">DESEMPENHO</div>
                  <Badge variant="outline" className="bg-[#E3FAEF] text-[#008B5C] border-none text-[11px] font-bold px-2 py-0.5 rounded-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Meta atingida
                  </Badge>
                </div>
                <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 min-w-[140px] shadow-[0_2px_8px_rgba(20,35,70,0.02)]">
                  <div className="text-[10px] font-bold text-[#8A96A9] uppercase mb-1">ÚLTIMA MEDIÇÃO</div>
                  <div className="text-sm font-semibold text-[#15233B] mt-1">Setembro/2026</div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white border border-[#DFE5EF] rounded-xl p-5 shadow-[0_4px_16px_rgba(20,35,70,0.03)]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[11px] font-bold text-[#4D5A72] uppercase tracking-wider">Evolução Histórica das Medições</h3>
                  <div className="flex items-center gap-4 text-[11px] font-semibold text-[#71809A]">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#1327b9] rounded-full"></span> Valor Realizado</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#E2484E] rounded-full border border-dashed border-[#E2484E]"></span> Meta ({selectedInd.target})</span>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={(selectedInd as any).history} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                      <ReferenceLine y={parseFloat(selectedInd.target.replace(/[^0-9.-]+/g,""))} stroke="#E2484E" strokeDasharray="3 3" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #DFE5EF', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ fontSize: '10px', color: '#8A96A9', marginBottom: '4px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#1327b9" 
                        strokeWidth={2.5}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#1327b9' }}
                        activeDot={{ r: 6, fill: '#1327b9' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Audit Table */}
              <div className="bg-white border border-[#DFE5EF] rounded-xl shadow-[0_4px_16px_rgba(20,35,70,0.03)] overflow-hidden">
                <div className="p-4 border-b border-[#DFE5EF] flex justify-between items-center bg-[#FAFCFF]">
                  <h3 className="text-sm font-bold text-[#15233B] flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#71809A]" /> Registro de Medições e Auditoria
                  </h3>
                  <span className="text-xs text-[#8A96A9]">6 registro(s)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white text-[#71809A] font-semibold uppercase text-[10px] tracking-wider border-b border-[#DFE5EF]">
                      <tr>
                        <th className="py-3 px-4 w-24">Período</th>
                        <th className="py-3 px-4 w-28">Valor Medido</th>
                        <th className="py-3 px-4 w-28">Lançamento</th>
                        <th className="py-3 px-4 w-40">Responsável</th>
                        <th className="py-3 px-4">Justificativa / Comentário</th>
                        <th className="py-3 px-4 w-24">Evidência</th>
                        <th className="py-3 px-4 w-20 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F3F8]">
                      {(selectedInd as any).history.slice().reverse().map((hist: any, i: number) => (
                        <tr key={i} className="hover:bg-[#F9FAFC] transition-colors">
                          <td className="py-3 px-4 font-bold text-[#15233B]">{hist.month}</td>
                          <td className="py-3 px-4 font-bold text-[#1327b9]">{hist.value} {selectedInd.unit}</td>
                          <td className="py-3 px-4 text-[#71809A]">{hist.month}-15</td>
                          <td className="py-3 px-4 font-medium text-[#4D5A72]">Mariana Vasconcelos</td>
                          <td className="py-3 px-4 text-[#71809A] truncate max-w-[200px]">
                            {i === 0 ? "Fechamento de contas prioritárias no prazo..." : "-"}
                          </td>
                          <td className="py-3 px-4 text-[#71809A]">-</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-semibold text-[#4D5A72] hover:text-[#1327b9] px-2">
                              <PenSquare className="h-3 w-3 mr-1" /> Corrigir
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === ADD MEASUREMENT VIEW === */}
        {view === 'add_measurement' && selectedInd && (
          <div className="flex flex-col h-full bg-[#F5F7FB]">
            <div className="bg-white border-b border-[#DFE5EF] p-4 flex justify-between items-center z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setView('history')} className="h-8 w-8 rounded-full bg-[#F5F7FB] hover:bg-[#E8EDFF]">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-bold text-[#15233B] flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#1327b9]" />
                  Lançar Medição de Indicador
                </h2>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                  <Trash2 className="h-4 w-4 text-[#8A96A9]" />
                </Button>
              </DialogClose>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex justify-center">
              <div className="bg-white border border-[#DFE5EF] rounded-xl shadow-[0_4px_16px_rgba(20,35,70,0.04)] p-6 max-w-2xl w-full">
                
                {/* Indicator info card */}
                <div className="bg-[#F9FAFC] border border-[#DFE5EF] rounded-lg p-4 mb-6 flex flex-wrap gap-x-8 gap-y-4">
                  <div className="w-full mb-1">
                    <h3 className="text-sm font-bold text-[#15233B] flex justify-between">
                      {selectedInd.name}
                      <Badge variant="secondary" className="bg-[#E8EDFF] text-[#1327b9] hover:bg-[#E8EDFF]">Prazo/SLA</Badge>
                    </h3>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8A96A9] font-bold uppercase mb-1">META</div>
                    <div className="text-sm font-black text-[#15233B]">{selectedInd.target}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8A96A9] font-bold uppercase mb-1">UNIDADE</div>
                    <div className="text-sm font-black text-[#15233B]">{selectedInd.unit || '%'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8A96A9] font-bold uppercase mb-1">PERIODICIDADE</div>
                    <div className="text-sm font-black text-[#15233B]">Mensal</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8A96A9] font-bold uppercase mb-1">POLARIDADE</div>
                    <div className="text-sm font-black text-[#15233B] flex items-center gap-1"><TrendingUp className="h-3 w-3"/> Maior melhor</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4D5A72]">Período de Referência *</label>
                    <Input defaultValue="2026-09" className="h-10 text-sm font-medium border-[#CFD7E6] focus-visible:ring-[#1327b9]" />
                    <span className="text-[10px] text-[#8A96A9]">Formato: AAAA-MM</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4D5A72]">Valor Realizado / Medido ({selectedInd.unit || '%'}) *</label>
                    <Input placeholder="Ex: 92 ou 14.5" className="h-10 text-sm border-[#CFD7E6] focus-visible:ring-[#1327b9]" />
                    <span className="text-[10px] text-[#8A96A9]">Meta estabelecida: {selectedInd.target}</span>
                  </div>
                </div>

                <div className="bg-[#FFFDF9] border border-[#ED9C12] rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-bold text-[#B97100] flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" /> Atenção: Já existe medição cadastrada para este período!
                  </h4>
                  <p className="text-xs text-[#9B5F00] mb-3">
                    Valor atual do período (2026-09): {selectedInd.currentValue}. Registrado por Mariana Vasconcelos.
                  </p>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#7A4B00] cursor-pointer">
                    <input type="checkbox" className="rounded border-[#ED9C12] text-[#ED9C12] focus:ring-[#ED9C12]" />
                    Desejo sobrescrever a medição deste período com o novo valor
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4D5A72]">Data do Lançamento</label>
                    <Input defaultValue="22/09/2026" className="h-10 text-sm border-[#CFD7E6]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4D5A72]">Responsável pelo Lançamento</label>
                    <Input defaultValue="Mariana Vasconcelos (Gerente)" disabled className="h-10 text-sm bg-gray-50 border-[#CFD7E6]" />
                  </div>
                </div>

                <div className="space-y-1.5 mb-5">
                  <label className="text-xs font-bold text-[#4D5A72]">Comentário / Justificativa do Resultado</label>
                  <textarea 
                    className="w-full min-h-[100px] border border-[#CFD7E6] rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1327b9] focus:border-transparent resize-y"
                    placeholder="Explique o contexto do resultado, fatores atípicos, planos de ação..."
                  ></textarea>
                </div>

                <div className="space-y-1.5 mb-8">
                  <label className="text-xs font-bold text-[#4D5A72]">Link ou Referência de Evidência (opcional)</label>
                  <Input placeholder="Ex: Relatório mensal CRM ref #84920" className="h-10 text-sm border-[#CFD7E6] focus-visible:ring-[#1327b9]" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#DFE5EF]">
                  <Button variant="outline" onClick={() => setView('history')} className="border-[#CFD7E6] text-[#4D5A72] h-10 px-6 font-semibold">
                    Cancelar
                  </Button>
                  <Button onClick={() => {toast.success("Medição salva com sucesso!"); setView('history');}} className="bg-[#1327b9] hover:bg-[#2743D7] text-white h-10 px-6 font-semibold">
                    Salvar Medição
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === ADD INDICATOR VIEW === */}
        {view === 'add_indicator' && (
          <div className="flex flex-col h-full bg-[#F5F7FB]">
            <div className="bg-white border-b border-[#DFE5EF] p-4 flex justify-between items-center z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setView('list')} className="h-8 w-8 rounded-full bg-[#F5F7FB] hover:bg-[#E8EDFF]">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-bold text-[#15233B] flex items-center gap-2">
                  <Plus className="h-5 w-5 text-[#1327b9]" />
                  Adicionar Indicador de Negócio
                </h2>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                  <Trash2 className="h-4 w-4 text-[#8A96A9]" />
                </Button>
              </DialogClose>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex justify-center">
              <div className="bg-white border border-[#DFE5EF] rounded-xl shadow-[0_4px_16px_rgba(20,35,70,0.04)] p-6 max-w-2xl w-full">
                
                <div className="grid grid-cols-3 gap-5 mb-5">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-[#4D5A72]">Nome do Indicador *</label>
                    <Input placeholder="Ex: Percentual de SLA cumprido" className="h-10 text-sm border-[#1327b9] ring-1 ring-[#1327b9] focus-visible:ring-[#1327b9]" />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold text-[#4D5A72]">Tipo / Categoria</label>
                    <select className="w-full h-10 border border-[#CFD7E6] rounded-md px-3 text-sm focus:outline-none focus:border-[#1327b9]">
                      <option>Prazo/SLA</option>
                      <option>Qualidade</option>
                      <option>Custo</option>
                      <option>Volume</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 mb-5">
                  <label className="text-xs font-bold text-[#4D5A72]">Objetivo Estratégico ou Operacional</label>
                  <textarea 
                    className="w-full h-20 border border-[#CFD7E6] rounded-md p-3 text-sm focus:outline-none focus:border-[#1327b9] resize-none"
                    placeholder="Acompanhar o cumprimento dos prazos acordados..."
                  ></textarea>
                </div>

                <div className="space-y-1.5 mb-6">
                  <label className="text-xs font-bold text-[#4D5A72]">Fórmula de Cálculo</label>
                  <Input placeholder="Ex: (Casos concluídos no prazo ÷ Total de casos) × 100" className="h-10 text-sm border-[#CFD7E6]" />
                </div>

                <div className="bg-[#E8EDFF] border border-[#C6D2FF] rounded-lg p-3 px-4 flex items-center gap-3 mb-6">
                  <Info className="h-5 w-5 text-[#1327b9] shrink-0" />
                  <p className="text-xs text-[#1A2A48] font-medium leading-relaxed">
                    <strong className="text-[#1327b9]">Atenção:</strong> O valor atual e o status de desempenho são derivados diretamente dos lançamentos periódicos de medição que você fará no sistema.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-5 mb-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4D5A72]">Meta de Desempenho *</label>
                    <Input placeholder="Ex: 95% ou 15 dias" className="h-10 text-sm border-[#CFD7E6]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4D5A72]">Unidade de Medida</label>
                    <Input placeholder="%" className="h-10 text-sm border-[#CFD7E6]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4D5A72]">Faixa de Alerta / Tolerância</label>
                    <Input placeholder="< 90%" className="h-10 text-sm border-[#CFD7E6]" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-[#DFE5EF] mt-8">
                  <Button variant="outline" onClick={() => setView('list')} className="border-[#CFD7E6] text-[#4D5A72] h-10 px-6 font-semibold">
                    Cancelar
                  </Button>
                  <Button onClick={() => {toast.success("Indicador criado com sucesso!"); setView('list');}} className="bg-[#1327b9] hover:bg-[#2743D7] text-white h-10 px-6 font-semibold">
                    Adicionar Indicador
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
