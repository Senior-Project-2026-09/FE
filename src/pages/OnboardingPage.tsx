import { Link } from 'react-router-dom';

export default function OnboardingPage() {
  return (
    <main className="solo">
      <div className="solo-column">
        <p className="wordmark">CodeClash</p>
        <h1 className="solo-title">정답으로 공격하고,<br />풀이로 막아내세요</h1>
        <p className="solo-lead">첫 1:1 알고리즘 대결 전에, 세 가지만 알아두세요.</p>
        <ol className="rule-list">
          <li>
            <strong>같은 5문제, 제한 시간은 15분</strong>
            <span>두 사람 모두 같은 문제로 시작해요. 제한 시간 안에 정확하고 빠른 풀이로 겨뤄요.</span>
          </li>
          <li>
            <strong>맞히면 상대에게 공격을 보내요</strong>
            <span>정답으로 1~3점의 공격을 보내요. 45초 뒤 상대의 안 푼 문제에 적용돼요. 실행 시간 제한이 줄거나, 큰 입력 테스트가 추가돼요.</span>
          </li>
          <li>
            <strong>45초 안에 맞히면 공격을 상쇄해요</strong>
            <span>공격이 적용되기 전, 아무 문제나 맞혀보세요. 받은 공격을 상쇄하고 남은 점수로 반격해요.</span>
          </li>
        </ol>
        <Link to="/login" className="btn primary block">로그인하고 시작하기</Link>
        <p className="solo-foot"><Link to="/" className="link quiet">건너뛰기</Link></p>
      </div>
    </main>
  );
}
