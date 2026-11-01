import { useState } from 'react';
import type { Lang } from '../api/types';
import { Avatar, PageTitle, Panel } from '../components/ui';
import { LANG_LABEL, ME } from '../mock/data';

const MAX = 12;
const MIN = 2;

export default function ProfileEditPage() {
  const [nickname, setNickname] = useState(ME.nickname);
  const [lang, setLang] = useState<Lang>(ME.lang);
  const [saved, setSaved] = useState(false);
  const valid = nickname.length >= MIN && nickname.length <= MAX;
  const dirty = nickname !== ME.nickname || lang !== ME.lang;

  return (
    <div className="page-narrow profile">
      <PageTitle title="프로필 편집" sub="경기 중 상대에게 보이는 정보예요." />
      <div className="two-col">
        <Panel title="기본 정보">
          <form className="form-stack" onSubmit={(e) => { e.preventDefault(); if (valid) setSaved(true); }}>
            <label>
              <span className="label-row">닉네임<small className="num">{nickname.length}/{MAX}</small></span>
              <input value={nickname} maxLength={MAX} onChange={(e) => { setNickname(e.target.value); setSaved(false); }} aria-describedby="nick-rule" aria-invalid={!valid} />
            </label>
            <p id="nick-rule" className={valid ? 'hint' : 'hint bad-text'}>한글·영문·숫자 {MIN}~{MAX}자</p>
            <fieldset>
              <legend>주 사용 언어</legend>
              <div className="segmented">
                {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
                  <label key={l} className={lang === l ? 'on' : ''}><input type="radio" name="lang" checked={lang === l} onChange={() => { setLang(l); setSaved(false); }} />{LANG_LABEL[l]}</label>
                ))}
              </div>
              <p className="hint">경기 시작 시 기본으로 선택되는 언어예요.</p>
            </fieldset>
            <footer className="form-foot">
              <span className="muted small-text" role="status">{saved ? '저장했어요.' : dirty ? '저장하지 않은 변경사항이 있어요.' : ''}</span>
              <button type="submit" className="btn primary" disabled={!valid || !dirty || saved}>변경사항 저장</button>
            </footer>
          </form>
        </Panel>
        <Panel title="상대에게 보이는 프로필">
          <div className="profile-card">
            <Avatar name={nickname} size={56} />
            <div><strong>{nickname || '닉네임'}</strong><small>{LANG_LABEL[lang]}</small></div>
            <dl className="kpi-strip three">
              <div><dt>승</dt><dd className="num">{ME.wins}</dd></div>
              <div><dt>패</dt><dd className="num">{ME.losses}</dd></div>
              <div><dt>승률</dt><dd className="num">{Math.round((ME.wins / (ME.wins + ME.losses)) * 100)}%</dd></div>
            </dl>
          </div>
          <p className="muted small-text pad-top">대기실과 경기 화면에 이렇게 표시돼요.</p>
        </Panel>
      </div>
    </div>
  );
}
