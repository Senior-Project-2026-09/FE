// 서버 없이 대결 화면을 돌려 보는 가짜 이벤트. 시간과 공격 계산은 대결 규칙에 맞춘다.
import type { AttackLevel, BattleEvent, SubmissionResult } from '../api/types';
import { ME, OPPONENT, RULES } from './data';

const ms = (min: number, sec: number) => (min * 60 + sec) * 1000;
const delay = RULES.applyDelaySec * 1000;

const result = (r: Partial<SubmissionResult> & Pick<SubmissionResult, 'verdict' | 'maxTimeSec' | 'maxMemoryMb'>, level: AttackLevel = 0): SubmissionResult => ({
  passed: 7,
  total: 7,
  groups: [{ group: 'SAMPLE', passed: 1, total: 1 }, { group: 'BASE', passed: 6, total: 6 }],
  failedAt: null,
  attack: { level, tlFactor: level > 0 ? RULES.attackTlFactor : 1, bomb: level >= 2, banned: [] },
  countsAsWrong: r.verdict !== 'AC',
  ...r,
});

type Raw = BattleEvent extends infer E ? (E extends BattleEvent ? Omit<E, 'seq'> : never) : never;

const raw: Raw[] = [
  { at: ms(1, 40), type: 'submission:result', submissionId: 'sub_1', submissionNo: 1, problemNo: 1, ...result({ verdict: 'WA', passed: 1, total: 7, maxTimeSec: 0.018, maxMemoryMb: 30.8, groups: [{ group: 'SAMPLE', passed: 1, total: 1 }, { group: 'BASE', passed: 0, total: 6 }], failedAt: { group: 'BASE', index: 1, n: 1000 } }) },
  { at: ms(2, 10), type: 'submission:result', submissionId: 'sub_2', submissionNo: 2, problemNo: 1, ...result({ verdict: 'AC', maxTimeSec: 0.021, maxMemoryMb: 31.2 }) },
  { at: ms(2, 10), type: 'match:solved', playerId: ME.userId, problemNo: 1, points: 1, cancelled: 0, sent: 0 },
  { at: ms(4, 59), type: 'opponent:progress', solved: [1] },
  { at: ms(4, 59), type: 'match:solved', playerId: OPPONENT.userId, problemNo: 1, points: 2, cancelled: 0, sent: 2 },
  { at: ms(4, 59), type: 'attack:incoming', attackId: 'atk_1', fromId: OPPONENT.userId, toId: ME.userId, points: 2, applyAt: ms(4, 59) + delay, expectedProblemNo: 2 },
  { at: ms(5, 44), type: 'attack:applied', attackId: 'atk_1', toId: ME.userId, points: 2, changes: [{ no: 2, fromLevel: 0, toLevel: 2 }] },
  { at: ms(5, 44), type: 'problem:conditions', problemNo: 2, level: 2, timeLimitSec: 0.35, originalTimeLimitSec: 0.5, bomb: true, banned: [] },
  { at: ms(6, 12), type: 'submission:result', submissionId: 'sub_3', submissionNo: 3, problemNo: 3, ...result({ verdict: 'AC', maxTimeSec: 0.041, maxMemoryMb: 34.1 }) },
  { at: ms(6, 12), type: 'match:solved', playerId: ME.userId, problemNo: 3, points: 3, cancelled: 0, sent: 3 },
  { at: ms(6, 12), type: 'attack:incoming', attackId: 'atk_2', fromId: ME.userId, toId: OPPONENT.userId, points: 3, applyAt: ms(6, 12) + delay, expectedProblemNo: 4 },
  { at: ms(6, 40), type: 'opponent:progress', solved: [1, 2] },
  { at: ms(6, 40), type: 'attack:cancelled', attackId: 'atk_2', byId: OPPONENT.userId, amount: 1, remaining: 2 },
  { at: ms(6, 57), type: 'attack:applied', attackId: 'atk_2', toId: OPPONENT.userId, points: 2, changes: [{ no: 4, fromLevel: 0, toLevel: 2 }] },
  { at: ms(7, 7), type: 'submission:result', submissionId: 'sub_4', submissionNo: 4, problemNo: 2, ...result({ verdict: 'TLE', passed: 8, total: 10, maxTimeSec: 0.351, maxMemoryMb: 38.2, groups: [{ group: 'SAMPLE', passed: 1, total: 1 }, { group: 'BASE', passed: 6, total: 6 }, { group: 'BOMB', passed: 1, total: 3 }], failedAt: { group: 'BOMB', index: 2, n: 100000 } }, 2) },
  { at: ms(7, 15), type: 'submission:queued', submissionId: 'sub_5', submissionNo: 5, problemNo: 2, position: 1 },
  { at: ms(8, 0), type: 'submission:result', submissionId: 'sub_5', submissionNo: 5, problemNo: 2, ...result({ verdict: 'WA', passed: 7, total: 10, maxTimeSec: 0.029, maxMemoryMb: 38.2, groups: [{ group: 'SAMPLE', passed: 1, total: 1 }, { group: 'BASE', passed: 6, total: 6 }, { group: 'BOMB', passed: 0, total: 3 }], failedAt: { group: 'BOMB', index: 1, n: 100000 } }, 2) },
  { at: ms(8, 10), type: 'opponent:progress', solved: [1, 2, 5] },
  { at: ms(8, 10), type: 'match:solved', playerId: OPPONENT.userId, problemNo: 5, points: 3, cancelled: 0, sent: 3 },
  { at: ms(8, 10), type: 'attack:incoming', attackId: 'atk_3', fromId: OPPONENT.userId, toId: ME.userId, points: 3, applyAt: ms(8, 10) + delay, expectedProblemNo: 2 },
];

export const MOCK_EVENTS: BattleEvent[] = raw.map((e, i) => ({ ...e, seq: i + 1 }) as BattleEvent);

// 개발 중 바로 볼 수 있는 Figma 장면. 값은 경기 시작 후 경과 ms다.
export const SCENES = {
  start: -3000,
  early: ms(0, 8),
  mid: ms(7, 19),
  attack: ms(8, 23),
} as const;
export type SceneName = keyof typeof SCENES;
