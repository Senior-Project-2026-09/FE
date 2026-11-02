import type { AttackLevel, BattleEvent, MatchProblem, SubmissionResult } from '../api/types';

export interface ProblemView extends MatchProblem {
  level: AttackLevel;
  currentLimitSec: number;
  bomb: boolean;
  banned: string[];
  solved: boolean;
}

export interface SubmissionView {
  submissionId: string;
  submissionNo: number;
  problemNo: number;
  at: number;
  position: number | null;
  result: SubmissionResult | null;
  sentPoints: number;
}

export interface PendingAttack {
  attackId: string;
  fromId: string;
  toId: string;
  points: number;
  applyAt: number;
  expectedProblemNo: number | null;
}

export type LogKind = 'solved' | 'attack' | 'cancel' | 'applied' | 'info';
export interface LogEntry { seq: number; at: number; kind: LogKind; text: string }

export interface BattleState {
  problems: ProblemView[];
  submissions: SubmissionView[];
  pendingAttacks: PendingAttack[];
  mySolved: number;
  opponentSolved: number[];
  log: LogEntry[];
}

export interface BattleContext {
  problems: MatchProblem[];
  myId: string;
  opponentName: string;
}

export function initialState(ctx: BattleContext): BattleState {
  return {
    problems: ctx.problems.map((p) => ({ ...p, level: 0, currentLimitSec: p.timeLimitSec, bomb: false, banned: [], solved: false })),
    submissions: [],
    pendingAttacks: [],
    mySolved: 0,
    opponentSolved: [],
    log: [],
  };
}

const log = (s: BattleState, e: BattleEvent, kind: LogKind, text: string): LogEntry[] => [...s.log, { seq: e.seq, at: e.at, kind, text }];

// 서버 이벤트만으로 화면 상태를 만든다. 같은 이벤트 순서면 결과도 항상 같다.
export function reduce(s: BattleState, e: BattleEvent, ctx: BattleContext): BattleState {
  switch (e.type) {
    case 'submission:queued':
      return {
        ...s,
        submissions: [{ submissionId: e.submissionId, submissionNo: e.submissionNo, problemNo: e.problemNo, at: e.at, position: e.position, result: null, sentPoints: 0 }, ...s.submissions],
      };
    case 'submission:result': {
      const { seq: _seq, at, type: _type, submissionId, submissionNo, problemNo, ...result } = e;
      const view: SubmissionView = { submissionId, submissionNo, problemNo, at, position: null, result, sentPoints: 0 };
      const exists = s.submissions.some((x) => x.submissionId === submissionId);
      return {
        ...s,
        submissions: exists ? s.submissions.map((x) => (x.submissionId === submissionId ? view : x)) : [view, ...s.submissions],
      };
    }
    case 'match:solved': {
      if (e.playerId !== ctx.myId) {
        return { ...s, log: log(s, e, 'solved', `상대 ${e.problemNo}번 정답`) };
      }
      const submissions = s.submissions.map((x, i) => (i === s.submissions.findIndex((y) => y.problemNo === e.problemNo && y.result?.verdict === 'AC') ? { ...x, sentPoints: e.sent } : x));
      return {
        ...s,
        submissions,
        mySolved: s.mySolved + 1,
        problems: s.problems.map((p) => (p.no === e.problemNo ? { ...p, solved: true } : p)),
        log: log(s, e, 'solved', e.sent > 0 ? `${e.problemNo}번 정답 → ${e.sent}점 공격` : `${e.problemNo}번 정답`),
      };
    }
    case 'opponent:progress':
      return { ...s, opponentSolved: e.solved };
    case 'attack:incoming': {
      const next = [...s.pendingAttacks, { attackId: e.attackId, fromId: e.fromId, toId: e.toId, points: e.points, applyAt: e.applyAt, expectedProblemNo: e.expectedProblemNo }];
      if (e.toId !== ctx.myId) return { ...s, pendingAttacks: next };
      return { ...s, pendingAttacks: next, log: log(s, e, 'attack', `${ctx.opponentName}가 ${e.points}점 공격`) };
    }
    case 'attack:cancelled':
      return {
        ...s,
        pendingAttacks: s.pendingAttacks.flatMap((a) => (a.attackId !== e.attackId ? [a] : e.remaining > 0 ? [{ ...a, points: e.remaining }] : [])),
        log: log(s, e, 'cancel', e.byId === ctx.myId ? `내가 ${e.amount}점 상쇄` : `상대 ${e.amount}점으로 상쇄`),
      };
    case 'attack:applied': {
      const pendingAttacks = s.pendingAttacks.filter((a) => a.attackId !== e.attackId);
      const change = e.changes.map((c) => `${c.no}번`).join(', ');
      if (e.toId !== ctx.myId) return { ...s, pendingAttacks, log: log(s, e, 'applied', `남은 ${e.points}점 → 상대 ${change} 적용`) };
      return { ...s, pendingAttacks, log: log(s, e, 'applied', `${change}에 Lv${e.changes.at(-1)?.toLevel ?? 0} 적용`) };
    }
    case 'problem:conditions':
      return {
        ...s,
        problems: s.problems.map((p) => (p.no === e.problemNo ? { ...p, level: e.level, currentLimitSec: e.timeLimitSec, bomb: e.bomb, banned: e.banned } : p)),
      };
    default:
      return s;
  }
}

export function stateAt(events: BattleEvent[], elapsedMs: number, ctx: BattleContext): BattleState {
  return events.filter((e) => e.at <= elapsedMs).reduce((s, e) => reduce(s, e, ctx), initialState(ctx));
}
