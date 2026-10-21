"use client";

import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, MapPin, RotateCw, Plus, FileText, ExternalLink} from 'lucide-react';
import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {portfolio as p} from '@/data/portfolio';
import {useScrollProgress} from '@/lib/use-scroll-progress';

const profileTopics = [
  {name:'Education', className:'education', href:'#career-yildiz'},
  {name:'Experience', className:'experience', href:'#career-akim'},
  {name:'Expertise', className:'expertise', href:'#expertise'},
  {name:'Tools & Skills', className:'tools', href:'#tools'},
  {name:'Projects', className:'projects', href:'#projects'},
  {name:'Research', className:'research', href:'#publications'}
] as const;

export default function ProfileIdentity() {
  const ref = useScrollProgress<HTMLDivElement>();
  const [flipped, setFlipped] = useState(false);
  return <div ref={ref} className="profile-identity">
    <div className="profile-orbit">
      <svg className="profile-orbit-ring" viewBox="0 0 340 340" aria-hidden="true">
        <circle cx="170" cy="170" r="144" className="orbit-track"/>
        <circle cx="170" cy="170" r="144" pathLength="1" className="orbit-progress"/>
        <circle cx="170" cy="170" r="118" className="orbit-inner"/>
      </svg>
      <div className="profile-orbit-satellite" aria-hidden="true"><i/></div>
      <div className="identity-card" onPointerMove={event => {if(event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches)return;const rect=event.currentTarget.getBoundingClientRect();event.currentTarget.style.setProperty('--identity-x',`${-(event.clientY-rect.top-rect.height/2)/18}deg`);event.currentTarget.style.setProperty('--identity-y',`${(event.clientX-rect.left-rect.width/2)/18}deg`);}} onPointerLeave={event => {event.currentTarget.style.setProperty('--identity-x','0deg');event.currentTarget.style.setProperty('--identity-y','0deg');}}>
        <div className={`identity-card-inner ${flipped?'is-flipped':''}`}><div className="identity-card-front" aria-hidden={flipped}><img src="/TahaErkinTunali/images/taha-erkin-tunali.jpeg" alt="Taha Erkin Tunalı" width="600" height="600" loading="lazy"/></div><div className="identity-card-back" aria-hidden={!flipped}><small>MECHANICAL ENGINEER</small><strong>TAHA</strong><span>Engine systems<br/>Simulation<br/>Research</span></div></div>
      </div>
      <div className="profile-orbit-links" role="navigation" aria-label="Explore my portfolio">
        {profileTopics.map(topic=><a key={topic.name} href={topic.href} className={`orbit-tag ${topic.className}`}>{topic.name}<ArrowUpRight size={13} aria-hidden="true"/></a>)}
      </div>
    </div>
    <div className="profile-signature"><strong>{p.fullName}</strong><span><MapPin size={14}/>{p.location}</span></div>
    <button type="button" className="identity-turn" aria-pressed={flipped} onClick={() => setFlipped(!flipped)}><RotateCw size={14}/>{flipped?'Show portrait':'Turn my card'}</button>
  </div>;
}

const stats = [
  {value: 15, prefix: '', suffix: '+', label: 'Vehicle variants simulated'},
  {value: 2, prefix: '', suffix: '', label: 'Research publications'},
  {value: 50, prefix: '~', suffix: '%', label: 'Less calibration time & effort'}
];

export function ImpactStats() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      element.dataset.counted = 'true';
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const start = performance.now();
      const numbers = element.querySelectorAll<HTMLElement>('[data-count]');
      const tick = (time: number) => {
        const progress = Math.min(1, (time - start) / 1100);
        const eased = 1 - Math.pow(1 - progress, 3);
        numbers.forEach((number, index) => {
          const stat = stats[index];
          number.textContent = `${stat.prefix}${Math.round(stat.value * eased)}${stat.suffix}`;
        });
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, {threshold: .35});
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={root} className="impact-stats animated-stats interactive-stats">{stats.map((stat, index) =>
    <Dialog key={stat.label}><div><DialogTrigger asChild><button type="button" className="impact-story-trigger" aria-label={`Explore the work behind ${stat.prefix}${stat.value}${stat.suffix} ${stat.label}`}><strong><span data-count aria-hidden="true">{stat.prefix}{stat.value}{stat.suffix}</span><span className="sr-only">{stat.prefix}{stat.value}{stat.suffix}</span></strong><span>{stat.label}</span><small>See the work <Plus size={12}/></small></button></DialogTrigger></div><DialogContent className="impact-story-dialog"><span className="impact-dialog-number">{stat.prefix}{stat.value}{stat.suffix}</span><DialogTitle>{stat.label}</DialogTitle><DialogDescription>{index===1?'Published research in battery electric vehicle thermal management.':'Ford Otosan · Powertrain & thermal system simulation'}</DialogDescription>{index===1?<div className="impact-paper-list">{p.publications.map(paper=><a href={paper.url} key={paper.title} target="_blank" rel="noreferrer"><span>{paper.journal} · {paper.date}</span><h3>{paper.title}</h3><p>{paper.description}</p><small>Read publication <ExternalLink size={13}/></small></a>)}</div>:<div className="impact-project-story"><h3>My contribution</h3><p>{p.projects[0].approach}</p><h3>The result</h3><p>{p.projects[0].outcome}</p><div className="tags">{p.projects[0].tools.map(tool=><span key={tool}>{tool}</span>)}</div></div>}<a className="text-button" href={p.cv} target="_blank" rel="noreferrer">View the experience in my CV <FileText size={15}/></a></DialogContent></Dialog>
  )}</div>;
}
