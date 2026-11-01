// 서버 연결 전 화면 확인용 샘플 데이터. 실제 API를 연결하면 이 폴더를 지운다.
import type { Difficulty, Lang, MatchProblem, MatchResult, MatchRules, ProblemProgress, Verdict } from '../api/types';

export const LANG_LABEL: Record<Lang, string> = { CPP: 'C++', PYTHON: 'Python 3', JAVASCRIPT: 'JavaScript' };
export const DIFF_LABEL: Record<Difficulty, string> = { LOW: '하', MID: '중', HIGH: '상' };
export const VERDICT_LABEL: Record<Verdict, string> = {
  AC: '통과', WA: '오답', TLE: '시간 초과', MLE: '메모리 초과', RE: '실행 오류', CE: '컴파일 오류', RESTRICTED: '금지 문법', SE: '채점 오류',
};

export const ME = { userId: 'usr_codea', nickname: 'codeA', lang: 'PYTHON' as Lang, wins: 12, losses: 8 };
export const OPPONENT = { userId: 'usr_byteb', nickname: 'byteB', lang: 'CPP' as Lang, wins: 21, losses: 13 };
export const ROOM_CODE = '482917';
export const MATCH_ID = 'mat_1042';

export const RULES: MatchRules = {
  durationSec: 900, applyDelaySec: 45, attackTlFactor: 0.7, maxSendPoints: 3, spectateDelaySec: 30, codeSyncIntervalSec: 10,
};

export const MATCH_PROBLEMS: MatchProblem[] = [
  { no: 1, problemId: 'prb_prefix_sum', title: '구간 합 질의', difficulty: 'LOW', timeLimitSec: 0.5, memoryLimitMb: 256, maxAttackLevel: 3 },
  { no: 2, problemId: 'prb_two_sum_count', title: '두 수의 합 개수', difficulty: 'LOW', timeLimitSec: 0.5, memoryLimitMb: 256, maxAttackLevel: 3 },
  { no: 3, problemId: 'prb_number_card', title: '숫자 카드 찾기', difficulty: 'MID', timeLimitSec: 0.5, memoryLimitMb: 256, maxAttackLevel: 3 },
  { no: 4, problemId: 'prb_maze', title: '미로 최단 거리', difficulty: 'MID', timeLimitSec: 0.5, memoryLimitMb: 256, maxAttackLevel: 3 },
  { no: 5, problemId: 'prb_lis', title: '가장 긴 증가 부분 수열', difficulty: 'HIGH', timeLimitSec: 0.5, memoryLimitMb: 256, maxAttackLevel: 3 },
];

export interface Statement {
  summary: string[];
  input: string[];
  output: string[];
  sampleIn: string;
  sampleOut: string;
  tag: string;
  starter: string;
}

const statement = (s: Partial<Statement> & Pick<Statement, 'summary' | 'tag'>): Statement => ({
  input: ['입력 형식은 지문을 따라요.'], output: ['정답을 한 줄에 출력해요.'], sampleIn: '1\n', sampleOut: '1\n',
  starter: 'import sys\n\n', ...s,
});

