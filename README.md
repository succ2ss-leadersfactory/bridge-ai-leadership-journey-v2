# Bridge AI Leadership Journey · Local Storage Mode

한국공항공사 과장급 중간관리자 대상 후배 육성 Lab 웹앱입니다.

이 브랜치는 강사 대시보드, Google Sheets, Apps Script 저장을 사용하지 않는 **교육생 단독 실행용 localStorage 버전**입니다.

## 운영 원칙

- 교육생 입력값과 최종 결과는 현재 기기의 브라우저에만 저장됩니다.
- 강사용 대시보드로 데이터를 전송하지 않습니다.
- Google Sheets / Apps Script / 별도 서버 저장이 필요하지 않습니다.
- 진행 중 내용은 브라우저 localStorage에 자동 임시 저장됩니다.
- 최종 결과는 라운드별로 localStorage에 누적 저장됩니다.
- 저장 결과는 JSON 백업 파일로 내려받을 수 있습니다.
- `npm run build` 결과는 CSS/JS를 포함한 **단일 `dist/index.html` 파일**로 생성됩니다.

## 학습 흐름

```text
입장
→ 세션 선택
→ 라운드 선택
→ 상황 읽기
→ 후배 행동 읽기
→ 1차 대응 선택
→ 선택 결과 확인
→ 후배 반응 확인
→ 추가 상황 확인
→ 딜레마 재분석
→ 2차 판단 선택
→ 육성 방향 선택
→ AI 프롬프트 생성·수정·복사
→ AI 답변 붙여넣기·검토
→ 2주 실행안 5개 항목 작성
→ 후배에게 실제로 할 말 5줄 작성
→ 이 기기에 최종 결과 저장
```

## 세션 구조

| 세션 | 주제 | 라운드 |
|---|---|---|
| Session 1 | 후배를 제대로 읽다 | R1, R2 |
| Session 2 | 키울 것을 하나로 잡다 | R5, R4 |
| Session 3 | 다시 움직이게 하다 | R3, 종합 라운드 |

## 기술 구성

- React
- Vite
- TypeScript
- localStorage
- vite-plugin-singlefile

실행 자체에는 Google Sheets, Apps Script, Vercel 환경변수가 필요하지 않습니다.

## 오프라인 단일 HTML 만들기

```bash
npm install
npm run build
```

빌드가 끝나면 아래 파일 하나만 사용하면 됩니다.

```text
dist/index.html
```

이 파일을 교육용 노트북, USB 등에 복사해 브라우저에서 직접 열어 사용할 수 있습니다. 앱의 화면과 로컬 저장 기능은 별도 웹 서버 없이 작동하도록 단일 파일로 패키징됩니다.

> AI 답변 생성 단계에서 GPT/Gemini/Claude 등 외부 AI를 실제로 사용하려면 해당 서비스 접속을 위한 네트워크는 필요합니다. 웹앱 자체의 진행·작성·최종 저장은 localStorage 방식입니다.

## 저장 키

현재 브라우저에는 다음 목적의 데이터가 저장됩니다.

```text
bridge-ai-leadership-journey-v2:learner-draft
bridge-ai-leadership-journey-v2:completed-rounds
bridge-ai-leadership-journey-v2:local-results
```

브라우저 데이터 삭제, 시크릿 모드 종료, 기기 초기화 시 localStorage 데이터가 사라질 수 있으므로 중요한 결과는 화면의 **저장 결과 백업 파일 받기**로 JSON 파일을 보관합니다.

## 로컬 개발

```bash
npm install
npm run dev
```

## 품질 점검

```bash
npm run typecheck
npm run audit:linebreaks
npm run smoke:parser
npm run build
```

## 로컬 운영 최소 점검

1. `dist/index.html`을 직접 열었을 때 교육생 화면이 정상적으로 열린다.
2. 팀과 이름/닉네임을 입력하면 세션 Map으로 이동한다.
3. 진행 중 입력값이 새로고침 후 복원된다.
4. AI 프롬프트 복사가 작동한다.
5. AI 답변 붙여넣기 후 5개 실행안과 5줄 대화문 분리가 작동한다.
6. 최종본 저장 시 `local-results`에 결과가 기록된다.
7. 저장 완료 후 라운드 완료 표시가 나타난다.
8. JSON 백업 파일 내려받기가 작동한다.
9. 네트워크 연결이 없어도 웹앱 진행과 최종 로컬 저장 자체는 작동한다.

## 참고

기존 저장소의 강사용 대시보드, Google Sheets, Apps Script 관련 파일은 이전 v2.0 운영 구조를 참고하기 위해 당분간 남겨두되, 이 브랜치의 앱 진입점에서는 사용하지 않습니다. 다음 정리 단계에서 완전히 제거할 수 있습니다.
