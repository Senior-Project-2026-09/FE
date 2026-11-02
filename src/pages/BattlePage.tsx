import Editor from '@monaco-editor/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { BattleEvent, Lang } from '../api/types';
import { stateAt } from '../battle/reducer';
import type { BattleState, PendingAttack, ProblemView, SubmissionView } from '../battle/reducer';
import Icon from '../components/Icon';
import { clock, verdictClass } from '../components/format';
import { Avatar, DiffChip, LevelDots, VerdictMark } from '../components/ui';
import { MOCK_EVENTS, SCENES } from '../mock/battleEvents';
import type { SceneName } from '../mock/battleEvents';
import { DIFF_LABEL, LANG_LABEL, MATCH_ID, MATCH_PROBLEMS, ME, OPPONENT, RULES, STATEMENTS, VERDICT_LABEL } from '../mock/data';

const CTX = { problems: MATCH_PROBLEMS, myId: ME.userId, opponentName: OPPONENT.nickname };
const MONACO_LANG: Record<Lang, string> = { PYTHON: 'python', CPP: 'cpp', JAVASCRIPT: 'javascript' };
const GROUP_LABEL = { SAMPLE: '예제', BASE: '기본', BOMB: '폭탄' };

const isScene = (v: string | null): v is SceneName => v !== null && v in SCENES;

function solveDots(solved: number) {
  return <span className="solve-dots" aria-hidden="true">{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= solved ? 'on' : ''} />)}</span>;
}

function ScoreBar({ state, elapsed, incoming }: { state: BattleState; elapsed: number; incoming: PendingAttack | undefined }) {
  return (
    <header className="battle-bar">
      <div className="battle-player">
        <Avatar name={ME.nickname} size={28} />
        <strong>{ME.nickname}</strong>
        <span className="muted lang">{LANG_LABEL[ME.lang]}</span>
        <b className="num">{state.mySolved}/5</b>
        {solveDots(state.mySolved)}
      </div>
      <div className="battle-clock" role="timer" aria-label="남은 시간">
        <strong className="num">{clock(RULES.durationSec * 1000 - Math.max(0, elapsed))}</strong>
        {incoming && <small className="num">공격 도착 {clock(incoming.applyAt - elapsed).slice(1)}</small>}
      </div>
      <div className="battle-player right">
        {solveDots(state.opponentSolved.length)}
        <b className="num">{state.opponentSolved.length}/5</b>
        <span className="muted lang">{LANG_LABEL[OPPONENT.lang]}</span>
        <strong>{OPPONENT.nickname}</strong>
        <Avatar name={OPPONENT.nickname} size={28} />
        <Link to="/" className="btn ghost small"><Icon name="exit" size={14} />나가기</Link>
      </div>
    </header>
  );
}

function ProblemTabs({ problems, selected, onSelect, incoming }: { problems: ProblemView[]; selected: number; onSelect: (no: number) => void; incoming: PendingAttack | undefined }) {
  return (
    <div className="problem-tabs" role="tablist" aria-label="문제 선택">
      {problems.map((p) => (
        <button key={p.no} type="button" role="tab" aria-selected={selected === p.no} className={`${selected === p.no ? 'on ' : ''}${p.level > 0 ? 'attacked' : ''}`} onClick={() => onSelect(p.no)}>
          <span className="tab-title"><b className="num">{p.no}</b><small>{DIFF_LABEL[p.difficulty]}</small>{p.solved && <Icon name="check" size={14} />}</span>
          {p.level > 0 && !p.solved && <LevelDots level={p.level} label={false} />}
          {incoming?.expectedProblemNo === p.no && <em className="num">+{incoming.points}</em>}
        </button>
      ))}
    </div>
  );
}

function Conditions({ problem }: { problem: ProblemView }) {
  if (problem.level === 0) return null;
  return (
    <aside className="conditions">
      <strong>공격으로 바뀐 조건</strong>
      <p>시간 제한 <span className="num">{problem.timeLimitSec}초</span> → <b className="num">{problem.currentLimitSec}초</b> <small>Lv1</small></p>
      {problem.bomb && <p>폭탄 테스트 3개 추가 · <span className="num">N = 100,000</span> <small>Lv2</small></p>}
      {problem.banned.length > 0 && <p>금지 문법 {problem.banned.join(', ')} <small>Lv3</small></p>}
      {problem.bomb && <em>O(N²) 풀이는 시간 초과가 나요</em>}
    </aside>
  );
}

