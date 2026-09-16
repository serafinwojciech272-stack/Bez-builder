export type Sport = 'Football'|'Basketball'|'Tennis';
export type Selection = { id:string; label:string; marketId:string; odds:number; probability:number; status:'open'|'suspended' };
export type Market = { id:string; name:string; selections:Selection[] };
export type Event = { id:string; sport:Sport; league:string; home:string; away:string; start:string; markets:Market[] };
export type OddsSnapshot = { selectionId:string; odds:number; capturedAt:string; provider:string };

export const events: Event[] = [
 {id:'e1',sport:'Football',league:'Champions League',home:'Arsenal',away:'Inter',start:'20:45',markets:[
  {id:'m1',name:'Match result',selections:[{id:'s11',label:'Arsenal',marketId:'m1',odds:2.05,probability:.49,status:'open'},{id:'s12',label:'Draw',marketId:'m1',odds:3.45,probability:.29,status:'open'},{id:'s13',label:'Inter',marketId:'m1',odds:3.65,probability:.27,status:'open'}]},
  {id:'m2',name:'Goals',selections:[{id:'s21',label:'Over 2.5',marketId:'m2',odds:1.82,probability:.58,status:'open'},{id:'s22',label:'Under 2.5',marketId:'m2',odds:2.02,probability:.45,status:'open'}]},
  {id:'m3',name:'Both teams to score',selections:[{id:'s31',label:'Yes',marketId:'m3',odds:1.74,probability:.61,status:'open'},{id:'s32',label:'No',marketId:'m3',odds:2.08,probability:.42,status:'open'}]},
 ]},
 {id:'e2',sport:'Football',league:'Premier League',home:'Liverpool',away:'Chelsea',start:'18:30',markets:[{id:'m4',name:'Match result',selections:[{id:'s41',label:'Liverpool',marketId:'m4',odds:1.72,probability:.61,status:'open'},{id:'s42',label:'Draw',marketId:'m4',odds:4.1,probability:.24,status:'open'},{id:'s43',label:'Chelsea',marketId:'m4',odds:4.7,probability:.21,status:'open'}]},{id:'m5',name:'Goals',selections:[{id:'s51',label:'Over 2.5',marketId:'m5',odds:1.69,probability:.64,status:'open'},{id:'s52',label:'Under 2.5',marketId:'m5',odds:2.12,probability:.43,status:'open'}]}]},
 {id:'e3',sport:'Tennis',league:'ATP 500',home:'Sinner',away:'Medvedev',start:'19:00',markets:[{id:'m6',name:'Match winner',selections:[{id:'s61',label:'Sinner',marketId:'m6',odds:1.48,probability:.70,status:'open'},{id:'s62',label:'Medvedev',marketId:'m6',odds:2.65,probability:.38,status:'open'}]}]}
];
