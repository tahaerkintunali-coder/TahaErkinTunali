"use client";

import {useEffect, useRef} from 'react';

// Keep continuous scroll animation out of React's render loop.
export function useScrollProgress<T extends HTMLElement>(onProgress?: (progress: number) => void) {
  const ref = useRef<T>(null);
  const callback = useRef(onProgress);
  useEffect(() => { callback.current = onProgress; }, [onProgress]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    let alive = true;
    let previous = -1;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      element.dataset.inView = String(visible);
      const progress = Math.max(0, Math.min(1, (window.innerHeight * .76 - rect.top) / Math.max(1, rect.height * .72)));
      if (Math.abs(progress - previous) < .001) return;
      previous = progress;
      element.style.setProperty('--section-progress', String(progress));
      callback.current?.(progress);
    };
    const schedule = () => { if (alive && !frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    document.fonts.ready.then(schedule);
    schedule();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  return ref;
}
