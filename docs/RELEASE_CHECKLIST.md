# Release Checklist

Bridge AI Leadership Journey v2.0 release checklist.

## 1. Code

- [ ] Latest PR is merged into `main`.
- [ ] Vercel is connected to the correct GitHub repository.
- [ ] Latest Vercel deployment is successful.
- [ ] Build command is `npm run build`.
- [ ] Output directory is `dist`.

## 2. Environment

- [ ] `VITE_GOOGLE_SCRIPT_WEBAPP_URL` exists in Vercel.
- [ ] The value is the latest Apps Script Web App URL.
- [ ] The URL ends with `/exec`.
- [ ] Vercel was redeployed after environment variable changes.

## 3. Apps Script

- [ ] `apps-script/Code.gs` is copied to Apps Script.
- [ ] Apps Script project is saved.
- [ ] Web App is deployed.
- [ ] Access setting allows the web app to call it.
- [ ] `doGet` status check works.
- [ ] `getDashboardDataV2` action works.

## 4. Google Sheets

- [ ] Google Sheets file is ready.
- [ ] `Participants` sheet exists or can be created.
- [ ] `Responses` sheet exists or can be created.
- [ ] Headers are created correctly.
- [ ] Test save creates one participant row.
- [ ] Test save creates one response row.

## 5. Learner app

- [ ] `/` opens on smartphone.
- [ ] Team name input works.
- [ ] Nickname input works.
- [ ] Round selection works.
- [ ] Required input validation works.
- [ ] Local draft save works after refresh.
- [ ] AI prompt copy works.
- [ ] Result screen opens.
- [ ] Save result button works.

## 6. Instructor dashboard

- [ ] `/?view=instructor` opens on PC.
- [ ] Data refresh button works.
- [ ] Participant count is displayed.
- [ ] Response count is displayed.
- [ ] Team summary is displayed.
- [ ] Round distribution is displayed.
- [ ] Recent responses are displayed.
- [ ] Response detail expands correctly.

## 7. Preflight check

- [ ] `/?view=check` opens.
- [ ] Environment status is displayed.
- [ ] Learner link opens.
- [ ] Instructor link opens.
- [ ] Data load check works.
- [ ] Counts increase after a test save.

## 8. Pilot readiness

- [ ] One full rehearsal is completed.
- [ ] Test data is visible in dashboard.
- [ ] QR code or URL is ready for learners.
- [ ] Backup plan is ready if dashboard fails.
- [ ] Google Sheets backup copy procedure is prepared.