function ProblemPane({ problem }: { problem: ProblemView }) {
  const s = STATEMENTS[problem.no];
  return (
    <div className="problem-body">
      <Conditions problem={problem} />
      <div className="row-8"><h1>{problem.title}</h1><DiffChip value={problem.difficulty} /></div>
      <p className="muted small-text num">시간 {problem.currentLimitSec}초 · 메모리 {problem.memoryLimitMb}MB</p>
      {s.summary.map((t) => <p key={t}>{t}</p>)}
      <h2>입력</h2>
      {s.input.map((t) => <p key={t}>{t}</p>)}
      <h2>출력</h2>
      {s.output.map((t) => <p key={t}>{t}</p>)}
      <div className="sample-grid">
        <div><h2>예제 입력</h2><pre><code>{s.sampleIn}</code></pre></div>
        <div><h2>예제 출력</h2><pre><code>{s.sampleOut}</code></pre></div>
      </div>
      <span className="chip">{s.tag}</span>
    </div>
  );
}

function ResultSummary({ submission }: { submission: SubmissionView | undefined }) {
  if (!submission) return <p className="console-empty">아직 제출하지 않았어요.</p>;
  const r = submission.result;
  if (!r) return <p className="console-empty">#{submission.submissionNo} 채점 중 · 대기열 {submission.position}번째</p>;
  const base = r.groups.find((g) => g.group === 'BASE');
  return (
    <div className="result-summary">
      <p>
        제출 #{submission.submissionNo} · <VerdictMark verdict={r.verdict} />
        {r.failedAt && <> · {GROUP_LABEL[r.failedAt.group]} 테스트 {r.failedAt.index}번에서 {VERDICT_LABEL[r.verdict]} <span className="muted num">(N = {r.failedAt.n.toLocaleString()})</span></>}
      </p>
      <dl>
        <div><dt>관측 시간</dt><dd className={`num ${verdictClass(r.verdict)}`}>{r.maxTimeSec.toFixed(3)}초</dd></div>
        <div><dt>메모리</dt><dd className="num">{r.maxMemoryMb}MB</dd></div>
        {base && <div><dt>기본</dt><dd className="num">{base.passed}/{base.total} 통과</dd></div>}
      </dl>
    </div>
  );
}

function SubmissionDetail({ submission, onClose }: { submission: SubmissionView; onClose: () => void }) {
  const r = submission.result;
  if (!r) return null;
  return (
    <section className="rail-section detail">
      <header className="rail-head"><h2>판정 상세</h2><button type="button" className="link-button" onClick={onClose}>닫기</button></header>
      <p className="muted small-text">제출 #{submission.submissionNo} · {submission.problemNo}번</p>
      <p className="detail-verdict"><VerdictMark verdict={r.verdict} /> {VERDICT_LABEL[r.verdict]}</p>
      <table className="mini-table">
        <thead><tr><th>구간</th><th className="num">통과</th><th>결과</th></tr></thead>
        <tbody>
          {r.groups.map((g) => {
            const failed = r.failedAt?.group === g.group;
            return <tr key={g.group}><td>{GROUP_LABEL[g.group]}</td><td className="num">{g.passed}/{g.total}</td><td className={failed ? 'warn' : ''}>{failed ? `${r.failedAt?.index}번째 ${VERDICT_LABEL[r.verdict]}` : '통과'}</td></tr>;
          })}
        </tbody>
      </table>
      <dl className="kv">
        <div><dt>최대 관측 시간</dt><dd className="num">{r.maxTimeSec.toFixed(3)}초</dd></div>
        <div><dt>메모리</dt><dd className="num">{r.maxMemoryMb}MB</dd></div>
      </dl>
      <h3>당시 공격 상태</h3>
      <p><LevelDots level={r.attack.level} /> <span className="num">· 배율 {r.attack.tlFactor}</span>{r.attack.bomb && ' · 폭탄 켜짐'}</p>
      <p className="muted small-text">제출 순간 기준으로 채점돼요. 시간 제한에서 끊은 값이라 리포트의 재측정값과 다를 수 있어요.</p>
    </section>
  );
}

export default function BattlePage() {
  const [params] = useSearchParams();
  const sceneParam = params.get('scene');
  const scene: SceneName = isScene(sceneParam) ? sceneParam : 'start';
  return <BattleScreen key={scene} scene={scene} />;
}

