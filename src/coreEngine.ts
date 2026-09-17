import type {Event, Selection} from './domain';
import {analyzeCore, evaluate} from './engine';

export type EngineMode='observe'|'audit'|'optimize';
export type Candidate={selection:Selection; event:Event; score:number; reason:string};
export type PortfolioInsight={diversification:number; concentration:number; strongest:Candidate|null; candidates:Candidate[]; trace:string[]};

function scoreSelection(s:Selection){
  const implied=1/s.odds;
  const rawEdge=s.probability/implied-1;
  return Math.max(-1,Math.min(1,rawEdge*0.7+s.probability*0.3));
}

export function rankCandidates(events:Event[], excluded:Selection[]=[]):Candidate[]{
  const excludedIds=new Set(excluded.map(s=>s.id));
  return events.flatMap(event=>event.markets.flatMap(m=>m.selections.filter(s=>s.status==='open'&&!excludedIds.has(s.id)).map(selection=>({selection,event,score:scoreSelection(selection),reason:`${selection.label}: model ${(selection.probability*100).toFixed(1)}% vs implied ${(100/selection.odds).toFixed(1)}%`})))).sort((a,b)=>b.score-a.score);
}

export function inspectPortfolio(events:Event[], selections:Selection[]):PortfolioInsight{
  const all=rankCandidates(events,selections);
  const candidates=all.slice(0,8);
  const markets=new Set(selections.map(s=>s.marketId));
  const concentration=selections.length?Math.min(1,markets.size===1?1:1/markets.size):0;
  const diversification=selections.length?Math.max(0,1-concentration*.35):0;
  const trace=[`Portfolio contains ${selections.length} selected legs.`,`Distinct markets: ${markets.size}.`,`Candidate scan evaluated ${all.length} open selections.`,`Ranking uses model probability, implied probability and value signal.`];
  const strongest=candidates[0]??null;
  if(strongest) trace.push(`Top candidate signal: ${strongest.reason}.`);
  return {diversification,concentration,strongest,candidates,trace};
}

export function auditBuild(events:Event[],event:Event,selections:Selection[],mode:EngineMode='audit'){
  const validation=evaluate(selections);
  const core=analyzeCore(selections,event);
  const portfolio=inspectPortfolio(events,selections);
  const recommendations=rankCandidates(events,selections).filter(c=>!selections.some(s=>s.marketId===c.selection.marketId)).slice(0,3);
  return {mode,validation,core,portfolio,recommendations};
}
