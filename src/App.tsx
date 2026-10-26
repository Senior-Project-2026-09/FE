import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BattlePage from './pages/BattlePage';
import LobbyPage from './pages/LobbyPage';
import ResultPage from './pages/ResultPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LobbyPage />} />
        <Route path="/battle/:roomCode" element={<BattlePage />} />
        <Route path="/result/:matchId" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
