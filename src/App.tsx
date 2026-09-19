import React, {useMemo, useState} from 'react';
import {ArrowDown, ArrowUpRight, BrainCircuit, ChevronRight, CircleDot, Cpu, Gauge, Layers3, MapPinned, Play, Radio, ShieldCheck, Sparkles, Wind, Zap} from 'lucide-react';
import './styles.css';

type Scene = {id:string; time:string; title:string; detail:string; drones:string; altitude:string; accent:string};
const scenes:Scene[]=[
 {id:'01',time:'00:00',title:'THE SIGNAL',detail:'A sparse constellation resolves into the Stranger Things title language, establishing the visual grid before the story accelerates.',drones:'5,000',altitude:'120 ft',accent:'violet'},
 {id:'02',time:'00:48',title:'HAWKINS',detail:'The fleet changes topology. Individual trajectories become bicycles, the WSQK van and a moving Hawkins tableau.',drones:'4,860',altitude:'180 ft',accent:'blue'},
 {id:'03',time:'02:11',title:'THE UPSIDE DOWN',detail:'Negative space becomes part of the composition. The formation stretches across a wide aerial canvas while preserving collision margins.',drones:'4,920',altitude:'320 ft',accent:'red'},
 {id:'04',time:'04:37',title:'THE PORTAL',detail:'Hundreds of pyro-capable units join the visual language for the climactic transition. Timing and spatial separation become critical.',drones:'5,000',altitude:'420 ft',accent:'orange'},
 {id:'05',time:'06:02',title:'VECNA',detail:'A giant volumetric character emerges from the portal. The fleet is treated as a 3D point cloud, not a flat pixel screen.',drones:'4,979',altitude:'600 ft',accent:'crimson'},
 {id:'06',time:'07:34',title:'THE LAST FRAME',detail:'The narrative collapses into a final brand lockup, then the swarm returns through optimized landing corridors.',drones:'5,000',altitude:'150 ft',accent:'white'}
];

const pipeline=[
 ['01','INPUT','Story, music, IP assets, venue geometry'],
 ['02','SCENE GRAPH','Storyboard becomes timed visual states'],
 ['03','VECTOR → VOXEL','2D / 3D artwork becomes drone positions'],
 ['04','SWARM SOLVER','Trajectories are assigned and optimized'],
 ['05','SAFETY FILTER','Collision, spacing, altitude and geofence checks'],
 ['06','SIMULATE','Full show is previewed before flight'],
 ['07','FLIGHT','Telemetry, timing and human flight operations'],
 ['08','LEARN','Post-show data feeds the next iteration']
];

