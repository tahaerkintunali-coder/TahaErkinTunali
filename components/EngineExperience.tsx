"use client";

import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {Box,Pause,Play,RotateCcw,ScanSearch,Layers,ChevronDown,Maximize2} from 'lucide-react';
import {Dialog,DialogContent,DialogDescription,DialogTitle} from '@/components/ui/dialog';
import {ENGINE_PARTS,cycleDegrees,type EnginePart,type EngineSelection} from './EngineStudy';
import EngineCycleGraph from './EngineCycleGraph';
import {useEngineScene} from './useEngineScene';

type Props={studyMode?:boolean;initialAngle?:number;initialBrake?:boolean;initialSelection?:EngineSelection|null};

export default function EngineExperience({studyMode=false,initialAngle=.55,initialBrake=false,initialSelection=null}:Props){
  const host=useRef<HTMLDivElement>(null);
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[wire,setWire]=useState(false),[paused,setPaused]=useState(studyMode),[brake,setBrake]=useState(initialBrake),[cutaway,setCutaway]=useState(true),[phase,setPhase]=useState('Intake');
  const [angle,setAngle]=useState(initialAngle),[explosion,setExplosion]=useState(0),[speed,setSpeed]=useState(1),[selection,setSelection]=useState<EngineSelection|null>(initialSelection);
  const [labOpen,setLabOpen]=useState(false),[labState,setLabState]=useState({angle:initialAngle,brake:initialBrake,selection:initialSelection});
  const api=useEngineScene(host,{study:studyMode,initialAngle,initialBrake,initialSelection,onReady:()=>setReady(true),onFailure:()=>setFailed(true),onPhase:setPhase,onPose:setAngle,onPause:setPaused,onCutaway:setCutaway,onPick:part=>{if(studyMode)setSelection(part);else if(part)openStudy(part);}});
  useEffect(()=>{api.current?.pause(paused||labOpen);},[paused,labOpen,ready,api]);
  function openStudy(part:EngineSelection|null=null){setLabState({angle:api.current?.readAngle()??angle,brake,selection:part});setLabOpen(true);}
  function setCrank(degrees:number){api.current?.angle(degrees);setPaused(true);}
  function compare(enabled:boolean){api.current?.brake(enabled);setBrake(enabled);setCrank(350);}
  const controls=ready&&!failed&&<div className="scene-controls"><span>DRAG TO ROTATE</span>{!studyMode&&<button type="button" className="engine-study-launch" onClick={()=>openStudy()}><ScanSearch size={15}/>Explore</button>}<button type="button" className="brake-toggle" aria-label="Toggle compression-release engine brake" aria-pressed={brake} onClick={()=>{api.current?.brake(!brake);setBrake(!brake);}}>ENGINE BRAKE <b>{brake?'ON':'OFF'}</b></button><button type="button" aria-label="Toggle wireframe" aria-pressed={wire} onClick={()=>{api.current?.wire(!wire);setWire(!wire);}}><Box size={17}/></button><button type="button" aria-label={paused?'Play engine animation':'Pause engine animation'} aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?<Play size={17}/>:<Pause size={17}/>}</button><button type="button" aria-label="Reset engine view" onClick={()=>api.current?.reset()}><RotateCcw size={17}/></button></div>;
  const canvas=<>
    <div className={`scene-canvas ${failed?'scene-failed':''}`} ref={host} role="img" aria-label="Interactive six-cylinder valvetrain with four valves and three rockers per cylinder. Drag to rotate, or select a part to inspect. Keyboard users can use the part list in Explore."/>
    {(!ready||failed)&&<div className="engine-loading"><span>VALVETRAIN / 001</span><p>Precision in every movement.</p><small>{failed?'The 3D preview is unavailable on this device. Explore the engineering work below.':'Loading the valvetrain…'}</small></div>}
    <span className="technical-label top">FIG. 01 / {cutaway?'ENGINE CUTAWAY':'VALVETRAIN STUDY'}</span>
    {ready&&!failed&&<button type="button" className="engine-view-switch" aria-label={cutaway?'Show valvetrain only':'Show engine block cutaway'} aria-pressed={cutaway} onClick={()=>{api.current?.cutaway(!cutaway);setCutaway(!cutaway);}}>{cutaway?'VALVETRAIN VIEW':'SHOW ENGINE BLOCK'}</button>}
    {!studyMode&&<div className="model-label"><span>3 ROCKERS / CYLINDER</span><small>INTAKE · EXHAUST · ENGINE BRAKE</small></div>}
    {controls}
    {ready&&!failed&&<div className={`engine-phase ${phase==='Compression release'||phase==='Pre-charge'?'is-release':''}`} title="Cylinder 6 cycle phase"><span className="phase-dot"/><span>{phase}</span><small>{brake?'CYL. 6 · FUEL CUT':'CYL. 6 · FIRING'}</small></div>}
    {studyMode&&<span className="engine-selected-caption">{selection?ENGINE_PARTS[selection.part].label:'Click a part to inspect'}{selection?.cylinder!==null&&selection?.cylinder!==undefined&&<small> / CYL. {selection.cylinder+1}</small>}</span>}
  </>;
  if(studyMode)return <div className="engine-lab">
    <div className="engine-lab-main"><div className="engine-lab-viewport">{canvas}</div><EngineCycleGraph angle={angle} brake={brake} onAngle={setCrank}/></div>
    <aside className="engine-lab-inspector" aria-label="Engine study controls">
      <div className="engine-inspector-head"><span>MECHANISM EXPLORER</span><button type="button" disabled={!ready||failed} onClick={()=>api.current?.select(null)}><Maximize2 size={13}/>Overview</button></div>
      <div className="engine-part-description" aria-live="polite" aria-atomic="true"><h3>{selection?ENGINE_PARTS[selection.part].label:'Inside the valvetrain'}</h3><p>{selection?ENGINE_PARTS[selection.part].description:'Choose a part in the model or from the list below. The camera moves closer and highlights the selected component.'}</p></div>
      <div className="engine-part-list" aria-label="Choose an engine part">{(Object.keys(ENGINE_PARTS) as EnginePart[]).map(part=><button type="button" key={part} disabled={!ready||failed} aria-pressed={selection?.part===part} style={{'--part-color':ENGINE_PARTS[part].color} as CSSProperties} onClick={()=>api.current?.select({part,cylinder:part==='camshaft'?null:5})}><i/>{ENGINE_PARTS[part].label}</button>)}</div>
      <div className="engine-study-control"><div><label htmlFor="engine-explosion"><Layers size={14}/>Separate the assembly</label><output htmlFor="engine-explosion">{explosion}%</output></div><input id="engine-explosion" type="range" min="0" max="100" step="1" value={explosion} disabled={!ready||failed} onChange={event=>{const value=Number(event.target.value);setExplosion(value);api.current?.explode(value/100);}}/><div className="engine-slider-ends"><span>Assembled</span><button type="button" disabled={!ready||failed} onClick={()=>{setExplosion(0);api.current?.explode(0);}}>Reassemble</button></div></div>
      <div className="engine-study-control"><div><label htmlFor="engine-crank">Manual crank angle</label><output htmlFor="engine-crank">{Math.round(cycleDegrees(angle))}°</output></div><input id="engine-crank" type="range" min="0" max="720" step="1" value={cycleDegrees(angle)} disabled={!ready||failed} onChange={event=>setCrank(Number(event.target.value))}/><div className="engine-slider-ends"><span>0°</span><span>One cycle · 720°</span></div></div>
      <div className="engine-study-control"><div><label htmlFor="engine-speed">Animation speed</label><output htmlFor="engine-speed">{speed.toFixed(2)}×</output></div><input id="engine-speed" type="range" min=".15" max="2" step=".05" value={speed} disabled={!ready||failed} onChange={event=>{const value=Number(event.target.value);setSpeed(value);api.current?.speed(value);}}/><div className="engine-slider-ends"><span>Slow motion</span><span>2×</span></div></div>
      <div className="engine-comparison"><h3>Compare the brake event</h3><div><button type="button" disabled={!ready||failed} aria-pressed={!brake} onClick={()=>compare(false)}>Normal cycle</button><button type="button" disabled={!ready||failed} aria-pressed={brake} onClick={()=>compare(true)}>Engine brake</button></div><p>Both views pause at 350° so you can compare the valve movement at the same crank angle.</p></div>
      <details className="engine-study-note"><summary>About this study <ChevronDown size={12}/></summary><p>Six cylinders, four valves and three rockers per cylinder. The geometry and valve timing are illustrative; the graph follows the motion of cylinder 6 in this model.</p></details>
    </aside>
  </div>;
  return <div className="engine-experience engine-hero-stage">{canvas}<span className="engine-caption">6 CYL. · 4 VALVES · 3 ROCKERS / CYL.</span><Dialog open={labOpen} onOpenChange={setLabOpen}><DialogContent className="engine-lab-dialog"><div className="engine-lab-dialog-heading"><DialogTitle>Explore the valvetrain</DialogTitle><DialogDescription>Rotate, separate and inspect the mechanism.</DialogDescription></div><EngineExperience studyMode initialAngle={labState.angle} initialBrake={labState.brake} initialSelection={labState.selection}/></DialogContent></Dialog></div>;
}
