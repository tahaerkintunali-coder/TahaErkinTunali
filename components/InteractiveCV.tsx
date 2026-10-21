"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, Download, FileText, Maximize2, Move, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { portfolio } from '@/data/portfolio';

const pages = portfolio.cvPages;
const defaultRotation = { x: 6, y: -18 };
type Turn = { from: number; to: number; direction: 'forward' | 'backward' };
type Props = { expanded?: boolean; initialPage?: number; onPageChange?: (page: number) => void };

export default function InteractiveCV({ expanded = false, initialPage = 0, onPageChange }: Props) {
  const [page, setPage] = useState(initialPage);
  const [rotation, setRotation] = useState(defaultRotation);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ id: number; x: number; y: number; rotation: typeof defaultRotation } | null>(null);
  const turnLock = useRef(false);
  const completeTurn = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!turn) return;
    const finish = () => {
      setPage(turn.to);
      setTurn(null);
      turnLock.current = false;
      onPageChange?.(turn.to);
    };
    completeTurn.current = finish;
    const timeout = window.setTimeout(finish, 700);
    return () => { window.clearTimeout(timeout); completeTurn.current = null; };
  }, [turn, onPageChange]);

  useEffect(() => {
    // Preload adjacent pages so that a turn reveals a ready image.
    for (const next of [page - 1, page + 1]) {
      if (pages[next]) { const image = new Image(); image.src = pages[next].src; }
    }
  }, [page]);

  function changePage(step: number) {
    if (turnLock.current) return;
    const next = page + step;
    if (next < 0 || next >= pages.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPage(next); onPageChange?.(next); return;
    }
    turnLock.current = true;
    setTurn({ from: page, to: next, direction: step > 0 ? 'forward' : 'backward' });
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, rotation };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    setRotation({
      x: event.pointerType === 'touch' ? start.rotation.x : Math.max(-35, Math.min(35, start.rotation.x - (event.clientY - start.y) * .18)),
      y: Math.max(-75, Math.min(75, start.rotation.y + (event.clientX - start.x) * .28))
    });
  }

  function endDrag() { drag.current = null; setDragging(false); }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key.toLowerCase();
    if (key === 'arrowleft' || key === 'arrowright') {
      event.preventDefault(); changePage(key === 'arrowright' ? 1 : -1);
    } else if (key === 'home') {
      event.preventDefault(); setRotation(defaultRotation);
    } else if (['w', 'a', 's', 'd'].includes(key)) {
      event.preventDefault();
      setRotation(value => ({
        x: Math.max(-35, Math.min(35, value.x + (key === 'w' ? -5 : key === 's' ? 5 : 0))),
        y: Math.max(-75, Math.min(75, value.y + (key === 'a' ? -8 : key === 'd' ? 8 : 0)))
      }));
    }
  }

  const visiblePage = turn?.direction === 'forward' ? turn.to : page;
  const turningPage = turn?.direction === 'forward' ? turn.from : turn?.to;
  const selectedPage = turn?.to ?? page;

  return (
    <div className={`interactive-cv ${expanded ? 'is-expanded' : 'is-compact'}`}>
      <div
        className={`cv-viewport ${dragging ? 'is-dragging' : ''}`}
        tabIndex={0} role="group"
        aria-label="Interactive 3D CV. Drag to rotate. Arrow keys turn pages. W A S D rotate. Home resets the view."
        aria-keyshortcuts="ArrowLeft ArrowRight W A S D Home"
        onKeyDown={keyboard} onPointerDown={startDrag} onPointerMove={moveDrag}
        onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}
      >
        <div className="cv-ground-shadow" />
        <div className="cv-paper-object" style={{ '--cv-x': `${rotation.x}deg`, '--cv-y': `${rotation.y}deg` } as CSSProperties}>
          {[3, 2, 1].map(sheet => <span className="cv-back-sheet" key={sheet} style={{ transform: `translate3d(${sheet * 1.5}px,${sheet * 1.5}px,${-sheet * 3}px)` }} aria-hidden="true" />)}
          <div className="cv-current-sheet"><img src={pages[visiblePage].src} alt={`Original CV, page ${visiblePage + 1}: ${pages[visiblePage].title}`} width="1191" height="1684" loading="lazy" draggable={false} /></div>
          {turn && turningPage !== undefined && <div className={`cv-turn-sheet cv-turn-${turn.direction}`} key={`${turn.from}-${turn.to}`} aria-hidden="true" onAnimationEnd={() => completeTurn.current?.()}>
            <div className="cv-turn-front"><img src={pages[turningPage].src} alt="" width="1191" height="1684" draggable={false} /></div>
            <div className="cv-turn-back" />
          </div>}
          <span className="cv-binding" aria-hidden="true" />
        </div>
      </div>
      <div className="cv-interaction-hint"><Move size={14} /><span>Drag to rotate · Use arrows to turn pages</span></div>
      <div className="cv-controls">
        <button type="button" aria-label="Previous CV page" onClick={() => changePage(-1)} disabled={page === 0 || !!turn}><ChevronLeft size={19} /></button>
        <span className="cv-page-number" role="status" aria-live="polite">Page {selectedPage + 1} / {pages.length}</span>
        <button type="button" aria-label="Next CV page" onClick={() => changePage(1)} disabled={page === pages.length - 1 || !!turn}><ChevronRight size={19} /></button>
        <span className="cv-controls-divider" />
        <button type="button" aria-label="Reset CV rotation" onClick={() => setRotation(defaultRotation)}><RotateCcw size={16} /></button>
      </div>
      <p className="cv-page-caption">{pages[selectedPage].title}</p>
      {!expanded && <Dialog>
        <DialogTrigger asChild><button className="cv-enlarge-button" type="button">Enlarge &amp; read <Maximize2 size={15} /></button></DialogTrigger>
        <DialogContent className="cv-reader-dialog">
          <DialogTitle>{portfolio.fullName} — CV</DialogTitle>
          <DialogDescription>Read all four original pages. Drag to rotate the document or use the arrows to turn a page.</DialogDescription>
          <InteractiveCV expanded initialPage={page} onPageChange={setPage} />
          <div className="cv-reader-actions"><a href={portfolio.cv} target="_blank" rel="noreferrer" className="button secondary">Open full PDF <FileText size={16} /></a><a href={portfolio.cv} download className="button primary">Download CV <Download size={16} /></a></div>
        </DialogContent>
      </Dialog>}
    </div>
  );
}
