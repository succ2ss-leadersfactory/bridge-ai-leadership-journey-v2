# Bridge AI Leadership Journey v2.0 배포 런북

이 문서는 한국공항공사 Bridge AI Leadership Journey v2.0을 GitHub, Vercel, Google Sheets, Apps Script로 실제 운영하기 위한 배포 절차입니다.

## 1. 전체 구조

```text
교육생 스마트폰 웹앱
  ↓ 결과 저장
Vercel 배포 URL
  ↓ VITE_GOOGLE_SCRIPT_WEBAPP_URL
Apps Script Web App URL
  ↓ append/update
Google Sheets: Participants / Responses
  ↓ 조회
강사용 PC 대시보드 /?view=instructor
```

## 2. 배포 전 준비물

- GitHub 저장소: `succ2ss-leadersfactory/bridge-ai-leadership-journey-v2`
- Vercel 프로젝트
- Google Sheets 파일
- Apps Script Web App URL
- 테스트용 스마트폰 1대 이상
- 강사용 PC 또는 노트북 1대

## 3. PR 병합 확인

GitHub에서 다음 PR들이 `main`에 병합되어 있는지 확인합니다.

- PR #1 기본 프로젝트 세팅
- PR #2 v2.0 데이터 타입과 라운드 구조
- PR #3 스마트폰 교육생 화면
- PR #4 localStorage 임시 저장과 AI 프롬프트 복사
- PR #5 Google Sheets 결과 저장 연동
- PR #6 Apps Script v2.0 저장 엔드포인트
- PR #7 강사용 v2.0 대시보드
- PR #8 파일럿 QA 보완

## 4. Google Sheets 설정

### 4.1 시트 생성

Google Sheets 파일을 만들고 아래 시트를 준비합니다.

- `Participants`
- `Responses`

시트가 없어도 Apps Script가 자동 생성하지만, 운영 전에는 미리 만들어두는 것을 권장합니다.

### 4.2 Apps Script 코드 반영

1. Google Sheets 상단 메뉴에서 `확장 프로그램` → `Apps Script`를 클릭합니다.
2. 기본 `Code.gs` 내용을 삭제합니다.
3. 저장소의 `apps-script/Code.gs` 내용을 전체 복사해 붙여넣습니다.
4. 저장합니다.

### 4.3 Web App 배포

1. Apps Script 우측 상단 `배포`를 클릭합니다.
2. `새 배포`를 선택합니다.
3. 유형은 `웹 앱`으로 선택합니다.
4. 실행 권한은 `나`로 설정합니다.
5. 액세스 권한은 외부 웹앱에서 호출 가능한 수준으로 설정합니다.
6. 배포 후 `/exec`로 끝나는 Web App URL을 복사합니다.

## 5. Vercel 환경변수 설정

Vercel 프로젝트의 Environment Variables에 아래 값을 등록합니다.

```text
VITE_GOOGLE_SCRIPT_WEBAPP_URL=<Apps Script Web App URL>
```

중요합니다.

- 환경변수 이름은 정확히 `VITE_GOOGLE_SCRIPT_WEBAPP_URL`이어야 합니다.
- URL은 `/exec`로 끝나는 최신 배포 URL이어야 합니다.
- 환경변수 등록 후 반드시 Vercel 재배포가 필요합니다.

## 6. Vercel 재배포

1. Vercel 프로젝트로 이동합니다.
2. 최신 `main` 브랜치 commit이 배포되었는지 확인합니다.
3. 환경변수 등록 후 `Redeploy`를 실행합니다.
4. 배포가 완료되면 배포 URL을 복사합니다.

## 7. 접속 URL

### 교육생 스마트폰 화면

```text
https://<vercel-domain>/
```

### 강사용 PC 대시보드

```text
https://<vercel-domain>/?view=instructor
```

## 8. End-to-End 테스트

### 8.1 교육생 저장 테스트

1. 스마트폰에서 교육생 URL에 접속합니다.
2. 팀명과 닉네임을 입력합니다.
3. 라운드 1개를 선택합니다.
4. 마지막 결과 화면까지 진행합니다.
5. `결과 저장하기`를 누릅니다.
6. Google Sheets `Participants`, `Responses`에 행이 생성되는지 확인합니다.

### 8.2 강사용 대시보드 테스트

1. PC에서 `/?view=instructor` URL에 접속합니다.
2. `데이터 새로고침`을 누릅니다.
3. 참여자 수, 전체 응답 수, 참여 팀 수가 갱신되는지 확인합니다.
4. 최근 저장 응답을 펼쳐 2주 미니 육성 플랜과 5줄 실행문이 보이는지 확인합니다.

## 9. 교육장 운영 권장 절차

### 교육 시작 30분 전

- Vercel 배포 URL 접속 확인
- 강사용 대시보드 접속 확인
- Google Sheets 저장 확인
- 테스트 응답 1건 저장
- 테스트 응답이 대시보드에 보이는지 확인

### 교육 시작 직전

- 교육생에게 스마트폰 URL 또는 QR코드 제공
- 팀명 입력 규칙 안내
- 닉네임 입력 규칙 안내
- AI 프롬프트 복사 후 외부 AI에 붙여넣는 방식 안내

### 교육 중

- 첫 1명 저장 확인 후 전체 진행
- 중간에 강사용 대시보드 새로고침
- 저장이 안 되는 경우 localStorage 임시 저장이 남아 있으니 새로고침 전 강사에게 알리도록 안내

### 교육 종료 전

- 모든 팀이 결과 저장하기를 눌렀는지 확인
- 대시보드에서 응답 건수 확인
- Google Sheets 원본 저장 확인

## 10. 장애 대응

### 저장이 되지 않는 경우

1. Vercel 환경변수가 설정되어 있는지 확인합니다.
2. 환경변수 등록 후 재배포했는지 확인합니다.
3. Apps Script URL이 최신 `/exec` URL인지 확인합니다.
4. Apps Script Web App 접근 권한을 확인합니다.
5. Apps Script 실행 로그를 확인합니다.

### 대시보드 조회가 안 되는 경우

1. `/?view=instructor`로 접속했는지 확인합니다.
2. `데이터 새로고침`을 눌렀는지 확인합니다.
3. Apps Script `doGet(e)`가 `action=getDashboardDataV2`를 처리하는 최신 코드인지 확인합니다.
4. 브라우저 캐시를 새로고침합니다.

### 교육생 입력값이 사라진 경우

1. 같은 기기와 같은 브라우저인지 확인합니다.
2. 시크릿 모드 여부를 확인합니다.
3. 결과 화면에서 `새 라운드로 다시 시작`을 누른 적이 있는지 확인합니다.

## 11. 운영 후 백업

교육 종료 후 Google Sheets를 복사해 백업합니다.

권장 파일명:

```text
한국공항공사_Bridge_AI_Leadership_Journey_v2_파일럿결과_YYYYMMDD
```
