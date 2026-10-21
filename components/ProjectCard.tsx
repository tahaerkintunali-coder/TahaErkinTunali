"use client";

import {type CSSProperties} from 'react';
import {ArrowUpRight,Plus,ExternalLink,FileText} from 'lucide-react';
import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {portfolio as p} from '@/data/portfolio';
import type {PortfolioProject} from '@/data/projects';

const colors={thermal:'#74d5e5',manufacturing:'#80d4b5',hydrogen:'#b3a7ee',base:'#99c3ed',bicycle:'#8ed4cb',solar:'#e4c48c'};

export default function ProjectCard({project}:{project:PortfolioProject}) {
  return <Dialog>
    <article className="project-card project-study-card reveal" style={{'--project-accent':colors[project.visual]} as CSSProperties}>
      <DialogTrigger asChild><button type="button" className="project-image" aria-label={`Explore project: ${project.title}`}><img src={project.image} alt={project.imageAlt} width="640" height="360" loading="lazy"/><span className="project-art-caption">{project.visualCaption}</span><span className="project-open"><ArrowUpRight size={19}/></span></button></DialogTrigger>
      <div className="project-body">
        <div className="project-context"><img src={project.logo} alt="" width="42" height="30" loading="lazy"/><div><span>{project.category}</span><small>{project.period}</small></div><b>{project.group}</b></div>
        <h3>{project.title}</h3><p className="project-plain-summary">{project.description}</p>
        <div className="project-my-role"><span>MY ROLE</span><p>{project.role}</p></div>
        <dl className="project-key-points"><div><dt>What I did</dt><dd>{project.contributionSummary}</dd></div><div><dt>{project.outcomeLabel}</dt><dd>{project.outcomeSummary}</dd></div></dl>
        <div className="project-evidence"><strong>{project.metric}</strong><span>{project.metricLabel}</span></div>
        <div className="project-bottom"><div className="tags">{project.tools.map(tool=><span key={tool}>{tool}</span>)}</div><DialogTrigger asChild><button type="button" className="text-button">Project details <Plus size={15}/></button></DialogTrigger></div>
      </div>
    </article>
    <DialogContent className="case-dialog project-case-dialog">
      <DialogTitle className="case-title">{project.title}</DialogTitle><DialogDescription className="case-description">{project.subtitle} · {project.period}</DialogDescription>
      <figure className="project-case-visual"><img src={project.image} alt={project.imageAlt} width="640" height="360"/><figcaption>{project.visualCaption}</figcaption></figure>
      <div className="project-case-context"><h3>The project</h3><p>{project.context}</p></div>
      <div className="project-case-role"><span>MY ROLE</span><p>{project.role}</p></div>
      <div className="case-sections">{[['The challenge',project.challenge],['My contribution',project.approach],[project.outcomeLabel,project.outcome]].map(([label,text])=><div key={label}><h3>{label}</h3><p>{text}</p></div>)}</div>
      <div className="project-case-links">{project.url&&<a className="text-button" href={project.url} target="_blank" rel="noreferrer">{project.urlLabel}<ExternalLink size={15}/></a>}<a className="text-button" href={p.cv} target="_blank" rel="noreferrer">View my CV<FileText size={15}/></a></div>
    </DialogContent>
  </Dialog>;
}
