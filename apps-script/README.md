# Apps Script v2.0 저장 연동 안내

이 폴더의 `Code.gs`는 한국공항공사 Bridge AI Leadership Journey v2.0 웹앱의 Google Sheets 저장 연동용 Apps Script 코드입니다.

## 1. Google Sheets 준비

Google Sheets 파일을 만들고 아래 시트를 준비합니다.

- `Participants`
- `Responses`

시트가 없어도 `Code.gs`가 자동으로 생성합니다. 다만 파일럿 운영 전에는 시트를 미리 만들어 두는 것을 권장합니다.

## 2. Apps Script 열기

1. Google Sheets 상단 메뉴에서 `확장 프로그램`을 클릭합니다.
2. `Apps Script`를 엽니다.
3. 기본 `Code.gs` 내용을 삭제합니다.
4. 이 저장소의 `apps-script/Code.gs` 전체 내용을 붙여 넣습니다.
5. 저장합니다.

> 중요: 이 코드는 `SpreadsheetApp.getActiveSpreadsheet()`를 사용합니다. Apps Script는 반드시 저장 대상 Google Sheets에서 `확장 프로그램 → Apps Script`로 열어 만든 **바운드 스크립트**로 운영하는 것을 권장합니다.

## 3. 웹앱 배포

1. Apps Script 우측 상단 `배포`를 클릭합니다.
2. `새 배포`를 선택합니다.
3. 유형은 `웹 앱`으로 선택합니다.
4. 실행 권한은 `나`로 설정합니다.
5. 액세스 권한은 교육장 운영 상황에 맞게 설정합니다.
   - 일반적으로 테스트 단계에서는 `모든 사용자` 또는 `링크가 있는 모든 사용자`로 설정해야 외부 웹앱에서 호출할 수 있습니다.
6. 배포 후 생성된 Web App URL을 복사합니다.
7. URL은 보통 `/exec`로 끝납니다. `/dev` URL은 테스트 환경에 따라 외부 접근이 불안정할 수 있으므로 운영에는 `/exec` URL을 권장합니다.

## 4. Vercel 환경변수 등록

Vercel 프로젝트의 Environment Variables에 아래 값을 등록합니다.

```text
VITE_GOOGLE_SCRIPT_WEBAPP_URL=<Apps Script Web App URL>
```

등록 후 반드시 Vercel을 다시 배포해야 반영됩니다.

## 5. 사전 시트 점검

배포 URL 뒤에 아래 쿼리를 붙여 접속합니다.

```text
?action=setupSheetsV2
```

예:

```text
https://script.google.com/macros/s/배포ID/exec?action=setupSheetsV2
```

정상이라면 JSON 응답에 다음 내용이 보입니다.

```json
{
  "ok": true,
  "action": "setupSheetsV2",
  "sheets": [
    { "name": "Participants" },
    { "name": "Responses" }
  ]
}
```

이 액션은 `Participants`, `Responses` 시트를 만들고 현재 v2 컬럼 헤더를 맞춥니다.

## 6. 프론트엔드 payload

웹앱은 아래 action으로 Apps Script에 저장 요청을 보냅니다.

```json
{
  "action": "saveLearnerResultV2",
  "participant": {
    "participant_id": "...",
    "team_name": "...",
    "nickname": "..."
  },
  "response": {
    "response_id": "...",
    "participant_id": "...",
    "round_id": "...",
    "current_step": "result"
  },
  "meta": {
    "appVersion": "v2.0",
    "source": "learner-mobile",
    "savedFrom": "webapp"
  }
}
```

## 7. 저장되는 시트

### Participants

- `participant_id`
- `team_name`
- `nickname`
- `created_at`
- `updated_at`

### Responses

- `response_id`
- `participant_id`
- `team_name`
- `nickname`
- `round_id`
- `current_step`
- `junior_reading`
- `first_choice`
- `first_reason`
- `development_dilemma`
- `second_choice`
- `final_action_id`
- `development_direction`
- `generated_prompt`
- `edited_prompt`
- `ai_use_as_is`
- `ai_revise`
- `ai_risky`
- `growth_goal`
- `two_week_task`
- `leader_support`
- `check_timing`
- `watch_out`
- `final_line_1`
- `final_line_2`
- `final_line_3`
- `final_line_4`
- `final_line_5`
- `is_completed`
- `created_at`
- `updated_at`

## 8. 테스트 방법

1. `?action=setupSheetsV2`로 시트와 헤더를 먼저 확인합니다.
2. 웹앱에서 라운드를 끝까지 진행합니다.
3. 결과 화면에서 `최종본 저장하기`를 누릅니다.
4. Google Sheets의 `Participants`, `Responses` 시트에 행이 추가되는지 확인합니다.
5. 강사용 대시보드에서 `데이터 새로고침`을 눌러 저장 결과를 확인합니다.
6. 저장되지 않으면 아래 항목을 확인합니다.
   - Vercel 환경변수명이 정확한지
   - Vercel 재배포를 했는지
   - Apps Script 배포 권한이 외부 호출 가능 상태인지
   - Apps Script Web App URL이 `/exec`로 끝나는 최신 배포 URL인지
   - Apps Script가 저장 대상 Google Sheets에 바운드되어 있는지

## 9. 대시보드 조회용 action

강사용 대시보드는 아래 action을 호출합니다.

```text
?action=getDashboardDataV2
```

이 action은 `Participants`, `Responses` 시트의 데이터를 JSON으로 반환합니다.

## 10. 운영 안정화 장치

현재 `Code.gs`에는 다음 안정화 장치가 포함되어 있습니다.

- `LockService.getScriptLock()`으로 동시 저장 시 행 업데이트 충돌을 줄입니다.
- `setupSheetsV2`로 파일럿 전에 시트와 헤더를 사전 생성·점검할 수 있습니다.
- `getSpreadsheet()`에서 활성 스프레드시트가 없을 경우 명확한 오류를 반환합니다.
- `rowsToObjects()`는 빈 헤더 컬럼을 무시하여 대시보드 JSON 노이즈를 줄입니다.
