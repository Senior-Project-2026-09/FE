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
├── api/             socket.io-client 인스턴스, API 명세 v0.3 타입 (shared 배포 후 교체)
├── battle/          서버 이벤트로 대결 화면 상태를 만드는 reducer
├── components/      공통 셸, 아이콘, UI 조각
├── mock/            서버 연결 전 샘플 데이터 (API 연결 후 삭제)
├── pages/           화면 16개
├── styles/app.css   Figma 라이트 화면 토큰과 스타일
└── App.tsx          라우트
```

## 화면과 경로

| 화면 | 경로 |
| --- | --- |
| 초기화면 · 온보딩 · 로그인·회원가입 · 닉네임 설정 | `/welcome` · `/onboarding` · `/login` · `/login/nickname` |
| 연습 풀이 | `/practice/prb_two_sum_count` · `?attack=2` |
| 로비 · 방 만들기 | `/` |
| 대기실 · 상대 입장 | `/rooms/482917` · `/rooms/482917?joined=1` |
| 대결 (시작 · 초반 · 중반 · 공격 도착) | `/battle/482917?scene=start` · `early` · `mid` · `attack` |
| 경기 결과 · 다시 보기 | `/result/mat_1042` · `/replay/mat_1042` |
| 관전 목록 · 관전 | `/spectate` · `/spectate/482917` |
| 연습 · 내 기록 · 프로필 | `/practice` · `/me` · `/me/edit` |
| 문제 등록 (관리자) | `/admin/problems/new` |

대결 화면은 소켓 없이 `src/mock/battleEvents.ts`의 이벤트로 돌아간다. 서버를 연결할 때는 이 이벤트 대신 소켓 이벤트를 `battle/reducer.ts`에 넣는다.
