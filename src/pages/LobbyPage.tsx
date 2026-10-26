import { useEffect, useState } from 'react';
import { socket } from '../api/socket';

export default function LobbyPage() {
  // 연결 확인용 두 줄. 확인이 끝나면 지워도 된다.
  const [health, setHealth] = useState('확인 중...');
  const [pong, setPong] = useState('확인 중...');

  useEffect(() => {
    fetch('/health')
      .then((res) => res.json())
      .then((body: { status: string }) => setHealth(body.status))
      .catch(() => setHealth('연결 실패'));

    // 서버가 { event: 'pong', data } 를 돌려주면 Nest는 'pong' 이벤트로 보낸다
    const onPong = () => setPong('pong');
    socket.on('pong', onPong);
    socket.emit('ping');
    return () => {
      socket.off('pong', onPong);
    };
  }, []);

  return (
    <main>
      <h1>로비</h1>
      <p>game-server: {health}</p>
      <p>socket: {pong}</p>
    </main>
  );
}
