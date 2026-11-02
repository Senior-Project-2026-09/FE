import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Difficulty, ProblemProgress } from '../api/types';
import Icon from '../components/Icon';
import { DiffChip, PageTitle } from '../components/ui';
import { DIFF_LABEL, PRACTICE_PROBLEMS, PRACTICE_TAGS } from '../mock/data';

const DIFFS: Difficulty[] = ['LOW', 'MID', 'HIGH'];
const PROGRESS: { value: ProblemProgress | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' }, { value: 'SOLVED', label: '맞힘' }, { value: 'ATTEMPTED', label: '시도' }, { value: 'UNTRIED', label: '미시도' },
];
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const DIFF_ORDER: Record<Difficulty, number> = { LOW: 0, MID: 1, HIGH: 2 };
type SortKey = 'DEFAULT' | 'ACCEPTANCE' | 'DIFFICULTY';

export default function PracticePage() {
  const [params] = useSearchParams();
  const initialTag = params.get('tag');
  const [query, setQuery] = useState('');
  const [diffs, setDiffs] = useState<Difficulty[]>([]);
  const [tags, setTags] = useState<string[]>(initialTag ? [initialTag] : []);
  const [bombOnly, setBombOnly] = useState(false);
  const [progress, setProgress] = useState<ProblemProgress | 'ALL'>('ALL');
  const [sort, setSort] = useState<SortKey>('DEFAULT');

  const rows = useMemo(() => {
    const filtered = PRACTICE_PROBLEMS.filter((p) => (
      p.title.includes(query.trim())
      && (diffs.length === 0 || diffs.includes(p.difficulty))
      && (tags.length === 0 || p.tags.some((t) => tags.includes(t)))
      && (!bombOnly || p.bomb)
      && (progress === 'ALL' || p.progress === progress)
    ));
    if (sort === 'ACCEPTANCE') return [...filtered].sort((a, b) => b.acceptance - a.acceptance);
    if (sort === 'DIFFICULTY') return [...filtered].sort((a, b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty]);
    return filtered;
  }, [query, diffs, tags, bombOnly, progress, sort]);

  const reset = () => { setQuery(''); setDiffs([]); setTags([]); setBombOnly(false); setProgress('ALL'); setSort('DEFAULT'); };

  return (
    <div className="practice">
      <PageTitle
        title="연습 · 문제 목록"
        sub="폭탄 테스트로 풀이의 시간복잡도를 확인해요."
        side={<Link to="/admin/problems/new" className="btn"><Icon name="pencil" size={14} />문제 등록 (관리자)</Link>}
      />
      <div className="practice-grid">
        <form className="filters" aria-label="문제 필터" onSubmit={(e) => e.preventDefault()}>
          <div className="filter-head"><h2>필터</h2><button type="button" className="link-button" onClick={reset}>초기화</button></div>
          <fieldset><legend>난이도</legend><div className="check-row">{DIFFS.map((d) => <label key={d}><input type="checkbox" checked={diffs.includes(d)} onChange={() => setDiffs((x) => toggle(x, d))} />{DIFF_LABEL[d]}</label>)}</div></fieldset>
          <fieldset><legend>태그</legend><div className="check-grid">{PRACTICE_TAGS.map((t) => <label key={t}><input type="checkbox" checked={tags.includes(t)} onChange={() => setTags((x) => toggle(x, t))} />{t}</label>)}</div></fieldset>
          <label className="switch-row"><span>폭탄 지원만</span><input type="checkbox" role="switch" checked={bombOnly} onChange={(e) => setBombOnly(e.target.checked)} /></label>
          <fieldset><legend>내 상태</legend><div className="radio-col">{PROGRESS.map((p) => <label key={p.value}><input type="radio" name="progress" checked={progress === p.value} onChange={() => setProgress(p.value)} />{p.label}</label>)}</div></fieldset>
        </form>

        <section className="practice-list" aria-label="문제 목록">
          <div className="list-tools">
            <label className="search"><Icon name="search" /><span className="sr-only">제목 검색</span><input type="search" value={query} placeholder="문제 제목 검색" onChange={(e) => setQuery(e.target.value)} /></label>
            <div className="row-8">
              <span className="muted num">{rows.length}문제</span>
              <label className="select-bare">
                <span className="sr-only">정렬</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  <option value="DEFAULT">기본순</option>
                  <option value="ACCEPTANCE">정답률 높은순</option>
                  <option value="DIFFICULTY">난이도 낮은순</option>
                </select>
              </label>
            </div>
          </div>
          <div className="panel table-scroll">
            <table className="data-table">
              <thead><tr><th>제목</th><th>난이도</th><th>대응 티어</th><th>태그</th><th>폭탄</th><th className="num">정답률</th><th>내 상태</th><th aria-label="풀기" /></tr></thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={8} className="empty-cell">조건에 맞는 문제가 없어요. 필터를 줄여 보세요.</td></tr>
                ) : rows.map((p) => (
                  <tr key={p.problemId}>
                    <td><Link to={`/practice/${p.problemId}`} className="title-link"><strong>{p.title}</strong></Link></td>
                    <td><DiffChip value={p.difficulty} /></td>
                    <td className="muted">{p.tier}</td>
                    <td className="muted">{p.tags.join(', ')}</td>
                    <td>{p.bomb ? <span className="bomb-mark" title="폭탄 지원"><Icon name="bomb" /><span className="sr-only">지원</span></span> : <span className="dash">—</span>}</td>
                    <td className="num">{Math.round(p.acceptance * 100)}%</td>
                    <td>{p.progress === 'SOLVED' ? <span className="ready"><Icon name="check" size={14} />맞힘</span> : p.progress === 'ATTEMPTED' ? <span>시도</span> : <span className="muted">미시도</span>}</td>
                    <td className="action row-actions">
                      {p.bomb ? <Link to={`/practice/${p.problemId}?attack=2`} className="btn small">폭탄 켜고 풀기</Link> : <Link to={`/practice/${p.problemId}`} className="btn small">풀기</Link>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
