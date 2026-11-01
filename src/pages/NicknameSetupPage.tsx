import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MIN = 2;
const MAX = 12;

export default function NicknameSetupPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const valid = nickname.trim().length >= MIN && nickname.length <= MAX;

  return (
    <main className="solo">
      <form className="solo-column" onSubmit={(e) => { e.preventDefault(); if (valid) navigate('/'); }}>
        <p className="wordmark">CodeClash</p>
        <h1 className="solo-title">대결에서 쓸<br />닉네임을 정해 주세요</h1>
        <p className="solo-lead">GitHub 로그인이 끝났어요. 닉네임은 상대에게 보이고, 나중에 바꿀 수 있어요.</p>
        <div className="form-stack">
          <label>
            <span className="label-row">닉네임<small className="num">{nickname.length}/{MAX}</small></span>
            <input value={nickname} maxLength={MAX} autoFocus onChange={(e) => setNickname(e.target.value)} aria-describedby="nickname-rule" />
          </label>
          <p id="nickname-rule" className="hint">한글·영문·숫자 {MIN}~{MAX}자</p>
          <button type="submit" className="btn primary block" disabled={!valid}>시작하기</button>
        </div>
      </form>
    </main>
  );
}
