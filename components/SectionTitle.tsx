import type { ReactNode } from 'react';

export default function SectionTitle({ number, children }: { number: string; children: ReactNode }) {
  return <><div className="section-kicker" aria-hidden="true">{number} /</div><h2 className="section-title">{children}</h2></>;
}
