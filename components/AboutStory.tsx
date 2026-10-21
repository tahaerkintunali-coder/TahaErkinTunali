"use client";

import {useState} from 'react';
import {ArrowDown, ArrowUpRight, BrainCircuit, CircleCheck, ScanLine, Wrench} from 'lucide-react';
import {portfolio as p} from '@/data/portfolio';
import {useScrollProgress} from '@/lib/use-scroll-progress';

const topics = [
  {label:'Who I am', title:'Engineering that connects the whole system.', text:p.about, link:'Follow my career', target:'#journey'},
  {label:'What I solve', title:'Performance, efficiency and practical engineering problems.', text:'I work across engine brake systems, powertrain and thermal simulation, virtual validation and product changes. At Siemens, I also connected production data, visual inspection and reporting to process improvement.', link:'Explore my projects', target:'#projects'},
  {label:'How I work', title:'Understand. Model. Validate. Improve.', text:'I connect engineering fundamentals with simulation and data. My experience includes GT-SUITE system models, real-time validation, Python engineering tools and research into more efficient electric vehicle thermal management.', link:'See my expertise', target:'#expertise'}
];
const approach = [
  {label:'Understand', icon:ScanLine, text:p.projects[0].challenge},
  {label:'Model', icon:BrainCircuit, text:'Develop GT-SUITE powertrain and thermal models to understand how components interact across vehicle variants.'},
  {label:'Validate', icon:CircleCheck, text:'Connect virtual models with calibration and real-time HiL, SiL and MiL development using Simulink and Python.'},
  {label:'Improve', icon:Wrench, text:'Use the findings to support component selection, lubrication optimization and more efficient calibration workflows.'}
];

export default function AboutStory() {
  const [topic, setTopic] = useState(0);
  const [scrollStep, setScrollStep] = useState(0);
  const [manualStep, setManualStep] = useState<number|null>(null);
  const ref = useScrollProgress<HTMLDivElement>(progress => setScrollStep(Math.min(3, Math.floor(progress * 4))));
  const step = manualStep ?? scrollStep;
  return <div className="about-story">
    <div className="about-story-label">TAHA IN 30 SECONDS</div>
    <div className="about-story-topics" aria-label="Get to know Taha">{topics.map((item, i) => <button type="button" key={item.label} aria-pressed={i === topic} aria-controls="about-story-detail" onClick={() => setTopic(i)}><span>0{i + 1}</span>{item.label}</button>)}</div>
    <div id="about-story-detail" className="about-story-detail" key={topic} aria-live="polite" aria-atomic="true"><h3>{topics[topic].title}</h3><p>{topics[topic].text}</p><a href={topics[topic].target}>{topics[topic].link}<ArrowUpRight size={15}/></a></div>
    <div ref={ref} className="about-approach">
      <div className="about-approach-heading"><span>How I approach a problem</span>{manualStep !== null ? <button type="button" onClick={() => setManualStep(null)}>Follow scroll</button> : <span>Scroll to explore <ArrowDown size={12}/></span>}</div>
      <div className="about-approach-steps" role="group" aria-label="Problem solving approach">{approach.map((item, i) => <button type="button" key={item.label} aria-pressed={step === i} aria-controls="about-approach-detail" onClick={() => setManualStep(i)}><span><item.icon size={17}/></span><small>{item.label}</small></button>)}</div>
      <div className="about-approach-detail" id="about-approach-detail" key={step}><span>0{step + 1} / {approach[step].label}</span><p>{approach[step].text}</p><a href="#projects">Example: Ford Otosan simulation work <ArrowUpRight size={13}/></a></div>
    </div>
  </div>;
}
