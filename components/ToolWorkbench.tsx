"use client";

import {useState, type CSSProperties} from 'react';
import {Activity, ArrowDown, ArrowRight, Box, Braces, CircuitBoard, Grid2X2} from 'lucide-react';
import {portfolio as p} from '@/data/portfolio';
import {softwareAssets} from '@/data/software-assets';

const workflows = [
  {label: 'Design', category: 'CAD & PLM', icon: Box, color: '#78d6c0', title: 'From geometry to product data.', description: 'Mechanical models, technical drawings, component changes and BOM structures.', tools: ['teamcenter', 'siemens-nx', 'autocad']},
  {label: 'Simulate', category: 'Simulation', icon: Activity, color: '#7acfe9', title: 'Test the system virtually.', description: 'Powertrain and thermal models, numerical analysis and real-time validation.', tools: ['gt-suite', 'matlab', 'simulink']},
  {label: 'Analyze', category: 'Data & code', icon: Braces, color: '#ddc484', title: 'Turn engineering data into decisions.', description: 'Python scripts, production dashboards, calculations and technical reporting.', tools: ['python', 'tableau', 'excel']},
  {label: 'Automate', category: 'Automation', icon: CircuitBoard, color: '#b5a5ee', title: 'Explore my automation toolkit.', description: 'Control FPWIN Pro is listed among my PLC programming skills in the CV.', tools: ['fpwin']}
];

export default function ToolWorkbench({filter, onFilter}:{filter:string;onFilter:(filter:string)=>void}) {
  const [lastWorkflow, setLastWorkflow] = useState(1);
  const current = workflows.findIndex(workflow => workflow.category === filter);
  const selected = current < 0 ? lastWorkflow : current;
  const workflow = workflows[selected];
  const visibleTools = p.tools.filter(tool => filter === 'All tools' || tool.category === filter);
  return <div className="tool-workbench reveal" style={{'--workbench-accent':workflow.color} as CSSProperties}>
    <div className="workbench-heading"><div className="interaction-label"><span className="status-light"/>My engineering workbench</div><button type="button" className={`workbench-all ${filter === 'All tools' ? 'active' : ''}`} aria-pressed={filter === 'All tools'} onClick={() => onFilter('All tools')}><Grid2X2 size={14}/>All tools <span>{p.tools.length}</span></button></div>
    <div className="workbench-steps" aria-label="Filter software by workflow">{workflows.map((step, i) => <button type="button" key={step.category} aria-pressed={filter === step.category} className={`workbench-step ${i === selected ? 'is-previewed' : ''}`} style={{'--step-color':step.color} as CSSProperties} onClick={() => { setLastWorkflow(i); onFilter(step.category); }}>
      <span className="workbench-step-icon"><step.icon size={22}/></span><span><strong>{step.label}</strong><small>{step.category}</small></span><span className="workbench-step-count">{p.tools.filter(tool => tool.category === step.category).length}</span>{i < workflows.length - 1 && <ArrowRight className="workbench-arrow" size={16}/>}
    </button>)}</div>
    <div className="workbench-detail">
      <div className="workbench-stack" key={workflow.category} aria-label={`${workflow.label} tools`}>{workflow.tools.map((logo, i) => { const tool = p.tools.find(tool => tool.logo === logo)!; return <a href={`#software-${logo}`} key={logo} style={{'--stack-index':i} as CSSProperties} className="workbench-logo" aria-label={`Find ${tool.name}`}><img src={softwareAssets[logo].src} alt={`${tool.name} logo`} width="180" height="110"/><span>{tool.name}</span></a>; })}<div className="workbench-ground" aria-hidden="true"/></div>
      <div className="workbench-copy" key={workflow.title}><span>0{selected + 1} / {workflow.label.toUpperCase()}</span><h3>{workflow.title}</h3><p>{workflow.description}</p></div>
    </div>
    <div className="workbench-results" aria-live="polite"><span><b>{visibleTools.length}</b> tools · {filter}</span><span>Select a card below for my experience <ArrowDown size={14}/></span></div>
  </div>;
}
