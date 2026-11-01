import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Lang } from '../api/types';
import Icon from '../components/Icon';
import { clock } from '../components/format';
import { Avatar, Field, PageTitle, Panel, ResultMark } from '../components/ui';
import { LANG_LABEL, LIVE_MATCHES, LOBBY_SUMMARY, ME, RECENT_MATCHES, ROOM_CODE, RULES } from '../mock/data';

const CODE_LENGTH = 6;

function RoomDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDialogElement>(null);
  const [lang, setLang] = useState<Lang>(ME.lang);
  const [spectate, setSpectate] = useState(true);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog ref={ref} className="dialog" onClose={onClose} aria-labelledby="room-dialog-title">
      <form onSubmit={(e) => { e.preventDefault(); navigate(`/rooms/${ROOM_CODE}`); }}>
        <header><h2 id="room-dialog-title">방 만들기</h2><button type="button" className="icon-btn" onClick={onClose} aria-label="닫기"><Icon name="x" /></button></header>
        <fieldset>
          <legend>내 언어</legend>
          <div className="segmented">
            {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
              <label key={l} className={lang === l ? 'on' : ''}><input type="radio" name="lang" checked={lang === l} onChange={() => setLang(l)} />{LANG_LABEL[l]}</label>
            ))}
          </div>
          <p className="hint">상대는 자기 언어를 따로 골라요.</p>
        </fieldset>
        <div className="field-grid two">
          <Field label="경기 시간" value={`${RULES.durationSec / 60}분`} />
          <Field label="문제" value="하 2 · 중 2 · 상 1" />
          <Field label="공격 대기" value={`${RULES.applyDelaySec}초`} />
          <Field label="한 번에" value={`최대 ${RULES.maxSendPoints}점`} />
        </div>
        <label className="switch-row">
          <span>관전 허용</span>
          <input type="checkbox" role="switch" checked={spectate} onChange={(e) => setSpectate(e.target.checked)} />
        </label>
        <footer><button type="button" className="btn" onClick={onClose}>취소</button><button type="submit" className="btn primary">방 만들기</button></footer>
      </form>
    </dialog>
  );
}

export default function LobbyPage() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [code, setCode] = useState('');
  const ready = code.length === CODE_LENGTH;

  return (
    <div className="page-grid sidebar-right">
      <div className="page-main">
        <PageTitle
          title="대결 로비"
          sub="방을 만들거나 받은 코드로 입장해 상대와 붙어요. 같은 5문제, 15분."
          side={
            <div className="live-counts">
              <span><i className="dot good" />접속 중 <b className="num">{LOBBY_SUMMARY.onlineCount}</b></span>
              <span><i className="dot blue" />진행 중인 경기 <b className="num">{LOBBY_SUMMARY.liveMatchCount}</b></span>
            </div>
          }
        />

        <div className="entry-grid">
          <section className="panel entry primary-entry">
            <h2>방 만들기</h2>
            <p>내가 방장이 되어 상대를 초대해요. 방을 만들면 6자리 입장 코드가 바로 발급돼요.</p>
            <div className="field-grid three">
              <Field label="문제" value="5문제" />
              <Field label="제한 시간" value={`${RULES.durationSec / 60}분`} />
              <Field label="인원" value="1:1" />
            </div>
            <button type="button" className="btn primary block" onClick={() => setDialogOpen(true)}><Icon name="plus" />방 만들기</button>
          </section>

          <form className="panel entry" onSubmit={(e) => { e.preventDefault(); if (ready) navigate(`/rooms/${code}?joined=1`); }}>
            <h2>코드로 입장</h2>
            <p>방장에게 받은 6자리 코드를 입력하면 바로 그 방으로 들어가요.</p>
            <label className="code-input">
              <span>초대 코드 6자리</span>
              <input
                inputMode="numeric"
                autoComplete="off"
                maxLength={CODE_LENGTH}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                aria-describedby="code-hint"
                className="num"
                placeholder="000000"
              />
            </label>
            <button type="submit" className="btn block dark" disabled={!ready}>입장하기</button>
            <p id="code-hint" className="hint">숫자 6자리를 모두 입력하면 입장할 수 있어요.</p>
          </form>
        </div>

        <Panel title="진행 중인 경기" side={<Link to="/spectate" className="link">전체 보기 <Icon name="arrowRight" size={14} /></Link>}>
          <p className="muted small-text">관전 화면은 {RULES.spectateDelaySec}초 지연돼요.</p>
          <ul className="plain ruled live-list">
            {LIVE_MATCHES.slice(1).map((m) => (
              <li key={m.roomCode}>
                <span className="grow"><strong>{m.a}</strong> <span className="muted">vs</span> <strong>{m.b}</strong></span>
                <span className="num">{m.aSolved} : {m.bSolved}</span>
                <span className="muted num">{clock(m.remainingSec * 1000)} 남음</span>
                <Link to={`/spectate/${m.roomCode}`} className="btn small">관전</Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <aside className="page-aside">
        <section>
          <div className="aside-head"><h2>최근 경기</h2><Link to="/me" className="link quiet">전체 보기</Link></div>
          <ul className="plain ruled">
            {RECENT_MATCHES.map((m) => (
              <li key={m.matchId} className="matchup">
                <Avatar name={m.opponent} />
                <div className="grow"><strong>{m.opponent}</strong><small><ResultMark result={m.result} /> <span className="num">{m.score}</span> · <span className="num">{m.date}</span></small></div>
                <Link to={`/result/${m.matchId}`} className="btn small">리포트</Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>대결 규칙</h2>
          <dl className="kv">
            <div><dt>문제</dt><dd>5문제 고정</dd></div>
            <div><dt>제한 시간</dt><dd>15분</dd></div>
            <div><dt>상쇄</dt><dd>45초 안에 정답</dd></div>
          </dl>
          <p className="aside-note">정답을 맞히면 상대에게 공격이 들어가요. 공격을 받은 뒤 45초 안에 정답을 맞히면 공격이 상쇄돼요.</p>
          <Link to="/onboarding" className="link">처음이라면 규칙 소개 보기 <Icon name="arrowRight" size={14} /></Link>
        </section>
      </aside>

      {dialogOpen && <RoomDialog onClose={() => setDialogOpen(false)} />}
    </div>
  );
}
