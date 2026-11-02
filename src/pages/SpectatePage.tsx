import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { stateAt } from '../battle/reducer';
import Icon from '../components/Icon';
import { clock } from '../components/format';
import { Avatar, VerdictMark } from '../components/ui';
import { MOCK_EVENTS, SCENES } from '../mock/battleEvents';
import { LANG_LABEL, MATCH_PROBLEMS, ME, OPPONENT, RULES, STATEMENTS } from '../mock/data';

const OPP_CODE = 'int n, k; cin >> n >> k;\nvector<int> a(n);\nfor (int &x : a) cin >> x;\nsort(a.begin(), a.end());\nint l = 0, r = n - 1, count = 0;\nwhile (l < r) {\n    int sum = a[l] + a[r];\n    if (sum == k) { ++count; ++l; --r; }\n    else if (sum < k) ++l;\n    else --r;\n}\ncout << count;';

export default function SpectatePage() {
  // 관전자는 모든 이벤트와 코드를 같은 30초 지연 시점으로 받는다
  const elapsed = SCENES.mid + 30_000 - RULES.spectateDelaySec * 1000;
  const ctx = useMemo(() => ({ problems: MATCH_PROBLEMS, myId: ME.userId, opponentName: OPPONENT.nickname }), []);
  const state = useMemo(() => stateAt(MOCK_EVENTS, elapsed, ctx), [elapsed, ctx]);
  const latest = state.submissions.find((s) => s.result);
  const log = [...state.log].slice(-5);

  return (
    <div className="spectate">
      <header className="page-title">
        <div>
          <div className="page-title-row"><h1>관전</h1><span className="pill blue">30초 지연</span></div>
          <p>점수와 코드는 같은 지연 시점이에요. 관전자 24명</p>
        </div>
        <Link to="/spectate" className="btn ghost"><Icon name="exit" size={14} />나가기</Link>
      </header>

      <section className="score-strip" aria-label="현재 점수">
        <div>
          <Avatar name={ME.nickname} size={40} />
          <div><strong>{ME.nickname}</strong><small>{LANG_LABEL[ME.lang]}</small></div>
          <p className="score num">{state.mySolved}<small>/5</small></p>
        </div>
        <div className="score-clock"><small>남은 시간</small><strong className="num">{clock(RULES.durationSec * 1000 - elapsed)}</strong></div>
        <div className="opponent">
          <p className="score num">{state.opponentSolved.length}<small>/5</small></p>
          <div><strong>{OPPONENT.nickname}</strong><small>{LANG_LABEL[OPPONENT.lang]}</small></div>
          <Avatar name={OPPONENT.nickname} size={40} />
        </div>
      </section>

      <div className="code-compare">
        <article className="code-pane">
          <header><strong>{ME.nickname}</strong><span className="muted">2번 · 두 수의 합 개수</span></header>
          <pre><code>{STATEMENTS[2].starter}</code></pre>
          <footer><span>읽기 전용 · Python 3</span>{latest?.result && <VerdictMark verdict={latest.result.verdict} />}</footer>
        </article>
        <article className="code-pane">
          <header><strong>{OPPONENT.nickname}</strong><span className="muted">2번 · 두 수의 합 개수</span></header>
          <pre><code>{OPP_CODE}</code></pre>
          <footer><span>읽기 전용 · C++</span><VerdictMark verdict="AC" /></footer>
        </article>
      </div>

      <section className="panel">
        <header className="panel-head"><h2>최근 사건</h2><span className="panel-side">{state.pendingAttacks.length === 0 ? '대기 공격 없음' : `대기 공격 ${state.pendingAttacks.length}건`} · 최근 5건</span></header>
        <ol className="event-log wide">
          {log.map((l) => <li key={l.seq} className={l.kind}><time className="num">{clock(l.at)}</time><i /><span>{l.text}</span></li>)}
        </ol>
      </section>
    </div>
  );
}