export const STATEMENTS: Record<number, Statement> = {
  1: statement({
    summary: ['수열과 질의 Q개가 주어져요. 각 질의의 구간 합을 구하세요.'], tag: '누적 합',
    input: ['첫째 줄에 수열의 길이 N과 질의 수 Q가 주어져요.', '둘째 줄에 수열의 원소 N개가 주어져요.', '다음 Q개 줄에 질의의 두 정수 l, r이 주어져요.'],
    output: ['각 질의에 대한 구간의 합을 한 줄에 하나씩 출력해요.'], sampleIn: '5 2\n1 2 3 4 5\n1 3\n2 5\n', sampleOut: '6\n14\n',
    starter: 'import sys\ninput = sys.stdin.readline\nn, q = map(int, input().split())\na = list(map(int, input().split()))\nprefix = [0]\nfor x in a:\n    prefix.append(prefix[-1] + x)\n',
  }),
  2: statement({
    summary: ['서로 다른 정수 N개가 주어져요. 합이 K인 두 수의 쌍 개수를 구하세요.', '같은 쌍은 순서와 관계없이 한 번만 세어요.'], tag: '투 포인터',
    input: ['첫째 줄에 정수 N과 K가 주어져요.', '둘째 줄에 서로 다른 정수 N개가 주어져요.'],
    output: ['합이 K인 두 수의 쌍 개수를 출력해요.'], sampleIn: '6 9\n1 2 3 6 7 8\n', sampleOut: '3\n',
    starter: 'import sys\nn, k = map(int, sys.stdin.readline().split())\na = list(map(int, sys.stdin.readline().split()))\ncount = 0\nfor i in range(n):\n    for j in range(i + 1, n):\n        if a[i] + a[j] == k: count += 1\nprint(count)\n',
  }),
  3: statement({ summary: ['카드 N장과 질의 M개가 주어져요. 각 수가 카드에 있는지 구하세요.'], tag: '이분 탐색', sampleIn: '3 2\n1 3 5\n3 4\n', sampleOut: '1 0\n', starter: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\nn, m = map(int, input().split())\na = sorted(map(int, input().split()))\nanswer = []\nfor x in map(int, input().split()):\n    i = bisect_left(a, x)\n    answer.append(int(i < n and a[i] == x))\nprint(*answer)\n' }),
  4: statement({ summary: ['미로의 시작점에서 도착점까지 가는 최단 거리를 구하세요.'], tag: 'BFS', sampleIn: '2 2\n..\n..\n', sampleOut: '2\n' }),
  5: statement({ summary: ['수열에서 가장 긴 증가 부분 수열의 길이를 구하세요.'], tag: 'LIS', sampleIn: '6\n10 20 10 30 20 50\n', sampleOut: '4\n' }),
};

// 경기 결과 (대결 이벤트와 같은 경기)
export interface ProblemResult {
  no: number;
  difficulty: Difficulty;
  mine: Verdict | null;
  mineTries: number;
  solvedAt: number | null;
  received: number;
  opponent: Verdict | null;
}

export const PROBLEM_RESULTS: ProblemResult[] = [
  { no: 1, difficulty: 'LOW', mine: 'AC', mineTries: 2, solvedAt: 130_000, received: 0, opponent: 'AC' },
  { no: 2, difficulty: 'LOW', mine: 'AC', mineTries: 3, solvedAt: 525_000, received: 2, opponent: 'AC' },
  { no: 3, difficulty: 'MID', mine: 'AC', mineTries: 1, solvedAt: 372_000, received: 0, opponent: 'WA' },
  { no: 4, difficulty: 'MID', mine: 'AC', mineTries: 1, solvedAt: 690_000, received: 2, opponent: null },
  { no: 5, difficulty: 'HIGH', mine: null, mineTries: 0, solvedAt: null, received: 0, opponent: 'AC' },
];

export const myScore = PROBLEM_RESULTS.filter((p) => p.mine === 'AC').length;
export const oppScore = PROBLEM_RESULTS.filter((p) => p.opponent === 'AC').length;
console.assert(myScore === 4 && oppScore === 3, '경기 점수가 문제별 결과와 다름');

export interface TimelineEvent { at: number; kind: 'attack' | 'cancel'; side: 'sent' | 'received'; label: string }
export const ATTACK_TIMELINE: TimelineEvent[] = [
  { at: 299_000, kind: 'attack', side: 'received', label: '상대 2점 공격' },
  { at: 372_000, kind: 'attack', side: 'sent', label: '3점 공격' },
  { at: 400_000, kind: 'cancel', side: 'sent', label: '상대 1점으로 상쇄' },
  { at: 417_000, kind: 'attack', side: 'sent', label: '남은 2점 → 상대 4번 적용' },
  { at: 490_000, kind: 'attack', side: 'received', label: '상대 3점 공격' },
  { at: 525_000, kind: 'cancel', side: 'received', label: '내가 1점 상쇄, 남은 2점은 4번 적용' },
];

// 공격 점수는 상쇄 전 기준이다
export const ATTACK_TOTALS = {
  me: { sent: 3, received: 5, cancelled: 1 },
  opponent: { sent: 5, received: 3, cancelled: 1 },
};

export const REPORT = {
  problemNo: 2,
  title: '두 수의 합 개수',
  timeLimitSec: 0.35,
  baseSec: 0.03,
  bombSec: 5.6,
  afterFixSec: 0.08,
  slow: {
    label: '이중 for문', complexity: 'O(N²)',
    code: 'for i in range(n):\n    for j in range(i + 1, n):\n        if a[i] + a[j] == k:\n            count += 1',
  },
  intended: {
    label: '정렬 + 투 포인터', complexity: 'O(N log N)',
    code: 'a.sort(); l, r = 0, n - 1\nwhile l < r:\n    s = a[l] + a[r]; count += (s == k)\n    l += (s <= k); r -= (s >= k)',
  },
  opponentFirst: { verdict: 'AC' as Verdict, maxTimeSec: 0.02, lang: 'CPP' as Lang, label: '정렬 + 투 포인터' },
  myFirst: { verdict: 'TLE' as Verdict, maxTimeSec: 0.35, lang: 'PYTHON' as Lang, label: '이중 for문' },
  practiceTags: ['투 포인터', '이분 탐색'],
};

// 연습 문제
export interface PracticeProblem {
  problemId: string; title: string; difficulty: Difficulty; tier: string; tags: string[]; bomb: boolean; acceptance: number; progress: ProblemProgress;
}
export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  { problemId: 'prb_two_sum_count', title: '두 수의 합 개수', difficulty: 'LOW', tier: 'Silver V', tags: ['투 포인터'], bomb: true, acceptance: 0.61, progress: 'SOLVED' },
  { problemId: 'prb_number_card', title: '숫자 카드 찾기', difficulty: 'MID', tier: 'Silver IV', tags: ['이분 탐색'], bomb: true, acceptance: 0.48, progress: 'ATTEMPTED' },
  { problemId: 'prb_maze', title: '미로 최단 거리', difficulty: 'MID', tier: 'Silver I', tags: ['BFS'], bomb: true, acceptance: 0.42, progress: 'UNTRIED' },
  { problemId: 'prb_lis', title: '가장 긴 증가 부분 수열', difficulty: 'HIGH', tier: 'Gold IV', tags: ['LIS'], bomb: true, acceptance: 0.23, progress: 'UNTRIED' },
  { problemId: 'prb_prefix_sum', title: '구간 합 질의', difficulty: 'LOW', tier: 'Silver V', tags: ['누적 합'], bomb: true, acceptance: 0.7, progress: 'UNTRIED' },
  { problemId: 'prb_bracket', title: '괄호 검사', difficulty: 'LOW', tier: 'Silver IV', tags: ['스택'], bomb: false, acceptance: 0.66, progress: 'UNTRIED' },
];
export const PRACTICE_TAGS = ['구현', '정렬', '누적 합', '투 포인터', '이분 탐색', '해시', 'BFS', '그리디', '스택', '우선순위 큐', 'DP', 'LIS'];

// 내 기록
export interface RecentMatch { matchId: string; opponent: string; result: MatchResult; score: string; date: string }
export const RECENT_MATCHES: RecentMatch[] = [
  { matchId: MATCH_ID, opponent: 'byteB', result: 'WIN', score: '4:3', date: '2026-11-15' },
  { matchId: 'mat_1041', opponent: 'loopC', result: 'LOSE', score: '2:4', date: '2026-11-14' },
  { matchId: 'mat_1038', opponent: 'nodeD', result: 'WIN', score: '5:3', date: '2026-11-12' },
];
export const MY_STATS = {
  avgSolveSec: 192,
  cancelRate: 0.38,
  langShare: [{ lang: 'PYTHON' as Lang, matches: 15 }, { lang: 'CPP' as Lang, matches: 5 }],
  recentResults: ['WIN', 'LOSE', 'WIN', 'LOSE', 'WIN', 'LOSE', 'WIN', 'LOSE', 'WIN', 'WIN'] as MatchResult[],
  weakTags: [
    { tag: '투 포인터', attempts: 8, bombTle: 5, problem: '두 수의 합 개수' },
    { tag: '이분 탐색', attempts: 6, bombTle: 3, problem: '숫자 카드 찾기' },
    { tag: 'BFS', attempts: 5, bombTle: 1, problem: '미로 최단 거리' },
  ],
};
const shareSum = MY_STATS.langShare.reduce((s, l) => s + l.matches, 0);
console.assert(shareSum === ME.wins + ME.losses, '언어별 경기 수가 전체 경기 수와 다름');

// 진행 중인 경기
export const LIVE_MATCHES = [
  { roomCode: ROOM_CODE, a: 'codeA', b: 'byteB', aSolved: 2, bSolved: 2, remainingSec: 461, spectators: 24 },
  { roomCode: '310284', a: 'algoE', b: 'stackF', aSolved: 2, bSolved: 1, remainingSec: 564, spectators: 16 },
  { roomCode: '775102', a: 'sortG', b: 'queueH', aSolved: 3, bSolved: 2, remainingSec: 318, spectators: 12 },
  { roomCode: '926431', a: 'treeI', b: 'graphJ', aSolved: 1, bSolved: 1, remainingSec: 666, spectators: 8 },
];
export const LOBBY_SUMMARY = { onlineCount: 128, liveMatchCount: LIVE_MATCHES.length };
