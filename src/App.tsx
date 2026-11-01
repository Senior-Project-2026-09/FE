import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import BattlePage from './pages/BattlePage';
import LobbyPage from './pages/LobbyPage';
import LoginPage from './pages/LoginPage';
import MyRecordsPage from './pages/MyRecordsPage';
import OnboardingPage from './pages/OnboardingPage';
import PracticePage from './pages/PracticePage';
import ProblemAdminPage from './pages/ProblemAdminPage';
import ProfileEditPage from './pages/ProfileEditPage';
import ReplayPage from './pages/ReplayPage';
import ResultPage from './pages/ResultPage';
import SpectateListPage from './pages/SpectateListPage';
import SpectatePage from './pages/SpectatePage';
import WaitingRoomPage from './pages/WaitingRoomPage';
import WelcomePage from './pages/WelcomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/battle/:roomCode" element={<BattlePage />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/rooms/:roomCode" element={<WaitingRoomPage />} />
          <Route path="/result/:matchId" element={<ResultPage />} />
          <Route path="/replay/:matchId" element={<ReplayPage />} />
          <Route path="/spectate" element={<SpectateListPage />} />
          <Route path="/spectate/:roomCode" element={<SpectatePage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/me" element={<MyRecordsPage />} />
          <Route path="/me/edit" element={<ProfileEditPage />} />
          <Route path="/admin/problems/new" element={<ProblemAdminPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
