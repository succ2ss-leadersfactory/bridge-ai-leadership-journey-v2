# Bridge AI Leadership Journey v2.0

한국공항공사 과장급 중간관리자 대상 후배 육성 Lab 웹앱입니다.

이 웹앱은 과장급 중간관리자가 후배의 행동을 읽고, 육성 딜레마를 판단한 뒤, AI 프롬프트를 활용해 2주 실행안과 현장 대화 문장을 정리하도록 돕는 모바일 기반 교육 도구입니다.

## Routes

| Screen | Path |
|---|---|
| Learner mobile app | `/` |
| Instructor dashboard | `/?view=instructor` |
| Preflight check | `/?view=check` |

## Stack

- React
- Vite
- TypeScript
- Vercel
- Google Sheets
- Apps Script
- localStorage

## Current learner flow

```text
Entry
→ Session Map
→ Session Round Map
→ Situation
→ Junior reading
→ First decision
→ Result
→ Reaction
→ Dilemma analysis
→ Second decision
→ Development direction
→ AI prompt edit and copy
→ AI answer review
→ Three-part two-week action plan
→ 3 to 5 lines for the junior
→ Save result
```

## Session structure

| Session | Theme | Rounds |
|---|---|---|
| Session 1 | 후배를 읽고 기준을 남기다 | R1, R2 |
| Session 2 | 시도를 성장 경험으로 바꾸다 | R3, R4 |
| Session 3 | 맡기고 수습 속에서도 키우다 | R5, Boss Round |

## Naming rule

All people are displayed as full name plus rank.

```text
김민재 사원
이서연 대리
정하늘 사원
최도윤 대리
```

Allowed ranks:

```text
사원 / 대리 / 과장
```

## Environment variable

```text
VITE_GOOGLE_SCRIPT_WEBAPP_URL=<Apps Script Web App URL>
```

See `.env.example`.

## Google Sheets

Required sheets:

- `Participants`
- `Responses`

Apps Script can create these sheets and headers automatically.

## Local development

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Operation documents

| Document | Purpose |
|---|---|
| `apps-script/README.md` | Apps Script setup guide |
| `docs/DEPLOYMENT_RUNBOOK.md` | Deployment runbook |
| `docs/pilot-readiness-summary.md` | Pilot readiness summary |
| `docs/pilot-qa-checklist.md` | Pilot QA checklist for current learner flow |
| `docs/facilitator-session-guide.md` | Facilitator mini-review guide by session |
| `docs/PILOT_REHEARSAL_SCRIPT.md` | Pilot rehearsal script |

## Pilot minimum check

1. Learner app opens on smartphone.
2. Session Map opens after team name and nickname are entered.
3. Session 1 shows only R1 and R2.
4. R2 shows 이서연 대리.
5. AI prompt copy works on smartphone.
6. Two-week action plan uses three core inputs.
7. Final message uses one editable 3 to 5 line text area.
8. Test learner result is saved to Google Sheets.
9. Completed round badge appears after save success.
10. Instructor dashboard loads saved data.
