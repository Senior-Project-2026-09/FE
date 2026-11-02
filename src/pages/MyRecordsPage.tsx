import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { Avatar, PageTitle, Panel, ResultMark } from '../components/ui';
import { LANG_LABEL, ME, MY_STATS, RECENT_MATCHES } from '../mock/data';

const matches = ME.wins + ME.losses;
const winRate = Math.round((ME.wins / matches) * 100);
const minSec = (sec: number) => `${Math.floor(sec / 60)}분 ${sec % 60}초`;

export default function MyRecordsPage() {
  return (
    <div className="page-narrow">
      <PageTitle
        title="내 기록"
        sub={`폭탄에 가장 취약한 유형은 ${MY_STATS.weakTags[0].tag}예요. 시간 초과 ${MY_STATS.weakTags[0].bombTle}회.`}
        side={<Link to="/me/edit" className="btn"><Icon name="pencil" size={14} />프로필 편집</Link>}
      />

      <section className="record-head panel">
        <div className="record-who"><Avatar name={ME.nickname} size={48} /><div><strong>{ME.nickname}</strong><small>주 언어 Python · {ME.wins}승 {ME.losses}패</small></div></div>
        <dl className="kpi-strip">
          <div><dt>경기</dt><dd className="num">{matches}</dd></div>
          <div><dt>승률</dt><dd className="num">{winRate}%</dd></div>
          <div><dt>평균 풀이</dt><dd className="num">{minSec(MY_STATS.avgSolveSec)}</dd></div>
          <div><dt>상쇄율</dt><dd className="num">{Math.round(MY_STATS.cancelRate * 100)}%</dd></div>
        </dl>
      </section>

      <div className="two-col">
        <Panel title="사용 언어" side={<span className="muted num">전체 {matches}경기 기준</span>}>
          <ul className="plain share-list">
            {MY_STATS.langShare.map((l) => {
              const pct = Math.round((l.matches / matches) * 100);
              return <li key={l.lang}><span>{LANG_LABEL[l.lang]}</span><div className="share-track"><i style={{ width: `${pct}%` }} /></div><b className="num">{pct}%</b></li>;
            })}
          </ul>
        </Panel>
        <Panel title="최근 10경기" side={<span className="muted">왼쪽이 가장 최근</span>}>
          <ol className="plain result-strip">
            {MY_STATS.recentResults.map((r, i) => <li key={`${i}-${r}`}><ResultMark result={r} /></li>)}
          </ol>
        </Panel>
      </div>

      <Panel title="유형별 약점" side={<span className="muted">폭탄 TLE 횟수순</span>}>
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>태그</th><th className="num">시도</th><th className="num">폭탄 TLE</th><th>추천 문제</th></tr></thead>
            <tbody>
              {MY_STATS.weakTags.map((w) => (
                <tr key={w.tag}>
                  <td><strong>{w.tag}</strong></td>
                  <td className="num">{w.attempts}</td>
                  <td className="num"><b className="warn-text">{w.bombTle}</b></td>
                  <td><Link to={`/practice?tag=${encodeURIComponent(w.tag)}`} className="link">{w.problem}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small-text pad-top">폭탄 TLE는 폭탄 테스트에서 시간 초과가 난 횟수예요.</p>
      </Panel>

      <Panel title="최근 경기" side={<span className="muted num">최신순 · {RECENT_MATCHES.length}경기</span>}>
        <ul className="plain ruled">
          {RECENT_MATCHES.map((m) => (
            <li key={m.matchId} className="match-row">
              <ResultMark result={m.result} />
              <strong className="grow">{m.opponent}</strong>
              <span className="num">{m.score}</span>
              <span className="muted num">{m.date}</span>
              <Link to={`/result/${m.matchId}`} className="link">리포트 <Icon name="arrowRight" size={14} /></Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
