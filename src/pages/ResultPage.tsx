import type { CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { clock } from '../components/format';
import { Avatar, DiffChip, Panel, VerdictMark } from '../components/ui';
import { ATTACK_TIMELINE, ATTACK_TOTALS, LANG_LABEL, ME, myScore, OPPONENT, oppScore, PROBLEM_RESULTS, REPORT, RULES, VERDICT_LABEL } from '../mock/data';

const SPEEDUP = Math.round(REPORT.bombSec / REPORT.afterFixSec);
const SCALE_MAX = 6;
const pct = (sec: number) => `${(sec / SCALE_MAX) * 100}%`;
const TICKS = [0, 2, 4, 6];

const BARS = [
  { label: '기본 TC', sec: REPORT.baseSec, tone: 'quiet' },
  { label: '폭탄 TC', sec: REPORT.bombSec, tone: 'warn' },
  { label: '개선 후', sec: REPORT.afterFixSec, tone: 'blue' },
];

function Timeline() {
  const total = RULES.durationSec * 1000;
  const lanes = [{ side: 'sent', label: '내가 보낸 공격' }, { side: 'received', label: '받은 공격' }] as const;
  return (
    <div className="timeline">
      {lanes.map((lane) => (
        <div key={lane.side} className="timeline-lane">
          <span>{lane.label}</span>
          <div className="timeline-track">
            {ATTACK_TIMELINE.filter((e) => e.side === lane.side).map((e) => (
              <i key={e.at} className={e.kind} style={{ left: `${(e.at / total) * 100}%` }} title={`${clock(e.at)} ${e.label}`} />
            ))}
          </div>
        </div>
      ))}
      <div className="timeline-axis num"><span /><div>{['00:00', '05:00', '10:00', '15:00'].map((t) => <span key={t}>{t}</span>)}</div></div>
      <ul className="legend"><li><i className="attack" />공격</li><li><i className="cancel" />상쇄</li></ul>
      <ol className="timeline-list">
        {ATTACK_TIMELINE.map((e) => <li key={e.at}><time className="num">{clock(e.at)}</time><span>{e.label}</span></li>)}
      </ol>
    </div>
  );
}

export default function ResultPage() {
  const { matchId = '' } = useParams();

  return (
    <div className="page-narrow result-page">
      <Link to="/" className="back"><Icon name="arrowLeft" size={14} />뒤로</Link>
      <header className="result-head">
        <h1>{ME.nickname} <em>승</em> <span className="num">{myScore} : {oppScore}</span></h1>
        <p className="muted num">15:00 종료 · 2026-11-15</p>
      </header>

      <section className="versus">
        <div>
          <Avatar name={ME.nickname} size={40} />
          <div><strong>{ME.nickname}</strong> <span className="muted">{LANG_LABEL[ME.lang]} · {myScore}문제</span><small className="num">보낸 공격 {ATTACK_TOTALS.me.sent}점 · 받은 공격 {ATTACK_TOTALS.me.received}점 · 상쇄 {ATTACK_TOTALS.me.cancelled}점</small></div>
        </div>
        <div>
          <Avatar name={OPPONENT.nickname} size={40} />
          <div><strong>{OPPONENT.nickname}</strong> <span className="muted">{LANG_LABEL[OPPONENT.lang]} · {oppScore}문제</span><small className="num">보낸 공격 {ATTACK_TOTALS.opponent.sent}점 · 받은 공격 {ATTACK_TOTALS.opponent.received}점 · 상쇄 {ATTACK_TOTALS.opponent.cancelled}점</small></div>
        </div>
      </section>
      <p className="muted small-text">공격 점수는 상쇄 전 기준이에요.</p>

      <Panel title={`${REPORT.problemNo}번 문제에서 시간 초과가 난 이유`} side={<Link to={`/replay/${matchId}`} className="link">다시 보기에서 비교 <Icon name="arrowRight" size={14} /></Link>} className="report-card">
        <div className="solution-compare">
          <article>
            <header><strong>대표 느린 풀이 · {REPORT.slow.label}</strong><span className="muted num">{REPORT.slow.complexity}</span></header>
            <pre><code>{REPORT.slow.code}</code></pre>
          </article>
          <article>
            <header><strong>대표 풀이 · {REPORT.intended.label}</strong><span className="muted num">{REPORT.intended.complexity}</span></header>
            <pre><code>{REPORT.intended.code}</code></pre>
          </article>
        </div>

        <h3>입력 크기가 커지면 차이가 드러나요</h3>
        <div className="time-chart" role="img" aria-label={`기본 ${REPORT.baseSec}초, 폭탄 ${REPORT.bombSec}초, 개선 후 ${REPORT.afterFixSec}초, 제한 ${REPORT.timeLimitSec}초`}>
          <div className="time-rows">
            <span className="time-limit" style={{ '--ratio': REPORT.timeLimitSec / SCALE_MAX } as CSSProperties}><small className="num">제한 {REPORT.timeLimitSec}초</small></span>
            {BARS.map((b) => (
              <div key={b.label} className="time-row">
                <span>{b.label}</span>
                <div className="time-track"><i className={b.tone} style={{ width: pct(b.sec) }} /></div>
                <strong className={`num ${b.tone}`}>{b.sec}초</strong>
              </div>
            ))}
          </div>
          <div className="time-axis num"><span /><div>{TICKS.map((t) => <small key={t}>{t}초</small>)}</div><span /></div>
        </div>
        <p className="muted small-text">폭탄 TC는 리포트에서 재측정한 값이에요. 풀이 설명은 문제에 등록된 대표 풀이 기준이에요.</p>

        <p className="speedup">{REPORT.slow.complexity} → {REPORT.intended.complexity}으로 <b className="num">{SPEEDUP}배</b> 빨라졌어요.</p>

        <div className="first-subs">
          <div><small>내 첫 제출</small><p><VerdictMark verdict={REPORT.myFirst.verdict} /> <span className="num">제한 {REPORT.myFirst.maxTimeSec}초</span> · {LANG_LABEL[REPORT.myFirst.lang]} {REPORT.myFirst.label}</p></div>
          <div><small>{OPPONENT.nickname} 첫 제출</small><p><VerdictMark verdict={REPORT.opponentFirst.verdict} /> <span className="num">{REPORT.opponentFirst.maxTimeSec}초</span> · {LANG_LABEL[REPORT.opponentFirst.lang]} {REPORT.opponentFirst.label}</p></div>
        </div>
      </Panel>

      <Panel title="공격 타임라인"><Timeline /></Panel>

      <Panel title="문제별 결과" side={<span className="muted">정답 시각은 경기 시작 후 경과 시간이에요</span>}>
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>번호</th><th>난이도</th><th>내 판정</th><th className="num">정답 시각</th><th>받은 공격</th><th>상대 판정</th></tr></thead>
            <tbody>
              {PROBLEM_RESULTS.map((p) => (
                <tr key={p.no}>
                  <td className="num">{p.no}</td>
                  <td><DiffChip value={p.difficulty} /></td>
                  <td>{p.mine ? <><VerdictMark verdict={p.mine} /> {p.mineTries > 1 && <small className="muted num">{p.mineTries}회차</small>}</> : <span className="dash" title={VERDICT_LABEL.AC}>—</span>}</td>
                  <td className="num">{p.solvedAt ? clock(p.solvedAt) : <span className="dash">—</span>}</td>
                  <td>{p.received > 0 ? <b className="warn-text">Lv{p.received}</b> : <span className="dash">—</span>}</td>
                  <td>{p.opponent ? <VerdictMark verdict={p.opponent} /> : <span className="dash">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <footer className="result-foot">
        <div><h2>이 유형을 더 연습해 보세요</h2><div className="row-8">{REPORT.practiceTags.map((t) => <Link key={t} to={`/practice?tag=${encodeURIComponent(t)}`} className="chip link-chip">{t}</Link>)}</div></div>
        <div className="row-8"><Link to={`/replay/${matchId}`} className="btn"><Icon name="play" size={14} />다시 보기</Link><Link to="/" className="btn primary">로비로</Link></div>
      </footer>
    </div>
  );
}
