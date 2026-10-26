import { useParams } from 'react-router-dom';

export default function ResultPage() {
  const { matchId } = useParams();

  return (
    <main>
      <h1>결과 — {matchId}</h1>
    </main>
  );
}
