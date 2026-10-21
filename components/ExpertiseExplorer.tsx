"use client";

import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {Activity, Box, Braces, Cog, Thermometer, ArrowDown} from 'lucide-react';
import {portfolio as p} from '@/data/portfolio';

const fields = [
  {label: 'Powertrain', icon: Cog, color: '#e9c07a'},
  {label: 'Thermal systems', icon: Thermometer, color: '#edaa8e'},
  {label: 'Simulation', icon: Activity, color: '#74d6e8'},
  {label: 'Design & production', icon: Box, color: '#7cd6b7'},
  {label: 'Code & data', icon: Braces, color: '#b5a4f2'}
];
const connections = [
  {from:0,to:1,label:'Energy & cooling'},
  {from:1,to:2,label:'Thermal system models'},
  {from:2,to:4,label:'Model automation'},
  {from:4,to:3,label:'Production data'},
  {from:3,to:0,label:'Engineering changes'},
  {from:0,to:2,label:'Virtual validation'}
];
type Wire = {path:string;start:{x:number;y:number};end:{x:number;y:number}};

export default function ExpertiseExplorer() {
  const [active, setActive] = useState(0);
  const [wires, setWires] = useState<Wire[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const skill = p.skills[active];
  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    let frame = 0;
    let alive = true;
    const measure = () => {
      frame = 0;
      if (!alive || nodes.current.some(node=>!node)) return;
      const bounds = root.getBoundingClientRect();
      const boxes=nodes.current.map(node=>node!.getBoundingClientRect());
      setWires(connections.map(({from,to}) => {
        const a=boxes[from],b=boxes[to],ax=a.left+a.width/2-bounds.left,ay=a.top+a.height/2-bounds.top,bx=b.left+b.width/2-bounds.left,by=b.top+b.height/2-bounds.top;
        const dx=bx-ax,dy=by-ay;
        const offset=(rect:DOMRect)=>1/Math.max(Math.abs(dx)/(rect.width/2),Math.abs(dy)/(rect.height/2));
        const start={x:ax+dx*offset(a),y:ay+dy*offset(a)},end={x:bx-dx*offset(b),y:by-dy*offset(b)};
        return {path:`M ${start.x} ${start.y} L ${end.x} ${end.y}`,start,end};
      }));
    };
    const schedule = () => { if (alive && !frame) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    nodes.current.forEach(node => { if (node) observer.observe(node); });
    document.fonts.ready.then(schedule);
    schedule();
    return () => { alive = false; observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return <div className="expertise-explorer" style={{'--field-color': fields[active].color} as CSSProperties}>
    <div className="system-map expertise-network reveal">
      <div className="interaction-label"><span className="status-light"/>How my expertise connects <small>Select an area to explore</small></div>
      <div className="system-map-stage" ref={stage}>
        <svg className="system-wires" aria-hidden="true">{wires.map((wire, i) => <g key={i} style={{'--wire-color':fields[active].color} as CSSProperties} data-active={connections[i].from===active||connections[i].to===active}>
          <path d={wire.path} className="wire-track"/>
          <path d={wire.path} pathLength="1" className="wire-signal"/>
          <circle cx={wire.start.x} cy={wire.start.y} r="3"/><circle cx={wire.end.x} cy={wire.end.y} r="3"/>
        </g>)}</svg>
        <div className="system-nodes">{fields.map((field, i) => <button key={field.label} ref={node => { nodes.current[i] = node; }} type="button" style={{'--node-color':field.color} as CSSProperties} className="system-node" aria-pressed={active === i} aria-controls="expertise-focus" onClick={() => setActive(i)}><field.icon size={24}/><span>{field.label}</span><small>0{i + 1}</small></button>)}</div>
      </div>
      <div className="expertise-connections"><span>Connections in my work</span>{connections.filter(connection=>connection.from===active||connection.to===active).map(connection=><div key={connection.label}><i/><strong>{fields[connection.from===active?connection.to:connection.from].label}</strong><small>{connection.label}</small></div>)}</div>
      <div id="expertise-focus" className="system-focus" aria-live="polite" aria-atomic="true">
        <span className="system-focus-number">{skill.number}</span><div><h3>{skill.title}</h3><p>{skill.summary}</p></div><a href={`#expertise-${skill.number}`} className="system-focus-link">Explore this area <ArrowDown size={16}/></a>
      </div>
    </div>
    <div className="skill-grid">{p.skills.map((s, i) => <article id={`expertise-${s.number}`} key={s.number} className={`skill-card reveal ${i === active ? 'is-selected' : ''}`} style={{'--skill-accent':fields[i].color} as CSSProperties}>
      <figure className="expertise-image"><img src={`/TahaErkinTunali/expertise/${s.number}.webp`} alt={s.number === '03' ? 'Representative GT-SUITE one-dimensional simulation model' : `Representative engineering view: ${s.title}`} width="640" height="440" loading="lazy"/><figcaption>{s.number} / {s.number === '03' ? '1D SYSTEM SIMULATION' : 'ENGINEERING STUDY'}</figcaption></figure>
      <div className="expertise-body"><h3>{s.title}</h3><p>{s.summary}</p><ul>{s.items.map(item => <li key={item}>{item}</li>)}</ul></div>
    </article>)}</div>
  </div>;
}
