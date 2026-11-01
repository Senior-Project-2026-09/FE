import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { stateAt } from '../battle/reducer';
import Icon from '../components/Icon';
import { clock } from '../components/format';
import { Avatar, LevelDots, PageTitle, VerdictMark } from '../components/ui';
import { MOCK_EVENTS } from '../mock/battleEvents';
import { DIFF_LABEL, LANG_LABEL, MATCH_PROBLEMS, ME, OPPONENT, RULES, STATEMENTS } from '../mock/data';

const CTX = { problems: MATCH_PROBLEMS, myId: ME.userId, opponentName: OPPONENT.nickname };
const SPEEDS = [1, 2, 4];
const FILTERS = [{ id: 'all', label: '전체' }, { id: 'solved', label: '정답' }, { id: 'attack', label: '공격' }, { id: 'cancel', label: '상쇄' }];
const OPP_CODE = 'int n, k; cin >> n >> k;\nvector<int> a(n);\nfor (int &x : a) cin >> x;\nsort(a.begin(), a.end());\nint l = 0, r = n - 1, count = 0;\nwhile (l < r) {\n    int sum = a[l] + a[r];\n    if (sum == k) { ++count; ++l; --r; }\n    else if (sum < k) ++l;\n    else --r;\n}\ncout << count;';

export default function ReplayPage() {
  const { matchId } = useParams();
  const total = RULES.durationSec * 1000;
  const [at, setAt] = useState(372_000);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [filter, setFilter] = useState('all');
  const [selectedNo, setSelectedNo] = useState(3);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => setAt((v) => Math.min(total, v + 1000 * speed)), 1000);
    return () => window.clearInterval(timer);
  }, [playing, speed, total]);

  const state = useMemo(() => stateAt(MOCK_EVENTS, at, CTX), [at]);
  const allLog = useMemo(() => stateAt(MOCK_EVENTS, total, CTX).log, [total]);
  const visible = allLog.filter((l) => l.at <= at && (filter === 'all' || (filter === 'attack' ? l.kind === 'attack' || l.kind === 'applied' : l.kind === filter))).slice(-6).reverse();
  const submission = state.submissions.find((s) => s.problemNo === selectedNo && s.result);
  const problem = state.problems.find((p) => p.no === selectedNo) ?? state.problems[0];

  return (
    <div className="replay">
      <PageTitle
        title="다시 보기"
        sub={<span className="num">{ME.nickname} vs {OPPONENT.nickname} · 2026-11-15</span>}
        side={<Link to={`/result/${matchId}`} className="btn">리포트 보기 <Icon name="arrowRight" size={14} /></Link>}
      />

      <section className="panel replay-controls" aria-label="재생">
        <div className="replay-buttons">
          <button type="button" className="btn primary" onClick={() => setPlaying((v) => !v)}><Icon name="play" size={14} />{playing ? '일시정지' : '재생'}</button>
          <div className="segmented small">{SPEEDS.map((s) => <button key={s} type="button" className={speed === s ? 'on' : ''} onClick={() => setSpeed(s)} aria-pressed={speed === s}>{s}x</button>)}</div>
          <strong className="num replay-clock">{clock(at)}</strong><span className="muted num">/ {clock(total)}</span>
        </div>
        <div className="replay-slider">
          <input type="range" min={0} max={total} step={1000} value={at} onChange={(e) => setAt(Number(e.target.value))} aria-label="재생 위치" />
          <div className="replay-marks" aria-hidden="true">
            {allLog.map((l) => <i key={l.seq} className={l.kind} style={{ left: `${(l.at / total) * 100}%` }} />)}
          </div>
        </div>
      </section>

      <div className="replay-grid">
        <article className="code-pane">
          <header><span className="row-8"><Avatar name={ME.nickname} size={24} /><strong>{ME.nickname}</strong><span className="muted">{LANG_LABEL[ME.lang]}</span></span><b className="num">{state.mySolved}/5</b></header>
          <div className="mini-tabs" role="tablist">
            {state.problems.map((p) => (
              <button key={p.no} type="button" role="tab" aria-selected={selectedNo === p.no} className={selectedNo === p.no ? 'on' : ''} onClick={() => setSelectedNo(p.no)}>
                <span className="num">{p.no}</span> {DIFF_LABEL[p.difficulty]} {p.solved && <Icon name="check" size={12} />}
                {p.level > 0 && !p.solved && <LevelDots level={p.level} />}
              </button>
            ))}
          </div>
          <p className="pane-title"><strong>{problem.title}</strong>{submission?.result && <span className="num"><VerdictMark verdict={submission.result.verdict} /> {submission.result.maxTimeSec.toFixed(3)}초</span>}</p>
          <pre><code>{STATEMENTS[selectedNo].starter}</code></pre>
          <footer><span>{submission ? `제출 #${submission.submissionNo}` : '작성 중'}</span>{submission && submission.sentPoints > 0 && <span className="link">{submission.sentPoints}점 공격 보냄</span>}</footer>
        </article>

        <article className="code-pane">
          <header><span className="row-8"><Avatar name={OPPONENT.nickname} size={24} /><strong>{OPPONENT.nickname}</strong><span className="muted">{LANG_LABEL[OPPONENT.lang]}</span></span><b className="num">{state.opponentSolved.length}/5</b></header>
          <p className="pane-title"><strong>두 수의 합 개수</strong><span className="muted">작성 중</span></p>
          <pre><code>{OPP_CODE}</code></pre>
          <footer><span>편집 중인 코드</span><span className="muted">{clock(at)} 시점</span></footer>
        </article>

        <aside className="panel replay-events">
          <header className="panel-head"><h2>사건 목록</h2><span className="panel-side">최신순</span></header>
          <div className="filter-tabs">{FILTERS.map((f) => <button key={f.id} type="button" className={filter === f.id ? 'on' : ''} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>)}</div>
          {visible.length === 0 ? <p className="muted small-text pad">이 시점까지 해당 사건이 없어요.</p> : (
            <ol className="plain event-cards">
              {visible.map((l) => (
                <li key={l.seq}><button type="button" onClick={() => setAt(l.at)} className={l.kind}><small className="num">#{l.seq} · {clock(l.at)}</small><span><i />{l.text}</span></button></li>
              ))}
            </ol>
          )}
        </aside>
      </div>
      <p className="muted small-text">사건을 선택하면 두 선수의 코드와 문제 상태가 그 시점으로 바뀌어요.</p>
    </div>
  );
}
