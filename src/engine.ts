import type {Selection, Event} from './domain';
export type BuildCheck={ok:boolean;message:string;combinedOdds:number;probability:number;edge:number};
export type CoreSignal={label:string;value:string;score:number;detail:string};
export type CoreAnalysis={confidence:number;risk:'LOW'|'MEDIUM'|'HIGH';expectedValue:number;impliedProbability:number;modelProbability:number;edge:number;volatility:number;correlationPenalty:number;dataQuality:number;signals:CoreSignal[];reasoning:string[]};
export function evaluate(selections:Selection[]):BuildCheck{
 if(!selections.length)return {ok:false,message:'Dodaj co najmniej jeden typ',combinedOdds:0,probability:0,edge:0};
 const markets=new Set<string>();
 for(const s of selections){if(s.status!=='open')return {ok:false,message:`Rynek „${s.label}” jest zawieszony`,combinedOdds:0,probability:0,edge:0};if(markets.has(s.marketId))return {ok:false,message:'Nie można łączyć dwóch selekcji z tego samego rynku',combinedOdds:0,probability:0,edge:0};markets.add(s.marketId)}
 const odds=selections.reduce((a,s)=>a*s.odds,1),p=selections.reduce((a,s)=>a*s.probability,1),edge=p*odds-1;
 return {ok:true,message:edge>0.05?'Model wskazuje dodatnią wartość przy założonych prawdopodobieństwach':'Brak przewagi modelowej',combinedOdds:Number(odds.toFixed(2)),probability:p,edge};
}
export function analyzeCore(selections:Selection[],event?:Event):CoreAnalysis{
 const check=evaluate(selections);
 if(!selections.length)return {confidence:0,risk:'HIGH',expectedValue:0,impliedProbability:0,modelProbability:0,edge:0,volatility:0,correlationPenalty:0,dataQuality:0,signals:[],reasoning:['Brak selekcji do analizy.']};
 const implied=1/check.combinedOdds,model=check.probability;
 const correlationPenalty=Math.min(.35,(event&&selections.length>1?.08:0));
 const adjustedEdge=model*(1-correlationPenalty)*check.combinedOdds-1;
 const volatility=Math.min(1,selections.reduce((a,s)=>a+(1-s.probability),0)/selections.length);
 const confidence=Math.max(0,Math.min(99,Math.round(model*100*(1-volatility*.35)*(1-correlationPenalty*.5))));
 const risk=confidence>=70&&volatility<.35?'LOW':confidence>=50?'MEDIUM':'HIGH';
 const dataQuality=event?96:88;
 const signals:CoreSignal[]=[
  {label:'MODEL PROB.',value:`${(model*100).toFixed(1)}%`,score:Math.round(model*100),detail:'Łączne prawdopodobieństwo modelowe.'},
  {label:'IMPLIED',value:`${(implied*100).toFixed(1)}%`,score:Math.round(implied*100),detail:'Prawdopodobieństwo wynikające z kursu.'},
  {label:'EDGE',value:`${(adjustedEdge*100).toFixed(1)}%`,score:Math.max(0,Math.min(100,Math.round(50+adjustedEdge*250))),detail:'Edge po korekcie zależności.'},
  {label:'DATA',value:`${dataQuality}%`,score:dataQuality,detail:'Jakość lokalnego snapshotu.'}
 ];
 const reasoning=[
  `${selections.length} selekcji przeanalizowanych przez Core Engine.`,
  `Kurs ${check.combinedOdds.toFixed(2)} daje implikowane ${(implied*100).toFixed(1)}%.`,
  `Model bazowy szacuje ${(model*100).toFixed(1)}%.`,
  correlationPenalty?`Korekta korelacyjna: ${(correlationPenalty*100).toFixed(0)}%.`:'Brak dodatkowej korekty korelacyjnej.',
  adjustedEdge>0?`Skorygowany edge: ${(adjustedEdge*100).toFixed(1)}%.`:'Po korekcie brak dodatniego edge.'
 ];
 return {confidence,risk,expectedValue:adjustedEdge,impliedProbability:implied,modelProbability:model,edge:adjustedEdge,volatility,correlationPenalty,dataQuality,signals,reasoning};
}
export function potentialReturn(stake:number,odds:number){return Number((stake*odds).toFixed(2))}
