# 라운드별 콘텐츠 적용 레이어 맵

이 문서는 Bridge AI Leadership Journey v2.0의 라운드 콘텐츠가 어떤 파일에서 최종 보정되는지 정리한 문서입니다.

## 1. 왜 이 문서가 필요한가

현재 라운드 콘텐츠는 하나의 파일에서만 관리되지 않습니다. 기본 데이터 위에 여러 override 레이어가 순서대로 적용됩니다.

이 구조는 장점이 있습니다.

- 이름/직급 정규화, 선택별 반응 차별화, 줄바꿈 보정, 코칭 관점 추가를 분리해 관리할 수 있습니다.
- 특정 기준만 수정할 때 다른 콘텐츠를 건드리지 않아도 됩니다.
- R1~BOSS 전체에 공통 기준을 반복 적용하기 쉽습니다.

하지만 단점도 있습니다.

- 특정 라운드를 수정할 때 어느 파일을 고쳐야 하는지 헷갈릴 수 있습니다.
- R5와 BOSS처럼 기본 데이터와 여러 override 파일에 내용이 분산된 라운드는 유지보수자가 구조를 놓치기 쉽습니다.

따라서 이 문서는 “무엇을 바꿀 때 어디를 수정해야 하는지”를 안내합니다.

## 2. 최종 적용 순서

`src/data/roundOverridePipeline.ts` 기준으로 라운드 콘텐츠는 아래 순서로 합쳐집니다.

```text
1. rounds.ts 기본 라운드 데이터
2. roundOverrides.ts
3. finalRoundOverrides.ts
4. r01RefinementOverrides.ts
5. fieldLanguageOverrides.ts
6. pressureSituationOverrides.ts
7. firstDilemmaChoiceOverrides.ts
8. choicePathOverrides.ts
9. coachingViewpointOverrides.ts
10. directionPriorityOverrides.ts
11. r1LineBreakOverrides.ts
12. r2LineBreakOverrides.ts
13. r3ToBossLineBreakOverrides.ts
14. responseDifferentiationOverrides.ts
15. editorialFlowOverrides.ts
16. coachingViewpoints를 developmentPathIntroByChoice에 삽입
17. directionTitleOverrides.ts
18. storyLineBreaks.ts 공통 줄바꿈 후처리
19. roundNormalization.ts 이름/직급/표현 정규화
```

주의: 뒤에 적용되는 레이어가 앞의 같은 필드를 덮어씁니다.

## 3. 파일별 역할

| 파일 | 역할 | 주로 수정할 때 |
|---|---|---|
| `rounds.ts` | 기본 라운드 원본 데이터 | 새 라운드 추가, 전체 구조 초안 작성 |
| `roundOverrides.ts` | R1~R4 중심 상세 장면과 산출물 보정 | 상황문, 선택지, 실행안 자체를 크게 바꿀 때 |
| `finalRoundOverrides.ts` | 최종 라운드 표기와 일부 문구 보정 | 최종 표시명, 기본 학습 구조 보정 |
| `r01RefinementOverrides.ts` | R1 세부 보정 | R1만 세밀하게 고칠 때 |
| `fieldLanguageOverrides.ts` | 현장 언어 보정 | 말투, 현장 표현, 업무 언어를 바꿀 때 |
| `pressureSituationOverrides.ts` | 압박 상황 레이어 보정 | 일정 압박, 보고 압박, 상사 압박을 강화할 때 |
| `firstDilemmaChoiceOverrides.ts` | 첫 딜레마 선택지 보정 | A/B 선택지 자체를 다듬을 때 |
| `choicePathOverrides.ts` | A/B 선택 경로별 후배 반응·추가상황·다음 과제 | 선택에 따라 다른 장면을 만들 때 |
| `coachingViewpointOverrides.ts` | 라운드별 세 가지 코칭 관점 | 교육적 해석과 코칭 관점을 바꿀 때 |
| `directionPriorityOverrides.ts` | 선택 경로별 실행안 추천 우선순위 | A_keep, B_change 등에 따른 추천 순서를 바꿀 때 |
| `r1LineBreakOverrides.ts` | R1 수동 줄바꿈 | R1 모바일 읽기 리듬 보정 |
| `r2LineBreakOverrides.ts` | R2 수동 줄바꿈 | R2 모바일 읽기 리듬 보정 |
| `r3ToBossLineBreakOverrides.ts` | R3~BOSS 수동 줄바꿈 | R3~BOSS 장면 호흡 보정 |
| `responseDifferentiationOverrides.ts` | 선택 결과와 후배 반응의 최종 차별화 | firstResultByChoice, juniorReactionByChoice를 더 선명하게 만들 때 |
| `editorialFlowOverrides.ts` | 화면 흐름상 문구 보정 | 화면 이동과 학습 흐름 문구를 다듬을 때 |
| `directionTitleOverrides.ts` | 실행안 제목 표준화 | 실행안 제목 톤을 맞출 때 |
| `storyLineBreaks.ts` | 공통 자동 줄바꿈 | 수동 줄바꿈이 없는 긴 텍스트 자동 보정 |
| `roundNormalization.ts` | 이름·직급·표현 정규화 | 예전 인물명, 주임, 3~5줄 같은 잔여 표현을 자동 보정 |

