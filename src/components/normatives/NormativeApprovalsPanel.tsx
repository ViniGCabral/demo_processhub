import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, Download, FileCheck2, Search, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const queues = {
  pending: [
    { id:"POL-019", title:"Política de Acesso a Sistemas Críticos", version:"v3", stage:"Encaminhar para DE+CA", sla:"2 dias", tone:"normal" },
    { id:"NOR-247", title:"Acesso e Trabalho em Alta Tensão", version:"v2", stage:"Encaminhar para DE", sla:"SLA violado", tone:"danger" },
    { id:"PRO-892", title:"Provisionamento de Acessos para Terceiros", version:"v4", stage:"Aprovação da VP", sla:"1 dia", tone:"warning" },
  ],
  external: [
    { id:"POL-024", title:"Continuidade de Negócios e Recuperação", version:"v1", stage:"DE+CA · Aprova", sla:"4 dias", tone:"normal" },
    { id:"POL-007", title:"Segurança da Informação Corporativa", version:"v6", stage:"Aguardando assinatura", sla:"DocuSign", tone:"warning" },
  ],
  history: [
    { id:"NOR-034", title:"Provisionamento de Acessos Privilegiados", version:"v3", stage:"Aprovado pela DE", sla:"26/08", tone:"success" },
    { id:"IT-412", title:"Configuração de MFA em Sistemas Críticos", version:"v2", stage:"Aprovado pela Gerência", sla:"25/08", tone:"success" },
  ],
};

