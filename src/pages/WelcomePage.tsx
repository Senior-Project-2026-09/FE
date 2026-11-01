import { Link } from 'react-router-dom';

const FACTS = [
  { label: '대결 인원', value: '1:1' },
  { label: '공통 문제', value: '5문제' },
  { label: '제한 시간', value: '15분' },
];

export default function WelcomePage() {
  return (
    <main className="solo">
      <div className="solo-column">
        <p className="wordmark">CodeClash</p>
        <h1 className="solo-title">혼자 풀던 알고리즘,<br />이제 대결로 즐겨보세요</h1>
        <p className="solo-lead">같은 문제를 풀고, 정답으로 상대를 공격하세요. 받은 공격은 나의 풀이로 막아내는 코딩 대결이에요.</p>
        <dl className="fact-row">
          {FACTS.map((f) => <div key={f.label}><dt>{f.label}</dt><dd className="num">{f.value}</dd></div>)}
        </dl>
        <Link to="/onboarding" className="btn primary block">대결 방식 알아보기</Link>
        <p className="solo-foot">이미 계정이 있나요? <Link to="/login" className="link">로그인</Link></p>
      </div>
    </main>
  );
}