function BattleScreen({ scene }: { scene: SceneName }) {
  const { roomCode } = useParams();
  const [, setParams] = useSearchParams();
  const [elapsed, setElapsed] = useState<number>(SCENES[scene]);
  const [extra, setExtra] = useState<BattleEvent[]>([]);
  const [selected, setSelected] = useState(scene === 'early' || scene === 'start' ? 1 : 2);
  const [lang, setLang] = useState<Lang>(ME.lang);
  const [codes, setCodes] = useState<Record<number, string>>(() => Object.fromEntries(MATCH_PROBLEMS.map((p) => [p.no, STATEMENTS[p.no].starter])));
  const [consoleTab, setConsoleTab] = useState<'console' | 'result'>('result');
  const [sampleOutput, setSampleOutput] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const seqRef = useRef(1000);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((v) => Math.min(v + 1000, RULES.durationSec * 1000)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const events = useMemo(() => [...MOCK_EVENTS, ...extra].sort((a, b) => a.at - b.at || a.seq - b.seq), [extra]);
  const state = useMemo(() => stateAt(events, elapsed, CTX), [events, elapsed]);
  const incoming = state.pendingAttacks.find((a) => a.toId === ME.userId);
  const problem = state.problems.find((p) => p.no === selected) ?? state.problems[0];
  const latest = state.submissions.find((s) => s.problemNo === selected) ?? state.submissions[0];
  const detail = state.submissions.find((s) => s.submissionId === detailId);
  const judging = state.submissions.some((s) => !s.result);
  const nextNo = state.submissions.length + 1;

  const submit = () => {
    if (judging || problem.solved) return;
    const id = `sub_local_${seqRef.current}`;
    const at = elapsed;
    const passed = 1;
    setExtra((x) => [
      ...x,
      { seq: seqRef.current++, at, type: 'submission:queued', submissionId: id, submissionNo: nextNo, problemNo: selected, position: 1 },
      { seq: seqRef.current++, at: at + 2000, type: 'submission:result', submissionId: id, submissionNo: nextNo, problemNo: selected, verdict: 'WA', passed, total: 7, maxTimeSec: 0.024, maxMemoryMb: 31.5, groups: [{ group: 'SAMPLE', passed, total: 1 }, { group: 'BASE', passed: 0, total: 6 }], failedAt: { group: 'BASE', index: 1, n: 1000 }, attack: { level: problem.level, tlFactor: problem.level ? RULES.attackTlFactor : 1, bomb: problem.bomb, banned: problem.banned }, countsAsWrong: true },
    ]);
    setConsoleTab('result');
  };

  const runSample = () => {
    const s = STATEMENTS[selected];
    setSampleOutput(`예제 1 입력\n${s.sampleIn}\n기대 출력\n${s.sampleOut}\n서버 연결 후 실제 실행 결과가 표시돼요.`);
    setConsoleTab('console');
  };

  return (
    <div className="battle" data-room={roomCode}>
      <ScoreBar state={state} elapsed={elapsed} incoming={incoming} />

      <div className="battle-grid">
        <section className="battle-left" aria-label="문제">
          <ProblemTabs problems={state.problems} selected={selected} onSelect={setSelected} incoming={incoming} />
          <ProblemPane problem={problem} />
        </section>

        <section className="battle-center" aria-label="코드 편집기">
          <div className="editor-bar">
            <label className="select-bare">
              <span className="sr-only">언어</span>
              <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
                {(Object.keys(LANG_LABEL) as Lang[]).map((l) => <option key={l} value={l}>{LANG_LABEL[l]}</option>)}
              </select>
            </label>
            <span className="muted small-text">들여쓰기 4칸 · UTF-8</span>
            <button type="button" className="icon-btn" aria-label="코드 처음 상태로" onClick={() => setCodes((c) => ({ ...c, [selected]: STATEMENTS[selected].starter }))}><Icon name="reset" /></button>
          </div>
          <div className="editor-area">
            <Editor
              height="100%"
              language={MONACO_LANG[lang]}
              value={codes[selected]}
              onChange={(v) => setCodes((c) => ({ ...c, [selected]: v ?? '' }))}
              loading={<pre className="editor-fallback"><code>{codes[selected]}</code></pre>}
              options={{ fontSize: 14, minimap: { enabled: false }, tabSize: 4, wordWrap: 'on', scrollBeyondLastLine: false, padding: { top: 16 }, automaticLayout: true, overviewRulerLanes: 0 }}
            />
          </div>
          <div className="console">
            <div className="console-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={consoleTab === 'console'} className={consoleTab === 'console' ? 'on' : ''} onClick={() => setConsoleTab('console')}>콘솔</button>
              <button type="button" role="tab" aria-selected={consoleTab === 'result'} className={consoleTab === 'result' ? 'on' : ''} onClick={() => setConsoleTab('result')}>제출 결과</button>
            </div>
            <div className="console-body">
              {consoleTab === 'result' ? <ResultSummary submission={latest} /> : sampleOutput ? <pre><code>{sampleOutput}</code></pre> : <p className="console-empty">예제 실행 결과가 여기에 표시돼요.</p>}
            </div>
            <div className="console-actions">
              <span className="muted small-text">Ctrl + Enter로 제출</span>
              <button type="button" className="btn" onClick={runSample}>예제 실행</button>
              <button type="button" className="btn submit" onClick={submit} disabled={judging || problem.solved}><Icon name="arrowUp" size={14} />{problem.solved ? '해결함' : judging ? '채점 중' : '제출'}</button>
            </div>
          </div>
        </section>

        <aside className="battle-right" aria-label="경기 상황">
          <section className={`rail-section attack-box ${incoming ? 'active' : ''}`}>
            <header className="rail-head"><h2>내게 오는 공격</h2><span className="num">{state.pendingAttacks.filter((a) => a.toId === ME.userId).length}</span></header>
            {incoming ? (
              <>
                <p className="attack-line"><i /><span>{OPPONENT.nickname}가 <b className="num">{incoming.points}점</b> 공격{incoming.expectedProblemNo ? ` → ${incoming.expectedProblemNo}번` : ''}</span><strong className="num">{clock(incoming.applyAt - elapsed).slice(1)}</strong></p>
                <div className="attack-track" role="progressbar" aria-valuemin={0} aria-valuemax={RULES.applyDelaySec} aria-valuenow={Math.ceil((incoming.applyAt - elapsed) / 1000)}><span style={{ width: `${Math.max(0, ((incoming.applyAt - elapsed) / (RULES.applyDelaySec * 1000)) * 100)}%` }} /></div>
                <p className="muted small-text">아무 문제나 맞히면 막을 수 있어요. 막으면 남은 점수로 반격해요.</p>
              </>
            ) : <p className="muted small-text">대기 중인 공격이 없어요.</p>}
          </section>

          {detail ? <SubmissionDetail submission={detail} onClose={() => setDetailId(null)} /> : (
            <section className="rail-section">
              <header className="rail-head"><h2>내 제출</h2><span className="muted small-text">최신순 · {state.submissions.length}건</span></header>
              {state.submissions.length === 0 ? <p className="muted small-text">아직 제출하지 않았어요.</p> : (
                <ul className="plain submissions">
                  {state.submissions.map((s) => (
                    <li key={s.submissionId}>
                      <button type="button" disabled={!s.result} onClick={() => setDetailId(s.submissionId)}>
                        <span className="sub-top"><span>#{s.submissionNo} · {s.problemNo}번 · </span>{s.result ? <VerdictMark verdict={s.result.verdict} /> : <b>채점 중</b>}<small>{s.result ? VERDICT_LABEL[s.result.verdict] : `대기열 ${s.position}번째`}</small></span>
                        {s.result && <span className="sub-meta num">{s.result.maxTimeSec.toFixed(3)}초 · {s.result.maxMemoryMb}MB{s.sentPoints > 0 && <em>+{s.sentPoints}점 보냄</em>}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section className="rail-section grow-rail">
            <header className="rail-head"><h2>사건 로그</h2><span className="muted small-text">시간순</span></header>
            {state.log.length === 0 ? <p className="muted small-text">경기가 시작됐어요.</p> : (
              <ol className="event-log">
                {state.log.slice(-6).map((l) => <li key={l.seq} className={l.kind}><time className="num">{clock(l.at)}</time><i /><span>{l.text}</span></li>)}
              </ol>
            )}
          </section>
        </aside>
      </div>

      {elapsed < 0 && (
        <div className="countdown" role="status">
          <div>
            <p>두 선수 모두 준비됐어요</p>
            <strong className="num">{Math.ceil(-elapsed / 1000)}</strong>
            <p>곧 문제 5개가 공개돼요</p>
            <ul><li>맞히면 공격</li><li>45초 안에 맞히면 상쇄</li><li>폭탄은 느린 풀이만</li></ul>
          </div>
        </div>
      )}

      {elapsed >= RULES.durationSec * 1000 && (
        <div className="countdown" role="status"><div><p>경기가 끝났어요</p><Link to={`/result/${MATCH_ID}`} className="btn primary">결과 보기</Link></div></div>
      )}

      {import.meta.env.DEV && (
        <div className="dev-scenes" aria-label="개발용 장면 선택">
          {(Object.keys(SCENES) as SceneName[]).map((s) => <button key={s} type="button" className={s === scene ? 'on' : ''} onClick={() => setParams({ scene: s })}>{s}</button>)}
          <Link to={`/result/${MATCH_ID}`}>result</Link>
        </div>
      )}
    </div>
  );
}
