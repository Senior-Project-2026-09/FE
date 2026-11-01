import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { PageTitle, Panel } from '../components/ui';

// GET /admin/problems/{id}/validation 응답을 흉내 낸 샘플. 공격 시 제한 0.35초 기준이다.
const RESULT = [
  { lang: 'C++', accepted: 0.013, slowBase: 0.002, slowBomb: '2.387초', tl: 0.5 },
  { lang: 'Python', accepted: 0.052, slowBase: 0.057, slowBomb: '시간 초과', tl: 0.5 },
  { lang: 'JS', accepted: 0.079, slowBase: 0.03, slowBomb: '5.595초', tl: 0.5 },
];
const CHECKS = ['모범 풀이는 폭탄에서도 제한 시간 안에 통과해요.', '느린 풀이는 기본 테스트를 통과해요.', '느린 풀이는 폭탄에서 시간 초과가 나요.'];
const REQUIRED = ['problem.yaml', 'statement/', 'data/sample', 'generators/', 'submissions/accepted/', 'submissions/time_limit_exceeded/'];

export default function ProblemAdminPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <div className="page-narrow">
      <Link to="/practice" className="back"><Icon name="arrowLeft" size={14} />뒤로</Link>
      <PageTitle title="문제 등록 · 공정성 검사" chip={<span className="chip">관리자 전용</span>} sub="모범 풀이는 통과하고, 느린 풀이만 폭탄에서 실패하는지 확인해요." />

      <Panel title="문제 패키지">
        <label className="drop-zone">
          <Icon name="upload" size={20} />
          <strong>{fileName ?? 'zip 파일 선택'}</strong>
          <small id="zip-rule">Kattis 문제 패키지 형식의 zip 파일만 올릴 수 있어요.</small>
          <input type="file" accept=".zip" aria-describedby="zip-rule" onChange={(e) => { setFileName(e.target.files?.[0]?.name ?? null); setSaved(false); }} />
        </label>
        <div className="package-rule">
          <h3>꼭 들어 있어야 하는 항목</h3>
          <ul className="plain code-list">{REQUIRED.map((r) => <li key={r}><code>{r}</code></li>)}</ul>
          <p className="muted small-text">Lv3 금지 규칙, 리포트 힌트와 대표 풀이 설명은 <code>problem.yaml</code>에 적어요.</p>
        </div>
      </Panel>

      <Panel title="공정성 검사" side={<span className="muted">언어마다 세 조건을 모두 만족해야 해요</span>}>
        {fileName ? (
          <>
            <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>언어</th><th className="num">모범×폭탄</th><th className="num">느린×기본</th><th className="num">느린×폭탄</th><th className="num">계산된 TL</th></tr></thead>
                <tbody>{RESULT.map((r) => <tr key={r.lang}><td><strong>{r.lang}</strong></td><td className="num">{r.accepted.toFixed(3)}초</td><td className="num">{r.slowBase.toFixed(3)}초</td><td className="num">{r.slowBomb}</td><td className="num">{r.tl}초</td></tr>)}</tbody>
              </table>
            </div>
            <ul className="plain check-list">{CHECKS.map((c) => <li key={c}><Icon name="check" size={14} />{c}</li>)}</ul>
            <p className="muted small-text">TL = 모범 풀이 최장 시간 × 2 ÷ 0.7 → 0.5초 단위 올림</p>
            <footer className="start-bar">
              <div><strong>3개 검사 통과 · 폭탄 단계 켜짐</strong><small>{saved ? '저장했어요. 공개 전에 내용을 확인해 주세요.' : '검사를 통과해 저장할 수 있어요.'}</small></div>
              <button type="button" className="btn primary" onClick={() => setSaved(true)} disabled={saved}>{saved ? '저장됨' : '저장'}</button>
            </footer>
          </>
        ) : <p className="empty-box">패키지를 올리면 언어별 검사 결과가 여기에 표시돼요.</p>}
      </Panel>
    </div>
  );
}
