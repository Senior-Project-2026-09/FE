import type { Verdict } from '../api/types';

export const clock = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const VERDICT_CLASS: Record<Verdict, string> = { AC: 'good', WA: 'bad', TLE: 'warn', MLE: 'warn', RE: 'bad', CE: 'bad', RESTRICTED: 'bad', SE: 'quiet' };
export const verdictClass = (v: Verdict) => VERDICT_CLASS[v];