## 4. 라운드별 주요 적용 레이어

| 라운드 | 핵심 관리 파일 | 보조 관리 파일 |
|---|---|---|
| R1 | `roundOverrides.ts`, `finalRoundOverrides.ts`, `r01RefinementOverrides.ts`, `r1LineBreakOverrides.ts` | `choicePathOverrides.ts`, `responseDifferentiationOverrides.ts`, `coachingViewpointOverrides.ts`, `directionPriorityOverrides.ts` |
| R2 | `roundOverrides.ts`, `r2LineBreakOverrides.ts`, `responseDifferentiationOverrides.ts` | `choicePathOverrides.ts`, `coachingViewpointOverrides.ts`, `directionPriorityOverrides.ts` |
| R3 | `roundOverrides.ts`, `r3ToBossLineBreakOverrides.ts`, `responseDifferentiationOverrides.ts` | `choicePathOverrides.ts`, `coachingViewpointOverrides.ts`, `directionPriorityOverrides.ts` |
| R4 | `roundOverrides.ts`, `r3ToBossLineBreakOverrides.ts`, `responseDifferentiationOverrides.ts` | `choicePathOverrides.ts`, `coachingViewpointOverrides.ts`, `directionPriorityOverrides.ts` |
| R5 | `rounds.ts`, `r3ToBossLineBreakOverrides.ts`, `responseDifferentiationOverrides.ts` | `choicePathOverrides.ts`, `coachingViewpointOverrides.ts`, `directionPriorityOverrides.ts` |
| BOSS | `rounds.ts`, `finalRoundOverrides.ts`, `r3ToBossLineBreakOverrides.ts`, `responseDifferentiationOverrides.ts` | `choicePathOverrides.ts`, `coachingViewpointOverrides.ts`, `directionPriorityOverrides.ts` |

## 5. R5/BOSS 수정 시 특히 주의할 점

R5와 BOSS는 R1~R4처럼 `roundOverrides.ts`에 모든 상세 본문이 모여 있지 않습니다. 기본 장면은 `rounds.ts`에 남아 있고, 최종 품질 보정은 여러 파일에 나뉘어 있습니다.

### R5를 수정할 때

| 수정 목적 | 수정 위치 |
|---|---|
| 기본 상황, 선택지, 실행안 원형 수정 | `rounds.ts` |
| 모바일 줄바꿈 리듬 수정 | `r3ToBossLineBreakOverrides.ts` |
| 선택별 결과·후배 반응 강화 | `responseDifferentiationOverrides.ts` |
| A/B 선택 뒤 달라지는 추가상황·다음 과제 수정 | `choicePathOverrides.ts` |
| 코칭 관점 수정 | `coachingViewpointOverrides.ts` |
| 선택 경로별 추천 실행안 순서 수정 | `directionPriorityOverrides.ts` |

