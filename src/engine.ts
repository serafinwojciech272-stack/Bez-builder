import type {Selection} from './domain';
export type BuildCheck={ok:boolean;message:string;combinedOdds:number;probability:number;edge:number};
export function evaluate(selections:Selection[]):BuildCheck{
 if(!selections.length)return {ok:false,message:'Dodaj co najmniej jeden typ',combinedOdds:0,probability:0,edge:0};
 const marketIds=new Set<string>(); for(const s of selections){if(s.status!=='open')return {ok:false,message:`Rynek „${s.label}” jest zawieszony`,combinedOdds:0,probability:0,edge:0}; if(marketIds.has(s.marketId))return {ok:false,message:'Nie można łączyć dwóch przeciwnych selekcji z tego samego rynku',combinedOdds:0,probability:0,edge:0}; marketIds.add(s.marketId)}
 const odds=selections.reduce((a,s)=>a*s.odds,1); const p=selections.reduce((a,s)=>a*s.probability,1); const edge=p*odds-1;
 return {ok:true,message:edge>0.05?'Model wskazuje dodatnią wartość przy założonych prawdopodobieństwach':'Brak przewagi modelowej',combinedOdds:Number(odds.toFixed(2)),probability:p,edge};
}
export function potentialReturn(stake:number,odds:number){return Number((stake*odds).toFixed(2))}
