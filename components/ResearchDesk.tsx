"use client";

import {useState, type CSSProperties, type PointerEvent} from 'react';
import {ArrowUpRight, BookOpen, ExternalLink, Sparkles} from 'lucide-react';
import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {portfolio as p} from '@/data/portfolio';
import {useScrollProgress} from '@/lib/use-scroll-progress';

function moveBook(event:PointerEvent<HTMLButtonElement>) {
  if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--book-x', `${-(event.clientY - rect.top - rect.height / 2) / 22}deg`);
  event.currentTarget.style.setProperty('--book-y', `${(event.clientX - rect.left - rect.width / 2) / 17}deg`);
  event.currentTarget.style.setProperty('--light-x', `${(event.clientX - rect.left) / rect.width * 100}%`);
  event.currentTarget.style.setProperty('--light-y', `${(event.clientY - rect.top) / rect.height * 100}%`);
}

export default function ResearchDesk() {
  const [focus, setFocus] = useState(0);
  const ref = useScrollProgress<HTMLDivElement>();
  const areas = ['Heat pumps & range', 'Machine learning & control'];
  return <div ref={ref} className="research-desk">
    <div className="research-path reveal"><div className="interaction-label"><Sparkles size={16}/>Two perspectives on electric vehicle efficiency</div><div className="research-focus-controls">{areas.map((area, i) => <button type="button" key={area} aria-pressed={focus === i} onClick={() => setFocus(i)}><span>0{i + 1}</span>{area}<ArrowUpRight size={16}/></button>)}</div><p className="research-focus-description" aria-live="polite">{p.publications[focus].description}</p></div>
    <div className="publication-grid">{p.publications.map((paper, i) => <Dialog key={paper.title}><article className={`publication-card reveal interactive-publication ${focus === i ? 'is-focused' : ''}`} style={{'--paper-accent':i === 0 ? '#dfbd84' : '#91bcf0'} as CSSProperties}>
      <DialogTrigger asChild><button type="button" className="publication-cover research-book-stage" onPointerMove={moveBook} onPointerLeave={event => { event.currentTarget.style.setProperty('--book-x', '0deg'); event.currentTarget.style.setProperty('--book-y', '0deg'); }} aria-label={`Preview research: ${paper.title}`}><span className="research-book"><img src={paper.cover} alt={`${paper.journal} journal cover`} loading="lazy" width="240" height="320"/><i className="research-book-spine" aria-hidden="true"/></span><span className="book-preview-label">Preview research <PlusIcon/></span></button></DialogTrigger>
      <div className="publication-body"><div className="paper-meta"><BookOpen size={16}/><span>RESEARCH PAPER / 0{i + 1}</span></div><p className="journal-name">{paper.journal}</p><h3>{paper.title}</h3><p className="paper-description">{paper.description}</p><span className="paper-date">{paper.date}</span><div className="paper-bottom"><span>{paper.topic}</span><a href={paper.url} target="_blank" rel="noreferrer" className="text-button">Read publication <ExternalLink size={16}/></a></div></div>
    </article><DialogContent className="research-dialog"><div className="research-dialog-cover"><img src={paper.cover} alt="" width="180" height="240"/></div><div><DialogTitle>{paper.title}</DialogTitle><DialogDescription>{paper.journal} · {paper.date}</DialogDescription><p className="research-dialog-summary">{paper.description}</p><span className="research-dialog-topic">{paper.topic}</span><a href={paper.url} target="_blank" rel="noreferrer" className="button primary">Read published paper <ExternalLink size={16}/></a></div></DialogContent></Dialog>)}</div>
  </div>;
}

function PlusIcon() { return <span aria-hidden="true">＋</span>; }
