import type { ReactNode } from 'react';
import { useState } from 'react';
import type { AttackLevel, Difficulty, MatchResult, Verdict } from '../api/types';
import { DIFF_LABEL } from '../mock/data';
import { verdictClass } from './format';
import Icon from './Icon';

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size }} aria-label={name} role="img">
      <Icon name="user" size={Math.round(size * 0.5)} />
    </span>
  );
}

export function DiffChip({ value }: { value: Difficulty }) {
  return <span className="chip">{DIFF_LABEL[value]}</span>;
}

export function LevelDots({ level, label = true }: { level: AttackLevel; label?: boolean }) {
  return (
    <span className="level-dots" role="img" aria-label={`공격 단계 ${level}`}>
      {[1, 2, 3].map((n) => <i key={n} className={n <= level ? 'on' : ''} />)}
      {label && level > 0 && <b>Lv{level}</b>}
    </span>
  );
}

export function VerdictMark({ verdict }: { verdict: Verdict }) {
  return <span className={`verdict ${verdictClass(verdict)}`}><i />{verdict}</span>;
}

const RESULT_LABEL: Record<MatchResult, string> = { WIN: '승', LOSE: '패', DRAW: '무' };
export function ResultMark({ result }: { result: MatchResult }) {
  return <span className={`result ${result.toLowerCase()}`}>{RESULT_LABEL[result]}</span>;
}

export function CopyButton({ value, label = '복사' }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      window.setTimeout(() => setDone(false), 1500);
    } catch {
      setDone(false);
    }
  };
  return (
    <button type="button" className="btn ghost small" onClick={copy}>
      <Icon name={done ? 'check' : 'copy'} size={14} />
      {done ? '복사됨' : label}
    </button>
  );
}

export function Panel({ title, side, children, className = '' }: { title?: ReactNode; side?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`}>
      {title && <header className="panel-head"><h2>{title}</h2>{side && <div className="panel-side">{side}</div>}</header>}
      {children}
    </section>
  );
}

export function PageTitle({ title, sub, side, chip }: { title: string; sub?: ReactNode; side?: ReactNode; chip?: ReactNode }) {
  return (
    <header className="page-title">
      <div>
        <div className="page-title-row"><h1>{title}</h1>{chip}</div>
        {sub && <p>{sub}</p>}
      </div>
      {side && <div className="page-title-side">{side}</div>}
    </header>
  );
}

export function Field({ label, value }: { label: string; value: ReactNode }) {
  return <div className="field-view"><span>{label}</span><strong>{value}</strong></div>;
}
