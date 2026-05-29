# 콘텐츠 줄바꿈 적용 기준

이 문서는 Bridge AI Leadership Journey v2.0의 라운드 콘텐츠 줄바꿈 기준을 정리한 문서입니다.

## 1. 적용 목적

교육생은 주로 스마트폰 또는 태블릿으로 앱을 사용합니다. 따라서 긴 상황문이 한 덩어리로 보이면 몰입도가 떨어지고, 교육장에서 읽는 시간이 길어집니다.

줄바꿈 기준의 목적은 다음과 같습니다.

- 모바일 화면에서 장면을 빠르게 읽게 한다.
- 후배 행동, 리더 판단, 추가 상황, 남은 부담이 구분되어 보이게 한다.
- 라운드마다 텍스트 밀도와 읽기 리듬을 비슷하게 유지한다.
- 기존 R1, R2처럼 수동으로 다듬은 줄바꿈은 보존한다.

## 2. 현재 적용 방식

줄바꿈은 두 방식으로 적용됩니다.

| 구분 | 적용 방식 |
|---|---|
| R1, R2 | `r1LineBreakOverrides.ts`, `r2LineBreakOverrides.ts`에 수동 줄바꿈 적용 |
| R3 이후 전체 라운드 | `storyLineBreaks.ts`의 공통 자동 줄바꿈 정규화 적용 |

공통 함수는 라운드 override 파이프라인 마지막에 적용됩니다.

```text
기본 라운드
→ override layers
→ 이름/직급/표현 정리
→ 방향 제목 정리
→ 전체 라운드 줄바꿈 정규화
```

## 3. 핵심 원칙

### 3.1 수동 줄바꿈 보존

이미 `\n`이 들어간 문장은 자동 줄바꿈을 다시 적용하지 않습니다.

즉, 사람이 직접 리듬을 맞춘 문장은 그대로 유지합니다.

### 3.2 긴 문장만 자동 정리

짧은 문장은 그대로 둡니다.

현재 기준은 다음과 같습니다.

```text
72자 미만: 그대로 유지
72자 이상: 자동 줄바꿈 후보
```

### 3.3 문장 단위 분리

자동 줄바꿈은 문장 단위로 처리합니다.

```text
문장 1
문장 2

문장 3
문장 4
```

기본적으로 두 문장을 한 문단으로 묶고, 문단 사이에는 빈 줄을 넣습니다.

## 4. 적용 필드

현재 공통 줄바꿈은 아래 필드에 적용됩니다.

```text
situation
juniorReaction
additionalSituation
dilemmaPrompt
firstResultByChoice.A
firstResultByChoice.B
juniorReactionByChoice
additionalSituationByChoice
developmentPathIntroByChoice
juniorSignals
dilemmaHints
firstChoices.label
firstChoices.benefit
firstChoices.cost
firstChoices.likelySignal
secondChoices.description
developmentDirections.description
developmentDirections.bestWhen
developmentDirections.watchOut
coachingViewpoints.body
```

## 5. 화면 표시 기준

CSS에서는 아래 요소에 줄바꿈을 보이게 하는 설정이 적용되어 있습니다.

```css
white-space: pre-line;
```

대표 적용 대상은 다음입니다.

- `story-card`
- `step-description`
- `choice-note`
- `text-panel-helper`
- `ai-artifact-card.compact p`

따라서 데이터에 들어간 `\n`은 실제 화면에서 줄바꿈으로 보입니다.

## 6. 향후 콘텐츠 작성 기준

새 라운드를 추가하거나 기존 라운드를 수동 보정할 때는 다음 기준을 따릅니다.

### 상황문

권장 구조:

```text
장면 배경
후배 행동

리더가 본 문제 신호
상사 또는 시간 압박

딜레마가 드러나는 마지막 문장
```

### 선택 결과

권장 구조:

```text
선택 직후 일어난 변화
업무 흐름의 즉시 결과

후배에게 남은 메시지
다음 행동 가능성
```

### 추가 상황

권장 구조:

```text
시간이 지난 뒤 새로 드러난 장면
처음 선택의 비용

리더가 다시 봐야 할 판단 지점
```

## 7. 주의할 점

- 줄바꿈을 너무 많이 넣어 한 문장씩 끊어 읽게 만들지 않습니다.
- 교육생이 스마트폰에서 읽을 때 한 화면 안에 핵심 장면이 들어오도록 조정합니다.
- 이미 수동 줄바꿈이 있는 R1, R2는 자동 함수가 건드리지 않도록 유지합니다.
- 줄바꿈은 의미 단위 구분을 위한 것이지, 디자인 장식이 아닙니다.

## 8. 현재 상태

현재 기준으로는 다음과 같이 적용되어 있습니다.

```text
R1: 수동 줄바꿈 적용
R2: 수동 줄바꿈 적용
R3~Boss Round: 공통 자동 줄바꿈 적용
```

따라서 전체 라운드는 모바일 읽기 기준의 줄바꿈 처리가 적용된 상태입니다.
