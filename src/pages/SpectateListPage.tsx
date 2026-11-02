import { Link } from 'react-router-dom';
import { clock } from '../components/format';
import { PageTitle, Panel } from '../components/ui';
import { LIVE_MATCHES } from '../mock/data';

function Dots({ solved }: { solved: number }) {
  return (
    <span className="solve-dots" role="img" aria-label={`${solved}문제 해결`}>
      {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= solved ? 'on' : ''} />)}
    </span>
  );
}

export default function SpectateListPage() {
  return (
    <div className="page-narrow">
      <PageTitle title="관전" sub={`지금 ${LIVE_MATCHES.length}개 경기가 진행 중이에요. 점수와 코드는 30초 늦게 보여요.`} />
      <Panel>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>선수</th><th>문제 진행</th><th className="num">남은 시간</th><th className="num">관전자</th><th aria-label="관전하기" /></tr>
            </thead>
            <tbody>
              {LIVE_MATCHES.map((m) => (
                <tr key={m.roomCode}>
                  <td><strong>{m.a}</strong> <span className="muted">vs</span> <strong>{m.b}</strong></td>
                  <td><span className="row-8"><Dots solved={m.aSolved} /><span className="muted">/</span><Dots solved={m.bSolved} /></span></td>
                  <td className="num">{clock(m.remainingSec * 1000)}</td>
                  <td className="num">{m.spectators}</td>
                  <td className="action"><Link to={`/spectate/${m.roomCode}`} className="btn small">관전</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
