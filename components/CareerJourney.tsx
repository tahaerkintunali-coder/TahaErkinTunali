"use client";

import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { career } from '@/data/career';
import SectionTitle from '@/components/SectionTitle';
import { portfolio } from '@/data/portfolio';
import { getCareerProgress } from '@/lib/career-progress';

const stages = [
  { year: '2018', label: 'The foundation', color: '#e7c47a', rgb: '231,196,122' },
  { year: '2021', label: 'Into industry', color: '#44cce3', rgb: '68,204,227' },
  { year: '2022', label: 'Engineering in practice', color: '#50d5b1', rgb: '80,213,177' },
  { year: '2024', label: 'Automotive development', color: '#8e9cff', rgb: '142,156,255' }
] as const;

export default function CareerJourney() {
  const timeline = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const markers = useRef<Array<HTMLButtonElement | null>>([]);
  const milestones = useRef<Array<HTMLLIElement | null>>([]);
  const currentName = useRef<HTMLSpanElement>(null);
  const currentCount = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = timeline.current;
    const progressRail = rail.current;
    if (!container || !progressRail) return;
    let frame = 0;
    let disposed = false;
    let measureNeeded = true;
    let centers: number[] = [];
    let previousCurrent = -2;
    let previousPercent = -1;

    function update() {
      frame = 0;
      if (!container || !progressRail) return;
      if (measureNeeded) {
        const bounds = container.getBoundingClientRect();
        const stops = markers.current.map(marker => marker?.getBoundingClientRect());
        if (stops.length !== career.length || stops.some(stop => !stop)) return;
        centers = stops.map(stop => stop!.top + window.scrollY + stop!.height / 2);
        const length = centers[centers.length - 1] - centers[0];
        container.style.setProperty('--career-rail-top', `${centers[0] - (bounds.top + window.scrollY)}px`);
        container.style.setProperty('--career-rail-length', `${length}px`);
        container.style.setProperty('--career-rail-x', `${stops[0]!.left + stops[0]!.width / 2 - bounds.left}px`);
        container.style.setProperty('--career-gradient', `linear-gradient(to bottom, ${centers.map((center, index) => `${stages[index].color} ${(center - centers[0]) / Math.max(length, 1) * 100}%`).join(', ')})`);
        measureNeeded = false;
      }
      const state = getCareerProgress(centers, window.scrollY + window.innerHeight * .57);
      container.style.setProperty('--career-fill', `${state.progress * 100}%`);
      const percent = Math.round(state.progress * 100);
      if (percent !== previousPercent) {
        progressRail.setAttribute('aria-valuenow', String(percent));
        progressRail.setAttribute('aria-valuetext', state.current >= 0 ? `${career[state.current].name} · ${percent}% of the journey` : 'The journey starts at Yıldız Technical University');
        previousPercent = percent;
      }
      if (state.current !== previousCurrent) {
        state.reached.forEach((reached, index) => {
          const milestone = milestones.current[index];
          if (milestone) {
            milestone.dataset.reached = String(reached);
            milestone.dataset.current = String(index === state.current);
          }
          if (index === state.current) markers.current[index]?.setAttribute('aria-current', 'step');
          else markers.current[index]?.removeAttribute('aria-current');
        });
        const current = state.current >= 0 ? career[state.current] : null;
        if (currentName.current) currentName.current.textContent = current?.name ?? 'Start at Yıldız Technical University';
        if (currentCount.current) currentCount.current.textContent = `${String(state.current + 1).padStart(2, '0')} / 04`;
        progressRail.setAttribute('aria-valuetext', current ? `${current.name} · ${percent}% of the journey` : 'The journey starts at Yıldız Technical University');
        container.style.setProperty('--career-current-color', stages[Math.max(0, state.current)].color);
        previousCurrent = state.current;
      }
    }

    function schedule() { if (!disposed && !frame) frame = window.requestAnimationFrame(update); }
    function measure() { measureNeeded = true; schedule(); }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(container);
    const section = container.closest('section');
    if (section) observer?.observe(section);
    document.fonts?.ready.then(() => { if (!disposed) measure(); });
    schedule();
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
      observer?.disconnect();
    };
  }, []);

  return (
    <section id="journey" className="section career-section career-scroll-journey">
      <div className="section-heading reveal">
        <div>
          <SectionTitle number="02">Education &amp; Career</SectionTitle>
          <p className="section-subtitle">Where I studied, worked and grew as an engineer.</p>
        </div>
        <p>Scroll through my journey from university to automotive engineering. Select a milestone to explore the experience behind it.</p>
      </div>
      <div className="career-scroll-cue"><ArrowDown size={17} /><span>Scroll to follow my journey</span><span className="career-cue-line" /></div>
      <div className="career-timeline-shell" ref={timeline}>
      <div className="career-reading-position"><span className="career-reading-dot" /><span ref={currentName}>Start at Yıldız Technical University</span><span className="career-reading-count" ref={currentCount}>00 / 04</span></div>
      <div className="career-rail" ref={rail} role="progressbar" aria-label="Progress through my education and career" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
        <div className="career-rail-fill" aria-hidden="true" />
        <span className="career-rail-head" aria-hidden="true" />
      </div>
      <ol className="career-timeline" aria-label="Education and career in chronological order">
        {career.map((entry, index) => (
          <li key={entry.id} id={`career-${entry.id}`} className={`career-milestone ${index % 2 === 0 ? 'is-left' : 'is-right'}`} data-reached="false" data-current="false" ref={node => { milestones.current[index] = node; }} style={{ '--career-accent': stages[index].color, '--career-accent-rgb': stages[index].rgb } as CSSProperties}>
            <Dialog>
              <div className="career-year-side" aria-hidden="true"><span>{stages[index].year}</span><small>{stages[index].label}</small></div>
              <DialogTrigger asChild>
                <button type="button" className={`career-stop ${entry.id}`} ref={node => { markers.current[index] = node; }} aria-label={`Explore my experience at ${entry.name}`}>
                  <img src={entry.logo} alt={`${entry.name} logo`} width="112" height="112" loading="lazy" />
                  <span className="career-stop-count" aria-hidden="true">0{index + 1}</span>
                </button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <button type="button" className="career-card career-timeline-card reveal" aria-label={`Read my roles and experience at ${entry.name}`}>
                  <div className="career-card-top"><span>{stages[index].label}</span><ArrowUpRight size={20} /></div>
                  <span className="career-period">{entry.period}</span>
                  <h3>{entry.name}</h3>
                  <p className="career-role">{entry.role}</p>
                  <p className="career-summary">{entry.summary}</p>
                  <span className="career-link">View experience <Plus size={16} /></span>
                </button>
              </DialogTrigger>
              <DialogContent className="career-dialog">
                <div className="career-dialog-head">
                  <div className={`career-dialog-logo ${entry.id}`}><img src={entry.logo} alt="" width="160" height="75" /></div>
                  <div><DialogTitle>{entry.name}</DialogTitle><DialogDescription>{entry.period}</DialogDescription></div>
                </div>
                <p className="career-dialog-intro">{entry.introduction}</p>
                <div className="career-positions">
                  {entry.positions.map(position => <div key={position.title}><span>{position.period}</span><h3>{position.title}</h3></div>)}
                </div>
                <div className="career-details">
                  <h3>{entry.id === 'yildiz' ? 'Studies & activities' : 'My experience & contributions'}</h3>
                  <ul>{entry.contributions.map(item => <li key={item}>{item}</li>)}</ul>
                  <h3>Experience gained</h3>
                  <p>{entry.gained}</p>
                </div>
                <div className="career-tags">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              </DialogContent>
            </Dialog>
          </li>
        ))}
      </ol>
      </div>
      <div className="career-footer"><span>Languages</span><div className="language-list">{portfolio.languages.map(language => <span key={language}>{language}</span>)}</div></div>
    </section>
  );
}
