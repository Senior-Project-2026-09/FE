# 실시간 코딩 배틀 플랫폼 — FE
TC 폭탄으로 시간복잡도를 체감하는 1:1 대결형 알고리즘 학습 플랫폼 — 종합설계

- 서버 · 채점 · 인프라 · 문서: https://github.com/Senior-Project-2026-09/BE
- 로컬 실행 전체 절차: BE 저장소 `docs/SETUP.md`

```bash
pnpm install
pnpm dev          # http://localhost:5173 (/health · /socket.io 는 game-server 3000으로 프록시)
```

React + TypeScript (Vite) · react-router-dom · socket.io-client · Monaco Editor

```
src/
├── api/socket.ts    socket.io-client 인스턴스
├── pages/           LobbyPage · BattlePage · ResultPage
├── components/      공통 컴포넌트 (비어 있음)
├── App.tsx          / · /battle/:roomCode · /result/:matchId
└── main.tsx
```
