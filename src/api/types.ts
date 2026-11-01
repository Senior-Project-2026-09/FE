// API 명세 v0.3 기준 타입. @senior-project-2026-09/shared 배포 후 이 파일을 교체한다.
export type Difficulty = 'LOW' | 'MID' | 'HIGH';
export type Lang = 'CPP' | 'PYTHON' | 'JAVASCRIPT';
export type Verdict = 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE' | 'RESTRICTED' | 'SE';
export type TestGroup = 'SAMPLE' | 'BASE' | 'BOMB';
export type AttackLevel = 0 | 1 | 2 | 3;
export type MatchResult = 'WIN' | 'LOSE' | 'DRAW';
export type ProblemProgress = 'SOLVED' | 'ATTEMPTED' | 'UNTRIED';

export interface MatchRules {
  durationSec: number;
  applyDelaySec: number;
  attackTlFactor: number;
  maxSendPoints: number;
  spectateDelaySec: number;
  codeSyncIntervalSec: number;
}

export interface MatchProblem {
  no: number;
  problemId: string;
  title: string;
  difficulty: Difficulty;
  timeLimitSec: number;
  memoryLimitMb: number;
  maxAttackLevel: AttackLevel;
}

export interface SubmissionResult {
  verdict: Verdict;
  passed: number;
  total: number;
  maxTimeSec: number;
  maxMemoryMb: number;
  groups: { group: TestGroup; passed: number; total: number }[];
  failedAt: { group: TestGroup; index: number; n: number } | null;
  attack: { level: AttackLevel; tlFactor: number; bomb: boolean; banned: string[] };
  countsAsWrong: boolean;
}

// 소켓 이벤트. at은 경기 시작 후 경과 ms다.
export type BattleEvent = { seq: number; at: number } & (
  | { type: 'submission:queued'; submissionId: string; submissionNo: number; problemNo: number; position: number }
  | ({ type: 'submission:result'; submissionId: string; submissionNo: number; problemNo: number } & SubmissionResult)
  | { type: 'match:solved'; playerId: string; problemNo: number; points: number; cancelled: number; sent: number }
  | { type: 'opponent:progress'; solved: number[] }
  | { type: 'attack:incoming'; attackId: string; fromId: string; toId: string; points: number; applyAt: number; expectedProblemNo: number | null }
  | { type: 'attack:cancelled'; attackId: string; byId: string; amount: number; remaining: number }
  | { type: 'attack:applied'; attackId: string; toId: string; points: number; changes: { no: number; fromLevel: AttackLevel; toLevel: AttackLevel }[] }
  | { type: 'problem:conditions'; problemNo: number; level: AttackLevel; timeLimitSec: number; originalTimeLimitSec: number; bomb: boolean; banned: string[] }
);
