import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { Avatar, CopyButton, Field, PageTitle, Panel } from '../components/ui';
import { ME, OPPONENT, RECENT_MATCHES, RULES } from '../mock/data';

const SETTINGS = [
  { label: '경기 시간', value: `${RULES.durationSec / 60}분` },
  { label: '문제 구성', value: '하 2 · 중 2 · 상 1' },
  { label: '내 언어', value: 'Python' },
  { label: '공격 대기', value: `${RULES.applyDelaySec}초` },
  { label: '한 번에', value: `최대 ${RULES.maxSendPoints}점` },
  { label: '관전 허용', value: '허용' },
];

function Player({ name, tag, lang, ready }: { name: string; tag: string; lang: string; ready: boolean }) {
  return (
    <li className="player-row">
      <Avatar name={name} size={40} />
      <div className="grow">
        <div className="row-8"><strong>{name}</strong><span className="chip">{tag}</span></div>
        <small>{lang}</small>
      </div>
      {ready && <span className="ready"><Icon name="check" size={14} />준비 완료</span>}
    </li>
  );
}

export default function WaitingRoomPage() {
  const { roomCode = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const joined = params.get('joined') === '1';
  const link = `${window.location.origin}/rooms/${roomCode}`;

  return (
    <div className="page-grid sidebar-right">
      <div className="page-main">
        <PageTitle
          title="대기실"
          chip={<span className={`pill ${joined ? 'good' : 'blue'}`}>{joined ? '상대 입장 완료' : '초대를 기다리는 중'}</span>}
          sub={joined ? `${OPPONENT.nickname}님이 입장했어요. 경기를 시작하면 두 사람이 같은 5문제를 풀게 돼요.` : '상대가 입장하면 방장이 경기를 시작할 수 있어요. 방은 30분 동안 유지돼요.'}
          side={<Link to="/" className="btn ghost"><Icon name="exit" size={14} />방 나가기</Link>}
        />

        <div className="code-strip">
          <div>
            <span className="muted">방 코드</span>
            <strong className="room-code num">{roomCode}</strong>
            <CopyButton value={roomCode} label="코드 복사" />
          </div>
          <div>
            <span className="truncate muted">{link}</span>
            <CopyButton value={link} label="링크 복사" />
          </div>
        </div>

        <Panel title="참가자" side={<><span className="num">{joined ? 2 : 1} / 2명</span><span className="muted">관전자 0명</span></>}>
          <ul className="plain">
            <Player name={ME.nickname} tag="방장" lang="Python" ready />
            {joined ? <Player name={OPPONENT.nickname} tag="도전자" lang="C++" ready /> : (
              <li className="player-row waiting">
                <Avatar name="빈 자리" size={40} />
                <div className="grow"><strong>상대를 기다리는 중</strong><small>코드를 입력하거나 링크로 바로 입장할 수 있어요.</small></div>
                {import.meta.env.DEV && <button type="button" className="btn small" onClick={() => setParams({ joined: '1' })}>상대 입장 보기</button>}
              </li>
            )}
          </ul>
          <footer className="start-bar">
            <div>
              <strong>{joined ? '모든 참가자가 준비됐어요' : '상대가 입장하면 경기를 시작할 수 있어요'}</strong>
              <small>시작하면 바로 5문제가 열리고 15분 타이머가 돌아가요.</small>
            </div>
            <button type="button" className="btn primary" disabled={!joined} onClick={() => navigate(`/battle/${roomCode}?scene=start`)}>
              <Icon name="play" size={14} />경기 시작
            </button>
          </footer>
        </Panel>

        <Panel title="경기 설정" side={<span className="muted">시작 전까지 방장만 바꿀 수 있어요</span>}>
          <div className="field-grid">{SETTINGS.map((s) => <Field key={s.label} {...s} />)}</div>
        </Panel>
      </div>

      <aside className="page-aside">
        {joined && (
          <section>
            <h2>매치업</h2>
            <ul className="plain ruled">
              <li className="matchup"><Avatar name={ME.nickname} /><div className="grow"><strong>{ME.nickname}</strong><small>Python</small></div><span className="num">{ME.wins}승 {ME.losses}패</span></li>
              <li className="matchup"><Avatar name={OPPONENT.nickname} /><div className="grow"><strong>{OPPONENT.nickname}</strong><small>C++</small></div><span className="num">{OPPONENT.wins}승 {OPPONENT.losses}패</span></li>
            </ul>
          </section>
        )}
        <section>
          <h2>경기 시작까지</h2>
          <ol className="steps">
            <li className="done"><strong>방 코드 {roomCode}을 공유해요</strong><small>링크로 입장하면 코드를 입력하지 않아도 돼요.</small></li>
            <li className={joined ? 'done' : 'now'}><strong>상대가 입장해요</strong><small>{joined ? `${OPPONENT.nickname} · C++` : '상대가 고른 언어도 함께 표시돼요.'}</small></li>
            <li className={joined ? 'now' : ''}><strong>방장이 경기 시작을 눌러요</strong><small>두 사람 모두 바로 문제 화면으로 이동해요.</small></li>
          </ol>
        </section>
        {!joined && <Link to="/practice" className="link">기다리는 동안 연습 문제 풀기 <Icon name="arrowRight" size={14} /></Link>}
        <Link to={`/result/${RECENT_MATCHES[0].matchId}`} className="aside-link">지난 경기 리포트 보기<Icon name="arrowRight" size={14} /></Link>
      </aside>
    </div>
  );
}
