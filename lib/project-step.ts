// A little hysteresis prevents story changes from flickering at a scroll boundary.
export function getScrollStoryStep(progress:number, current:number) {
  if (progress >= 2 / 3 + .025) return 2;
  if (progress <= 1 / 3 - .025) return 0;
  if (current === 0 && progress >= 1 / 3 + .025) return 1;
  if (current === 2 && progress <= 2 / 3 - .025) return 1;
  return current;
}
