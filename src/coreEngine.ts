import type {Event, Selection} from './domain';
import {analyzeCore, evaluate} from './engine';

export type EngineMode='observe'|'audit'|'optimize';
export type Candidate={selection:Selection;event:Event;score:number;reason:string;impliedProbability:number;edge:number;correlationRisk:number};
export type LegAudit={selection:Selection;impliedProbability:number;edge:number;valueScore:number;volatility:number;confidence:number;signal:'VALUE'|'NEUTRAL'|'RISK'};
export type PortfolioInsight={diversification:number;concentration:number;correlationRisk:number;strongest:Candidate|null;candidates:Candidate[];trace:string[]};
export type BuildDecision='REVIEW'|'CAUTION'|'BLOCKED';

function clamp(value:number,min=0,max=1){return Math.max(min,Math.min(max,value));}
function volatilityPenalty(volatility:number){return volatility*.12;}

function structuralCorrelation(a:Selection,aEvent:Event,b:Selection,bEvent:Event){
  if(aEvent.id===bEvent.id)return .55;
  if(a.marketId===b.marketId)return .35;
  if(aEvent.sport===bEvent.sport)return .08;
  return 0;
}

function legMetrics(selection:Selection):LegAudit{
  const implied=1/selection.odds;
  const edge=selection.probability/implied-1;
  const volatility=clamp(1-selection.probability);
  const confidence=Math.round(clamp(selection.probability*(1-volatility*.3)+clamp(edge+.15)*.35)*100);
  const valueScore=clamp(edge*.75+selection.probability*.25,-1,1);
  const signal=edge>.05?'VALUE':edge<-.05?'RISK':'NEUTRAL';
  return {selection,impliedProbability:implied,edge,valueScore,volatility,confidence,signal};
}

export function auditLeg(selection:Selection):LegAudit{return legMetrics(selection);}

export function rankCandidates(events:Event[],excluded:Selection[]=[]):Candidate[]{
  const excludedIds=new Set(excluded.map(s=>s.id));
  return events.flatMap(event=>event.markets.flatMap(m=>m.selections.filter(s=>s.status==='open'&&!excludedIds.has(s.id)).map(selection=>{
    const metrics=legMetrics(selection);
    const sameEvent=excluded.some(s=>events.some(e=>e.id===event.id&&e.markets.some(mm=>mm.selections.some(ss=>ss.id===s.id))));
    const correlationRisk=sameEvent?.55:excluded.some(s=>s.marketId===selection.marketId)?.35:0;
    const score=metrics.valueScore-correlationRisk*.55-volatilityPenalty(metrics.volatility);
    return {selection,event,score,impliedProbability:metrics.impliedProbability,edge:metrics.edge,correlationRisk,reason:`Model ${(selection.probability*100).toFixed(1)}% vs implied ${(metrics.impliedProbability*100).toFixed(1)}% · edge ${(metrics.edge*100).toFixed(1)}%`};
  }))).sort((a,b)=>b.score-a.score);
}

export function inspectPortfolio(events:Event[],selections:Selection[]):PortfolioInsight{
  const all=rankCandidates(events,selections);
  const selectedEvents=selections.map(s=>events.find(e=>e.markets.some(m=>m.selections.some(x=>x.id===s.id)))).filter(Boolean) as Event[];
  let pairRisk=0; let pairs=0;
  for(let i=0;i<selections.length;i++)for(let j=i+1;j<selections.length;j++){pairRisk+=structuralCorrelation(selections[i],selectedEvents[i],selections[j],selectedEvents[j]);pairs++;}
  const correlationRisk=pairs?clamp(pairRisk/pairs):0;
  const markets=new Set(selections.map(s=>s.marketId));
  const concentration=selections.length?clamp(1-(markets.size-1)/Math.max(selections.length,1)):0;
  const diversification=selections.length?clamp(1-correlationRisk*.7-concentration*.25):0;
  const candidates=all.slice(0,8);
  const strongest=candidates[0]??null;
  const trace=[`Portfolio contains ${selections.length} selected legs.`,`Distinct markets: ${markets.size}.`,`Candidate scan evaluated ${all.length} open selections.`,`Structural correlation proxy: ${(correlationRisk*100).toFixed(0)}%.`,`Ranking combines probability, implied probability, edge, volatility and portfolio overlap.`];
  if(strongest)trace.push(`Top marginal candidate: ${strongest.selection.label} · score ${(strongest.score*100).toFixed(1)}.`);
  return {diversification,concentration,correlationRisk,strongest,candidates,trace};
}

export function auditBuild(events:Event[],event:Event,selections:Selection[],mode:EngineMode='audit'){
  const validation=evaluate(selections);
  const core=analyzeCore(selections,event);
  const portfolio=inspectPortfolio(events,selections);
  const legAudits=selections.map(legMetrics);
  const recommendations=rankCandidates(events,selections).filter(c=>!selections.some(s=>s.marketId===c.selection.marketId)).slice(0,3);
  const decision:BuildDecision=!validation.ok?'BLOCKED':core.edge>0&&core.confidence>=60?'REVIEW':'CAUTION';
  const decisionReasons=!validation.ok?[validation.message]:[`Build confidence ${core.confidence}%.`,`Adjusted edge ${(core.edge*100).toFixed(1)}%.`,`Portfolio correlation risk ${(portfolio.correlationRisk*100).toFixed(0)}%.`,decision==='REVIEW'?'Passes deterministic review threshold.':'Needs additional evidence before review.'];
  return {mode,validation,core,portfolio,legAudits,recommendations,decision,decisionReasons};
}
