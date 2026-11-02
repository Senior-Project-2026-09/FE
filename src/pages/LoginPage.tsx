import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

const LEVELS = [
  { title: '시간 제한 변경 · Lv1', body: '기본 0.5초가 0.35초로 줄어요. 기존 제한의 70%예요.' },
  { title: '폭탄 테스트 · Lv2', body: 'N = 100,000인 테스트 3개가 추가돼요. 느린 O(N²) 풀이를 걸러내요.' },
  { title: '공격과 상쇄', body: '정답으로 1~3점을 보내요. 45초 뒤 상대의 안 푼 문제에 적용돼요. 그 사이 아무 문제나 맞히면 상쇄하고, 남은 점수로 반격해요.' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [emailOpen, setEmailOpen] = useState(false);
  const [signup, setSignup] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <main className="solo">
      <div className="solo-column">
        <p className="wordmark">CodeClash</p>
        <h1 className="solo-title">정답이 공격이 되는<br />1:1 알고리즘 대결</h1>

        <div className="stack-8">
          <button type="button" className="btn primary block" onClick={() => navigate('/login/nickname')}>
            <Icon name="github" />GitHub로 계속하기
          </button>
          <button type="button" className="btn block" onClick={() => setEmailOpen((v) => !v)} aria-expanded={emailOpen}>
            <Icon name="mail" />이메일로 계속하기
          </button>
        </div>

        {emailOpen && (
          <form className="form-stack" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
            <label>이메일<input type="email" required autoComplete="email" /></label>
            {signup && <label>닉네임<input required minLength={2} maxLength={12} autoComplete="nickname" aria-describedby="nick-rule" /></label>}
            {signup && <p id="nick-rule" className="hint">한글·영문·숫자 2~12자</p>}
            <label>비밀번호<input type="password" required minLength={8} autoComplete={signup ? 'new-password' : 'current-password'} aria-describedby="pw-rule" /></label>
            <p id="pw-rule" className="hint">비밀번호는 8자 이상이에요.</p>
            <button type="submit" className="btn dark block">{signup ? '회원가입' : '로그인'}</button>
            <button type="button" className="link-button auth-switch" onClick={() => setSignup((v) => !v)}>{signup ? '이미 계정이 있어요. 로그인' : '계정이 없어요. 회원가입'}</button>
          </form>
        )}

        <ul className="login-facts">
          <li><Icon name="clock" />같은 5문제·15분</li>
          <li><Icon name="swap" />맞히면 공격, 45초 안에 맞히면 상쇄</li>
          <li><Icon name="code" />폭탄은 느린 풀이만 떨어뜨려요</li>
        </ul>

        <button type="button" className="link-button" onClick={() => setRulesOpen((v) => !v)} aria-expanded={rulesOpen}>
          규칙 자세히 보기<Icon name="chevronDown" size={14} />
        </button>
        {rulesOpen && (
          <dl className="rule-detail">
            {LEVELS.map((l) => <div key={l.title}><dt>{l.title}</dt><dd>{l.body}</dd></div>)}
          </dl>
        )}
        <p className="solo-foot">처음이라면 <Link to="/welcome" className="link">서비스 소개 보기</Link></p>
      </div>
    </main>
  );
}
