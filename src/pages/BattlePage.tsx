import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';

export default function BattlePage() {
  const { roomCode } = useParams();

  return (
    <main>
      <h1>대결 — {roomCode}</h1>
      {/* Monaco 설치 확인용 편집기 */}
      <Editor height="60vh" defaultLanguage="cpp" defaultValue="// 코드를 입력하세요" />
    </main>
  );
}
