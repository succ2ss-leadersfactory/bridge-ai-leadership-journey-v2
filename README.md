# Bridge AI Leadership Journey v2.0

한국공항공사 과장급 중간관리자 대상 후배 육성 Lab 웹앱입니다.

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

## Core flow

```text
Entry
→ Situation
→ Junior reading
→ First decision
→ Result
→ Reaction
→ Dilemma analysis
→ Second decision
→ Development direction
→ AI prompt copy
→ AI answer review
→ Two-week plan
→ Five field lines
→ Save result
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

## Deployment documents

| Document | Purpose |
|---|---|
| `apps-script/README.md` | Apps Script setup guide |
| `docs/DEPLOYMENT_RUNBOOK.md` | Deployment runbook |
| `docs/PILOT_QA_CHECKLIST.md` | Pilot QA checklist |
| `docs/PILOT_REHEARSAL_SCRIPT.md` | Pilot rehearsal script |

## Pilot minimum check

1. Learner app opens.
2. Preflight check passes.
3. Test learner result is saved to Google Sheets.
4. Instructor dashboard loads saved data.
5. AI prompt copy works on smartphone.
