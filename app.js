const events=[
 {id:'e1',league:'Piłka nożna · Europa',time:'Dziś 20:45',home:'Rennes',away:'Olympique Marsylia',markets:[['1','Rennes','2.10'],['X','Remis','3.40'],['2','Marsylia','3.20']]},
 {id:'e2',league:'Piłka nożna · Anglia',time:'Dziś 21:00',home:'Liverpool',away:'Newcastle',markets:[['1','Liverpool','1.55'],['X','Remis','4.60'],['2','Newcastle','5.40']]},
 {id:'e3',league:'Koszykówka · NBA',time:'Jutro 01:30',home:'Boston Celtics',away:'Miami Heat',markets:[['1','Celtics','1.48'],['X','Dogrywka','12.00'],['2','Heat','2.75']]},
 {id:'e4',league:'Tenis · ATP',time:'Jutro 18:00',home:'Alcaraz',away:'Sinner',markets:[['1','Alcaraz','1.82'],['X','Nie dotyczy','1.01'],['2','Sinner','2.02']]}
];
let picks=[];let sport='Wszystkie';
const app=document.querySelector('#app');
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function filtered(){return sport==='Wszystkie'?events:events.filter(e=>e.league.toLowerCase().includes(sport.toLowerCase()))}
function odds(){return picks.reduce((a,p)=>a*Number(p.odds),1)}
function render(){
 const total=odds();
 app.innerHTML=`<main class="shell"><header class="topbar"><div class="brand"><div class="logo">BB</div><div><h1>Bet Builder</h1><span>Inteligentny kreator kuponu</span></div></div><div class="status">Preview · działa lokalnie</div></header>
 <section class="grid"><div class="panel"><div class="panel-head"><h2>Wybierz zdarzenia</h2><p>Dodaj typy do kuponu. Jeden wybór na zdarzenie.</p></div><div class="filters">${['Wszystkie','Piłka','Koszykówka','Tenis'].map(x=>`<button class="chip ${sport===x?'active':''}" data-sport="${x}">${x}</button>`).join('')}</div><div class="events">${filtered().map(eventCard).join('')}</div></div>
 <aside class="panel slip"><div class="panel-head"><h2>Twój kupon</h2><p>${picks.length} ${picks.length===1?'typ':'typów'}</p></div><div class="slip-body">${picks.length?picks.map(pickCard).join(''):`<div class="empty">Kupon jest pusty.<br>Wybierz kurs z listy po lewej.</div>`}</div><div class="summary"><div class="line"><span>Kurs łączny</span><strong class="total">${total.toFixed(2)}</strong></div><div class="line"><span>Potencjalna wygrana</span><strong>${(total*10).toFixed(2)} zł</strong></div><div class="stake"><input id="stake" type="number" min="1" step="1" value="10" aria-label="Stawka"><button class="cta" id="copy" ${picks.length?'':'disabled'}>Kopiuj kupon</button></div><p class="helper">Demo. Brak połączenia z operatorem.</p></div></aside></section></main><div id="toast" class="toast hidden"></div>`;
 document.querySelectorAll('[data-sport]').forEach(b=>b.onclick=()=>{sport=b.dataset.sport;render()});
 document.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>togglePick(b.dataset.pick));
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{picks=picks.filter(p=>p.id!==b.dataset.remove);render()});
 const copy=document.querySelector('#copy');if(copy)copy.onclick=copySlip;
}
function eventCard(e){return `<article class="event"><div class="event-top"><div><div class="league">${esc(e.league)}</div><div class="match">${esc(e.home)} <span style="color:#67738d">vs</span> ${esc(e.away)}</div></div><div class="time">${esc(e.time)}</div></div><div class="markets">${e.markets.map(m=>{const id=e.id+'-'+m[0];const selected=picks.some(p=>p.id===id);return `<button class="market ${selected?'selected':''}" data-pick="${id}"><small>${esc(m[0])}</small><b>${esc(m[1])} · ${esc(m[2])}</b></button>`}).join('')}</div></article>`}
function pickCard(p){return `<div class="pick"><div class="pick-row"><div class="pick-name">${esc(p.name)}</div><button class="remove" data-remove="${p.id}" aria-label="Usuń">×</button></div><div class="pick-meta">${esc(p.event)} · kurs ${esc(p.odds)}</div></div>`}
function togglePick(id){const [eventId,market]=id.split('-');const e=events.find(x=>x.id===eventId);const m=e.markets.find(x=>x[0]===market);picks=picks.filter(p=>p.eventId!==eventId);if(!picks.some(p=>p.id===id))picks.push({id,eventId,name:m[1],odds:m[2],event:`${e.home} vs ${e.away}`});render()}
async function copySlip(){const text=`Bet Builder\n${picks.map(p=>`${p.name} | ${p.event} | ${p.odds}`).join('\n')}\nKurs łączny: ${odds().toFixed(2)}`;try{await navigator.clipboard.writeText(text);showToast('Kupon skopiowany do schowka')}catch{showToast('Nie udało się skopiować kuponu')}}
function showToast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),2200)}
render();