export default function App(){
 const [active,setActive]=useState(4);
 const [running,setRunning]=useState(false);
 const [metric,setMetric]=useState(94);
 const scene=scenes[active];
 const drones=useMemo(()=>Array.from({length:180},(_,i)=>({x:((i*47)%100),y:((i*71)%72)+14,delay:(i%18)*.07,size:i%11===0?3:2})),[]);
 const run=()=>{setRunning(true);setMetric(97);setTimeout(()=>setRunning(false),1800)};
 return <div className="site">
  <header className="nav"><a className="logo" href="#top"><span className="logoMark">S5</span><span><b>DRONE SHOW</b><small>LAS VEGAS / 28.12.2025</small></span></a><nav><a href="#technology">Technology</a><a href="#show">Show system</a><a href="#simulation">Simulation</a><a href="#documentary">Documentary</a><a href="#facts">Facts</a></nav><button className="navCta" onClick={run}><Play size={13}/> Run Core Simulation</button></header>

  <main id="top">
   <section className="hero">
    <div className="heroCopy"><div className="kicker"><CircleDot size={11}/> CASE STUDY / AERIAL COMPUTING</div><h1>5,000 drones.<br/><i>One living sky.</i></h1><p className="heroLead">How the Stranger Things Season 5 Las Vegas spectacle turned storyboards, 3D geometry, swarm choreography and flight operations into a synchronized aerial performance.</p><div className="heroActions"><button className="primary" onClick={()=>document.getElementById('technology')?.scrollIntoView({behavior:'smooth'})}><span>Explore the system</span><ArrowDown size={15}/></button><button className="textBtn" onClick={run}><Play size={14}/> Start AI simulation</button></div><div className="proof"><div><strong>5,000</strong><span>drones reported by Sky Elements</span></div><div><strong>600 ft</strong><span>Vecna height reported by Sky Elements</span></div><div><strong>~10 min</strong><span>battery window per drone</span></div></div></div>
    <div className="sky"><div className="scanline"/><div className="moon"/><div className="gridGlow"/><div className={'swarm '+(running?'running':'')}>{drones.map((d,i)=><span key={i} style={{left:d.x+'%',top:d.y+'%',animationDelay:d.delay+'s',width:d.size,height:d.size}}/>)}</div><div className="heroLabel"><span>LIVE SYSTEM VIEW</span><b>SWARM / {scene.drones}</b><small>ALT {scene.altitude} · {scene.time}</small></div><div className="heroSignal"><Radio size={12}/> TELEMETRY LINK <i/></div></div>
   </section>

   <section className="ticker"><span>NETFLIX × STRANGER THINGS</span><span>LAS VEGAS</span><span>SKY ELEMENTS</span><span>ACRONYM</span><span>SKYBRUSH</span><span>5,000 DRONE SCALE</span></section>

   <section id="technology" className="section">
    <div className="sectionIntro"><div><div className="kicker">THE CORE ENGINE</div><h2>From narrative to<br/><i>flight geometry.</i></h2></div><p>The important shift is conceptual. A drone show is not a video projected into the sky. It is a continuously changing 3D state produced by thousands of independent aircraft. The Core Engine treats the show as a constrained optimization problem.</p></div>
    <div className="pipeline">{pipeline.map((p,i)=><div className="pipe" key={p[0]}><span>{p[0]}</span><div><b>{p[1]}</b><p>{p[2]}</p></div>{i<pipeline.length-1&&<ChevronRight className="pipeArrow" size={16}/>}</div>)}</div>
   </section>

   <section id="show" className="showSection section">
    <div className="sectionIntro"><div><div className="kicker">THE PERFORMANCE GRAPH</div><h2>Six scenes.<br/><i>One continuous system.</i></h2></div><p>Public sources describe the production as an approximately eight-minute show using roughly 5,000 drones, including pyro-equipped units. The exact proprietary choreography and internal flight stack are not public, so this interface separates documented facts from an engineering reconstruction.</p></div>
    <div className="sceneRail">{scenes.map((s,i)=><button className={'sceneCard '+(active===i?'active ':'')+s.accent} key={s.id} onClick={()=>setActive(i)}><span>{s.time}</span><strong>{s.title}</strong><small>{s.drones} UNITS · {s.altitude}</small></button>)}</div>
    <div className="sceneDetail"><div className="sceneNumber">{scene.id}</div><div><div className="kicker">{scene.time} / SCENE STATE</div><h3>{scene.title}</h3><p>{scene.detail}</p></div><div className="sceneStats"><span>FLEET <b>{scene.drones}</b></span><span>ALTITUDE <b>{scene.altitude}</b></span><span>MODEL STATE <b>LOCKED</b></span></div></div>
   </section>

   <section id="simulation" className="simulation section">
    <div className="simTop"><div><div className="kicker">CORE ENGINE / LIVE RECONSTRUCTION</div><h2>Make the system<br/><i>think in formations.</i></h2></div><button className="primary" onClick={run}>{running?<><Gauge size={15}/> Solving trajectories...</>:<><Play size={15}/> Run simulation</>}</button></div>
    <div className="simGrid"><div className="simCanvas"><div className="canvasHud"><span>FORMATION SOLVER</span><b>{running?'OPTIMIZING':'READY'}</b></div><div className={'simDots '+(running?'solve':'')}>{drones.map((d,i)=><span key={i} style={{left:d.x+'%',top:d.y+'%',animationDelay:(i%15)*.05+'s'}}/>)}</div><div className="target"><span>VECNA / 3D POINT CLOUD</span><b>600 FT</b></div></div><div className="metrics"><div className="metric"><span>TRAJECTORY SCORE</span><strong>{metric}%</strong><small>transition efficiency</small></div><div className="metric"><span>COLLISION MARGIN</span><strong>SAFE</strong><small>constraint pass</small></div><div className="metric"><span>BATTERY BUDGET</span><strong>7:12</strong><small>estimated show window</small></div><div className="metric"><span>ACTIVE NODES</span><strong>5,000</strong><small>logical fleet</small></div><div className="trace"><div><BrainCircuit size={15}/><b>DECISION TRACE</b></div><p>Input assets → scene topology → voxel allocation → shortest-path transition → separation check → battery-aware timing → final state.</p></div></div></div>
   </section>


   <section id="documentary" className="documentary section">
    <div className="documentaryHead">
      <div>
        <div className="kicker">THE REAL SHOW / DOCUMENTARY ARCHIVE</div>
        <h2>Not a render.<br/><i>The real night.</i></h2>
      </div>
      <p>Real event photography and the published Skybrush project are used as the documentary layer. The visual system around them is an original cinematic reconstruction, not a claim that proprietary production files are public.</p>
    </div>
    <div className="documentaryHero">
      <div className="docImage">
        <img src="https://skyelementsdrones.com/hubfs/vecna-drone-show-stranger-things-pyro-drones.webp" alt="Vecna drone formation over Las Vegas, Stranger Things Season 5" loading="lazy"/>
        <div className="docStamp"><span>DOCUMENTED / 28.12.2025</span><b>LAS VEGAS · VECNA</b></div>
      </div>
      <div className="docVideo">
        <div className="videoChrome"><span>ARCHIVE VIDEO</span><a href="https://app.skybrush.io/projects/skyelements-stranger-things-2025/" target="_blank" rel="noreferrer">OFFICIAL PROJECT ↗</a></div>
        <div className="videoFrame">
          <iframe src="https://www.youtube.com/embed?listType=search&list=Stranger%20Things%205000%20drones%20Las%20Vegas" title="Stranger Things 5000 drone show video search" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
          <div className="videoOverlay"><Play size={18}/><span>LIVE DOCUMENTARY FEED</span></div>
        </div>
        <p className="sourceNote">Full show published by the Skybrush project archive. Photos credited by Skybrush to Sky Elements, USA.</p>
      </div>
    </div>
    <div className="photoStrip">
      <figure><img src="https://skyelementsdrones.com/hubfs/vecna-drone-show-stranger-things-pyro-drones.webp" alt="Vecna drone show documentary photograph" loading="lazy"/><figcaption>VECNA / 4,979 DRONES</figcaption></figure>
      <figure className="docCard"><span>PRIMARY SOURCES</span><b>SKY ELEMENTS</b><small>Production photography and project facts</small><a href="https://skyelementsdrones.com/portfolio" target="_blank" rel="noreferrer">OPEN ARCHIVE ↗</a></figure>
      <figure className="docCard"><span>TECHNICAL SOURCE</span><b>SKYBRUSH</b><small>Showcase page with full video and software context</small><a href="https://app.skybrush.io/projects/skyelements-stranger-things-2025/" target="_blank" rel="noreferrer">OPEN PROJECT ↗</a></figure>
    </div>
   </section>

   <section id="facts" className="facts section"><div className="factHero"><div className="kicker">WHAT IS DOCUMENTED</div><h2>The engineering<br/><i>behind the spectacle.</i></h2><p>Use the verified layer as the source of truth. Use the reconstruction layer to understand how a system of this scale is typically engineered.</p></div><div className="factGrid"><article><Cpu/><b>Swarm software</b><p>Skybrush publicly states it powered the 5,000-drone Stranger Things flight. It is designed for drone-show planning, simulation and execution.</p></article><article><Layers3/><b>Vector → voxel</b><p>Sky Elements describes converting CG assets into drone formations with vector-to-voxel accuracy and 3D mockups.</p></article><article><ShieldCheck/><b>Safety layer</b><p>Public production information describes FAA compliance, airspace coordination, flight authorization and extensive operational planning.</p></article><article><Zap/><b>Battery optimization</b><p>ACRONYM reports about 10 minutes of battery life per drone, with takeoff and landing consuming nearly three minutes. Choreography was optimized around this constraint.</p></article><article><MapPinned/><b>Physical geometry</b><p>The audience sees a projection of a spatial computation. Every frame requires positions, altitude, timing, spacing and transitions across the fleet.</p></article><article><Wind/><b>Weather + venue</b><p>Real flight plans must account for local airspace, launch area, weather and the geometry of the audience view. Exact operational parameters remain proprietary.</p></article></div></section>
  </main>
  <footer><span>S5 / DRONE SHOW RECONSTRUCTION</span><span>Built as a Core Engine technology demonstrator</span><a href="#top"><ArrowUpRight size={13}/> TOP</a></footer>
 </div>
}
