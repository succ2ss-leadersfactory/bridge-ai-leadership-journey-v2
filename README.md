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
→ Additional situation
→ Dilemma analysis
→ Second decision
→ Development direction
→ AI prompt edit and copy
→ AI answer review
→ Five-part two-week action plan
→ Five coaching dialogue lines
→ Save result
```

## Session structure

| Session | Theme | Rounds |
|---|---|---|
| Session 1 | 후배를 제대로 읽다 | R1, R2 |
| Session 2 | 키울 것을 하나로 잡다 | R5, R4 |
| Session 3 | 다시 움직이게 하다 | R3, Boss Round |

## Naming rule

All people are displayed as full name plus rank.

```text
윤동희 사원
황성빈 대리
전민재 사원
고승민 대리
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
| `docs/release-notes-v2-final.md` | Final release notes for v2 pilot |
| `docs/v2-1-improvement-backlog.md` | v2.1 improvement backlog after pilot |
| `docs/pilot-test-log-template.md` | Pilot test result logging template |
| `apps-script/README.md` | Apps Script setup guide |
| `docs/DEPLOYMENT_RUNBOOK.md` | Deployment runbook |
| `docs/tablet-preflight-guide.md` | Tablet-based preflight guide for classroom operators |
| `docs/classroom-final-ops-checklist.md` | Final classroom operations checklist |
| `docs/facilitator-day-script.md` | Facilitator day-of delivery script |
| `docs/content-line-break-policy.md` | Content line break policy for mobile readability |
| `docs/round-content-layer-map.md` | Round content override layer map |
| `docs/pilot-readiness-summary.md` | Pilot readiness summary |
| `docs/pilot-qa-checklist.md` | Pilot QA checklist for current learner flow |
| `docs/facilitator-session-guide.md` | Facilitator mini-review guide by session |
| `docs/PILOT_REHEARSAL_SCRIPT.md` | Pilot rehearsal script |
| `docs/manual-test-script.md` | End-to-end manual test script with sample AI output |

## Pilot minimum check

1. Learner app opens on smartphone.
2. Session Map opens after team name and nickname are entered.
3. Session 1 shows only R1 and R2.
4. R2 shows 황성빈 대리.
5. AI prompt copy works on smartphone.
6. AI answer paste screen separates 5 plan fields and 5 coaching dialogue fields.
7. Two-week action plan uses five inputs: growth goal, task, leader support, check timing, and watch-out expression.
8. Final coaching dialogue uses five editable line inputs.
9. Test learner result is saved to Google Sheets.
10. Completed round badge appears after save success.
11. Instructor dashboard shows team, session, round, full two-week plan, and final dialogue data.