export function NormativeApprovalsPanel({ onOpenDemand }:{ onOpenDemand:(id:string)=>void }) {
  const [tab,setTab]=useState<keyof typeof queues>("pending");
  const [selected,setSelected]=useState("POL-019");
  const items=queues[tab];
  const current=useMemo(()=>items.find(x=>x.id===selected)??items[0],[items,selected]);
  const changeTab=(value:keyof typeof queues)=>{setTab(value);setSelected(queues[value][0].id)};
  return <div className="max-w-[1240px] mx-auto p-8 animate-fade-in normatives-content">
    <header className="mb-6"><div className="section-title mb-1.5">Decisões</div><h2 className="text-[25px] font-semibold">Aprovações</h2><p className="text-sm mt-1">Decida com pareceres, mudanças relevantes e evidências no mesmo contexto.</p></header>
    <div className="grid grid-cols-4 gap-3 mb-5">{[["Aguardando você","12","3 críticas"],["Alçada externa","5","2 no DocuSign"],["Aprovadas hoje","8","100% rastreáveis"],["SLA médio","2,8d","meta: 3 dias"]].map(([label,value,detail])=><div key={label} className="bg-card border rounded-xl p-4"><div className="text-[10px] text-muted-foreground">{label}</div><div className="text-xl font-semibold mt-1">{value}</div><div className="text-[9px] text-muted-foreground mt-1">{detail}</div></div>)}</div>
    <div className="grid grid-cols-[390px_minmax(0,1fr)] gap-5 normatives-dashboard-grid">
      <aside className="bg-card border rounded-xl overflow-hidden"><div className="flex px-4 pt-4 border-b">{[["pending","Aguardando",12],["external","Externas",5],["history","Histórico",null]].map(([id,label,count])=><button key={id as string} onClick={()=>changeTab(id as keyof typeof queues)} className={cn("pb-3 px-2 text-[11px] border-b-2 -mb-px",tab===id?"border-primary text-primary font-medium":"border-transparent text-muted-foreground")}>{label as string}{count&&<span className="ml-1.5 bg-muted rounded-full px-1.5 py-0.5 text-[9px]">{count as number}</span>}</button>)}</div><div className="p-3 border-b"><div className="relative"><Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground"/><input className="w-full h-9 border rounded-lg pl-9 pr-3 text-xs" placeholder="Buscar código, título ou área..."/></div></div>{items.map(item=><button key={item.id} onClick={()=>setSelected(item.id)} className={cn("w-full text-left p-4 border-b last:border-0",current.id===item.id?"bg-primary/5 border-l-2 border-l-primary":"hover:bg-muted/40")}><div className="flex justify-between mb-1"><span className="text-[10px] font-semibold text-primary">{item.id} · {item.version}</span><span className={cn("text-[9px] font-medium",item.tone==="danger"?"text-red-600":item.tone==="warning"?"text-amber-700":item.tone==="success"?"text-emerald-600":"text-muted-foreground")}>{item.sla}</span></div><div className="text-xs font-semibold leading-5">{item.title}</div><div className="text-[10px] text-muted-foreground mt-1">{item.stage}</div></button>)}</aside>
      <section className="bg-card border rounded-xl overflow-hidden"><div className="p-6 border-b"><div className="flex justify-between"><div><div className="text-[10px] text-primary font-semibold mb-1">{current.id} · {current.version}</div><h3 className="text-lg font-semibold">{current.title}</h3><p className="text-[10px] mt-1">Demandante: Patrícia Lima · Suprimentos · Em sua fila há 3 dias</p></div><span className="h-fit text-[9px] bg-amber-50 text-amber-800 rounded px-2 py-1">{current.stage}</span></div></div><div className="p-6">
        <div className="bg-[#F7F8FF] border border-[#E3E7FF] rounded-xl p-4 mb-5"><div className="flex gap-2 items-center text-xs text-primary font-semibold"><Sparkles className="h-4 w-4"/> Resumo executivo por IA</div><p className="text-[11px] leading-5 mt-2 text-foreground">A revisão amplia o escopo, inclui critérios de criticidade e incorpora a Resolução ANEEL 964/2021. Quatro pareceres favoráveis; uma ressalva já foi endereçada na versão atual.</p><div className="grid grid-cols-3 gap-2 mt-3">{[["4","Alterações"],["1","Ressalva resolvida"],["18%","Similaridade"]].map(([v,l])=><div key={l} className="bg-white rounded-lg p-2.5"><div className="text-sm font-semibold">{v}</div><div className="text-[8px] text-muted-foreground">{l}</div></div>)}</div></div>
        <div className="text-xs font-semibold mb-3">Cadeia de aprovação</div><div className="flex items-center mb-5">{["Normativos","Compliance","Governança","Jurídico","DE + CA"].map((x,i)=><div key={x} className="flex items-center flex-1 last:flex-none"><div className="text-center"><div className={cn("w-7 h-7 mx-auto rounded-full flex items-center justify-center",i<4?"bg-emerald-50 text-emerald-600":"bg-primary text-white")}>{i<4?<CheckCircle2 className="h-4 w-4"/>:5}</div><div className="text-[8px] mt-1">{x}</div></div>{i<4&&<div className={cn("h-px flex-1 mx-2 -mt-3",i<3?"bg-emerald-400":"bg-border")}/>}</div>)}</div>
        <div className="border rounded-xl p-4 mb-5"><div className="flex justify-between mb-3"><div className="text-xs font-semibold">Pareceres recebidos</div><span className="text-[9px] text-emerald-600">4 de 4 favoráveis</span></div>{[["Júlia Almeida","Normativos","Sem ressalvas"],["Marina Silva","Compliance","2 ressalvas resolvidas"],["Aline Pacheco","Governança","Sem ressalvas"],["Carolina Veloso","Jurídico","Sem ressalvas"]].map(([name,area,status])=><div key={name} className="flex items-center gap-3 py-2 border-t"><div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-[8px] font-semibold">{name.split(" ").map(x=>x[0]).join("")}</div><div className="flex-1"><div className="text-[10px] font-medium">{name}</div><div className="text-[8px] text-muted-foreground">{area}</div></div><span className="text-[9px] text-muted-foreground">{status}</span></div>)}</div>
        <div className="flex items-center justify-between"><button onClick={()=>onOpenDemand(current.id)} className="h-9 px-3 border rounded-lg text-xs flex items-center gap-2"><FileCheck2 className="h-4 w-4"/> Abrir documento completo</button>{tab==="history"?<button className="h-9 px-3 border rounded-lg text-xs flex items-center gap-2"><Download className="h-4 w-4"/> Baixar evidência</button>:<div className="flex gap-2"><button className="h-9 px-3 border border-amber-300 text-amber-800 rounded-lg text-xs">Solicitar ajustes</button><button className="h-9 px-4 bg-primary text-white rounded-lg text-xs font-medium">{tab==="external"?"Registrar deliberação":"Encaminhar para DE+CA"}</button></div>}</div>
      </div></section>
    </div>
  </div>;
}
