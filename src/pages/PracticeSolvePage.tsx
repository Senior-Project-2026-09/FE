import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { AttackLevel, Lang, Verdict } from '../api/types';
import Icon from '../components/Icon';
import { DiffChip, LevelDots, VerdictMark } from '../components/ui';
import { LANG_LABEL, ME, PRACTICE_PROBLEMS, PRACTICE_STATEMENT, RULES, STATEMENTS, VERDICT_LABEL } from '../mock/data';

const BASE_LIMIT = 0.5;
const MONACO_LANG: Record<Lang, string> = { PYTHON: 'python', CPP: 'cpp', JAVASCRIPT: 'javascript' };
const LEVELS: AttackLevel[] = [0, 1, 2, 3];
const parseLevel = (v: string | null): AttackLevel => (v === '1' ? 1 : v === '2' ? 2 : v === '3' ? 3 : 0);

interface PracticeSubmission { no: number; level: AttackLevel; verdict: Verdict | null; timeSec: number | null }

export default function PracticeSolvePage() {
  const { problemId = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const problem = PRACTICE_PROBLEMS.find((p) => p.problemId === problemId);
  const statement = STATEMENTS[PRACTICE_STATEMENT[problemId] ?? 0];
  const level = parseLevel(params.get('attack'));

  const [lang, setLang] = useState<Lang>(ME.lang);
  const [code, setCode] = useState(statement?.starter ?? '');
  const [submissions, setSubmissions] = useState<PracticeSubmission[]>([]);
  const [sampleOutput, setSampleOutput] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!problem || !statement) {
    return (
      <main className="solo"><div className="solo-column"><h1>문제를 찾을 수 없어요</h1><Link to="/practice" className="btn primary block">문제 목록으로</Link></div></main>
    );
  }

  const limit = level > 0 ? BASE_LIMIT * RULES.attackTlFactor : BASE_LIMIT;
  const judging = submissions.some((s) => s.verdict === null);
  const latest = submissions[0];

  const submit = () => {
    if (judging) return;
    const no = submissions.length + 1;
    setSubmissions((list) => [{ no, level, verdict: null, timeSec: null }, ...list]);
    timer.current = window.setTimeout(() => {
      setSubmissions((list) => list.map((s) => (s.no === no ? { ...s, verdict: 'WA', timeSec: 0.024 } : s)));
    }, 2000);
  };

  return (
    <div className="battle">
      <header className="practice-bar">
        <Link to="/practice" className="back"><Icon name="arrowLeft" size={14} />문제 목록</Link>
        <span className="row-8"><strong>연습</strong><span className="muted">승패와 전적에 들어가지 않아요</span></span>
      </header>

      <div className="battle-grid">
        <section className="battle-left" aria-label="문제">
          <div className="problem-body">
            {level > 0 && (
              <aside className="conditions">
                <strong>연습 중인 공격 조건</strong>
                <p>시간 제한 <span className="num">{BASE_LIMIT}초</span> → <b className="num">{limit}초</b> <small>Lv1</small></p>
                {level >= 2 && <p>폭탄 테스트 3개 추가 <small>Lv2</small></p>}
                {level >= 3 && <p>문법 제한 적용 <small>Lv3</small></p>}
              </aside>
            )}
            <div className="row-8"><h1>{problem.title}</h1><DiffChip value={problem.difficulty} /></div>
            <p className="muted small-text num">시간 {limit}초 · 메모리 256MB</p>
            {statement.summary.map((t) => <p key={t}>{t}</p>)}
            <h2>입력</h2>
            {statement.input.map((t) => <p key={t}>{t}</p>)}
            <h2>출력</h2>
            {statement.output.map((t) => <p key={t}>{t}</p>)}
            <div className="sample-grid">
              <div><h2>예제 입력</h2><pre><code>{statement.sampleIn}</code></pre></div>
              <div><h2>예제 출력</h2><pre><code>{statement.sampleOut}</code></pre></div>
            </div>
            <span className="chip">{statement.tag}</span>
          </div>
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
            <button type="button" className="icon-btn" aria-label="코드 처음 상태로" onClick={() => setCode(statement.starter)}><Icon name="reset" /></button>
          </div>
          <div className="editor-area">
            <Editor
              height="100%"
              language={MONACO_LANG[lang]}
              value={code}
              onChange={(v) => setCode(v ?? '')}
              loading={<pre className="editor-fallback"><code>{code}</code></pre>}
              options={{ fontSize: 14, minimap: { enabled: false }, tabSize: 4, wordWrap: 'on', scrollBeyondLastLine: false, padding: { top: 16 }, automaticLayout: true, overviewRulerLanes: 0 }}
            />
          </div>
          <div className="console">
            <div className="console-tabs"><strong>실행 결과</strong></div>
            <div className="console-body">
              {sampleOutput ? <pre><code>{sampleOutput}</code></pre> : latest ? (
                latest.verdict ? <p>제출 #{latest.no} · <VerdictMark verdict={latest.verdict} /> {VERDICT_LABEL[latest.verdict]} <span className="muted num">{latest.timeSec}초</span></p> : <p className="console-empty">제출 #{latest.no} 채점 중</p>
              ) : <p className="console-empty">아직 제출하지 않았어요.</p>}
            </div>
            <div className="console-actions">
              <button type="button" className="btn" onClick={() => setSampleOutput(`예제 입력\n${statement.sampleIn}\n기대 출력\n${statement.sampleOut}\n서버 연결 후 실제 실행 결과가 표시돼요.`)}>예제 실행</button>
              <button type="button" className="btn submit" onClick={() => { setSampleOutput(null); submit(); }} disabled={judging}><Icon name="arrowUp" size={14} />{judging ? '채점 중' : '제출'}</button>
            </div>
          </div>
        </section>

        <aside className="battle-right" aria-label="연습 설정">
          <section className="rail-section">
            <header className="rail-head"><h2>공격 조건</h2></header>
            <div className="segmented small level-select">
              {LEVELS.map((l) => (
                <button key={l} type="button" className={level === l ? 'on' : ''} aria-pressed={level === l} disabled={l >= 2 && !problem.bomb} onClick={() => setParams(l === 0 ? {} : { attack: String(l) })}>{l === 0 ? '없음' : `Lv${l}`}</button>
              ))}
            </div>
            <p className="muted small-text level-note">{level === 0 ? '기본 조건으로 풀어요.' : <>공격받은 상태로 풀어요. <LevelDots level={level} label={false} /></>}</p>
          </section>
          <section className="rail-section grow-rail">
            <header className="rail-head"><h2>내 제출</h2><span className="muted small-text">{submissions.length}건</span></header>
            {submissions.length === 0 ? <p className="muted small-text">아직 제출하지 않았어요.</p> : (
              <ul className="plain submissions">
                {submissions.map((s) => (
                  <li key={s.no}><div className="practice-sub"><span>#{s.no} · </span>{s.verdict ? <VerdictMark verdict={s.verdict} /> : <b>채점 중</b>}<small className="num">{s.level > 0 ? `Lv${s.level}` : '기본'}</small></div></li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