### BOSS를 수정할 때

| 수정 목적 | 수정 위치 |
|---|---|
| 기본 상황, 선택지, 실행안 원형 수정 | `rounds.ts` |
| 최종 라운드 특수 보정 | `finalRoundOverrides.ts` |
| 모바일 줄바꿈 리듬 수정 | `r3ToBossLineBreakOverrides.ts` |
| 선택별 결과·후배 반응 강화 | `responseDifferentiationOverrides.ts` |
| A/B 선택 뒤 달라지는 추가상황·다음 과제 수정 | `choicePathOverrides.ts` |
| 코칭 관점 수정 | `coachingViewpointOverrides.ts` |
| 선택 경로별 추천 실행안 순서 수정 | `directionPriorityOverrides.ts` |

## 6. 콘텐츠 수정 우선순위

라운드 내용을 수정할 때는 아래 순서를 권장합니다.

```text
1. 먼저 어떤 화면에서 보이는 문구인지 확인한다.
2. 상황문·선택지·실행안 원형이면 rounds.ts 또는 roundOverrides.ts를 확인한다.
3. 선택별 반응 차이라면 choicePathOverrides.ts와 responseDifferentiationOverrides.ts를 확인한다.
4. 줄바꿈 문제라면 r1/r2/r3ToBossLineBreakOverrides.ts를 확인한다.
5. 이름·직급·구버전 표현 문제라면 roundNormalization.ts를 확인한다.
6. 최종 표시 결과가 이상하면 normalizedRounds.ts 결과를 기준으로 점검한다.
```

## 7. 새로운 라운드를 추가할 때 체크리스트

새 라운드를 추가하면 아래 파일을 함께 검토합니다.

- [ ] `rounds.ts`에 기본 라운드 추가
- [ ] 필요 시 `roundOverrides.ts`에 상세 보정 추가
- [ ] `choicePathOverrides.ts`에 선택별 후배 반응·추가상황 추가
- [ ] `coachingViewpointOverrides.ts`에 세 가지 코칭 관점 추가
- [ ] `directionPriorityOverrides.ts`에 선택 경로별 추천 순서 추가
- [ ] 수동 줄바꿈 override 추가
- [ ] `responseDifferentiationOverrides.ts`에 선택 결과·후배 반응 고도화 추가
- [ ] `roundNormalization.ts`에서 이름·직급·표현 정규화가 필요한지 확인
- [ ] `docs/content-line-break-policy.md` 기준에 맞는지 확인

## 8. 현재 정리 상태

현재 기준으로는 다음 보완이 반영되어 있습니다.

```text
R1: 수동 줄바꿈, 선택별 반응 차별화, 코칭 관점, 추천 우선순위 적용
R2: 수동 줄바꿈, 선택별 반응 차별화, 코칭 관점, 추천 우선순위 적용
R3: 수동 줄바꿈, 선택별 반응 차별화, 코칭 관점, 추천 우선순위 적용
R4: 수동 줄바꿈, 선택별 반응 차별화, 코칭 관점, 추천 우선순위 적용
R5: 수동 줄바꿈, 선택별 반응 차별화, 코칭 관점, 추천 우선순위 적용
BOSS: 수동 줄바꿈, 선택별 반응 차별화, 코칭 관점, 추천 우선순위 적용
```

따라서 기능적으로는 전체 라운드 보완 기준이 적용된 상태입니다. 다만 R5와 BOSS는 기본 본문이 `rounds.ts`에 남아 있으므로, 해당 라운드의 큰 장면 자체를 바꾸려면 `rounds.ts`도 반드시 확인해야 합니다.
