"use client";

import {useMemo} from 'react';
import {cylinderState, VALVE_EVENTS} from './EngineKinematics';
import {cycleDegrees, valveCycleSamples} from './EngineStudy';

export default function EngineCycleGraph({angle,brake,onAngle}:{angle:number;brake:boolean;onAngle:(degrees:number)=>void}) {
  const samples=useMemo(()=>valveCycleSamples(brake),[brake]);
  const degrees=cycleDegrees(angle),x=26+degrees/720*568;
  const state=cylinderState(angle,5,brake);
  const lift=[state.intakeLift,Math.max(state.exhaustLift,state.brakeLift),state.brakeLift].map(value=>value/VALVE_EVENTS.intake.height);
  const curves=['intake','exhaust','brake'] as const;
  const path=(key:typeof curves[number])=>samples.map((sample,i)=>`${i?'L':'M'}${(26+sample.degrees/720*568).toFixed(1)},${(135-sample[key]*105).toFixed(1)}`).join(' ');
  return <div className="engine-cycle-graph">
    <div className="cycle-graph-heading"><span>CYLINDER 6 / VALVE MOTION</span><small>Drag the cycle to inspect</small></div>
    <svg viewBox="0 0 620 164" role="slider" tabIndex={0} aria-label="Crank angle in cylinder six valve motion graph" aria-valuemin={0} aria-valuemax={720} aria-valuenow={Math.round(degrees)} aria-valuetext={`${Math.round(degrees)} degrees`} onKeyDown={event=>{let value:number|undefined;if(event.key==='ArrowRight'||event.key==='ArrowUp')value=Math.min(720,degrees+5);if(event.key==='ArrowLeft'||event.key==='ArrowDown')value=Math.max(0,degrees-5);if(event.key==='Home')value=0;if(event.key==='End')value=720;if(value!==undefined){event.preventDefault();onAngle(value);}}} onPointerDown={event=>{event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);const bounds=event.currentTarget.getBoundingClientRect();onAngle(Math.max(0,Math.min(720,((event.clientX-bounds.left)/bounds.width*620-26)/568*720)));}} onPointerMove={event=>{if(!event.currentTarget.hasPointerCapture(event.pointerId))return;const bounds=event.currentTarget.getBoundingClientRect();onAngle(Math.max(0,Math.min(720,((event.clientX-bounds.left)/bounds.width*620-26)/568*720)));}} onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}}>
      {[0,180,360,540,720].map(value=><g key={value}><line x1={26+value/720*568} x2={26+value/720*568} y1="20" y2="135" className="cycle-grid"/><text x={26+value/720*568} y="155" textAnchor="middle">{value}°</text></g>)}
      <line x1="26" x2="594" y1="135" y2="135" className="cycle-baseline"/>
      {curves.map(key=><path key={key} d={path(key)} className={`cycle-curve ${key}`} data-active={key!=='brake'||brake}/>)}
      <line x1={x} x2={x} y1="18" y2="138" className="cycle-cursor"/>
      {curves.map((key,i)=><circle key={key} cx={x} cy={135-lift[i]*105} r="3.5" className={`cycle-point ${key}`} data-active={key!=='brake'||brake}/>)}
    </svg>
    <div className="cycle-legend"><span className="intake">Intake</span><span className="exhaust">Exhaust</span><span className={`brake ${brake?'':'is-muted'}`}>Brake event</span><small>Illustrative cycle · relative lift</small></div>
  </div>;
}
