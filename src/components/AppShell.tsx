import { Link, NavLink, Outlet } from 'react-router-dom';
import { ME } from '../mock/data';
import { Avatar } from './ui';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="CodeClash 로비로">
      <span className="logo-mark" aria-hidden="true">C</span>
      <span>CodeClash</span>
    </Link>
  );
}

const NAV = [
  { to: '/', label: '대결', end: true },
  { to: '/practice', label: '연습', end: false },
  { to: '/spectate', label: '관전', end: false },
  { to: '/me', label: '내 기록', end: false },
];

export default function AppShell() {
  return (
    <div className="app">
      <header className="topbar">
        <Logo />
        <nav aria-label="주요 메뉴">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end}>{n.label}</NavLink>)}
        </nav>
        <Link to="/me/edit" className="topbar-user">
          <Avatar name={ME.nickname} size={28} />
          <span>{ME.nickname}</span>
        </Link>
      </header>
      <main className="canvas"><Outlet /></main>
    </div>
  );
}
