/** Map the reading position to the actual centers of the career milestones. */
export function getCareerProgress(centers: readonly number[], readingPosition: number) {
  const first = centers[0];
  const last = centers[centers.length - 1];
  if (first === undefined || last === undefined) return { progress: 0, current: -1, reached: [] as boolean[] };
  const reached = centers.map(center => readingPosition >= center);
  const current = reached.lastIndexOf(true);
  const progress = last > first
    ? Math.max(0, Math.min(1, (readingPosition - first) / (last - first)))
    : readingPosition >= first ? 1 : 0;
  return { progress, current, reached };
}
