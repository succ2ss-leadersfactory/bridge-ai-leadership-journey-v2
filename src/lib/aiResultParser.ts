export function extractBlock(text: string, tag: string) {
  const pattern = new RegExp(`<${tag}>([\s\S]*?)<\/${tag}>`, 'i');
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cleanExtractedValue(value: string) {
  return value
    .replace(/^[-*•\s]+/, '')
    .replace(/^[:：\s]+/, '')
    .trim();
}

function extractLabeledValue(text: string, labels: string[]) {
  for (const label of labels) {
    const pattern = new RegExp(`${escapeRegExp(label)}\s*[:：]?\s*([^\n]+)`, 'i');
    const match = text.match(pattern);
    if (match?.[1]) return cleanExtractedValue(match[1]);
  }

  return '';
}

export function parseFinalArtifactFields(finalArtifact: string) {
  return {
    growthGoal: extractLabeledValue(finalArtifact, [
      '2주 뒤 달라졌으면 하는 모습',
      '2주 뒤, 뭐가 조금 달라지면 좋을까요',
      '2주 뒤 변화',
    ]),
    twoWeekTask: extractLabeledValue(finalArtifact, [
      '이번 주에 맡겨볼 작은 일',
      '이번 주에 실제로 맡겨볼 일',
      '이번 주 함께 해볼 일',
    ]),
    leaderSupport: extractLabeledValue(finalArtifact, [
      '김원중 과장이 옆에서 도와줄 일',
      '김원중 과장은 어디까지 봐줄까요',
      '김원중 과장이 봐줄 선',
    ]),
    finalLines: [
      extractLabeledValue(finalArtifact, ['먼저 풀어줄 말', '1) 먼저 풀어줄 말']),
      extractLabeledValue(finalArtifact, ['바로 답하기 전에 물어볼 말', '2) 바로 답하기 전에 물어볼 말']),
      extractLabeledValue(finalArtifact, ['이번 주에 같이 해볼 일', '3) 이번 주에 같이 해볼 일']),
      extractLabeledValue(finalArtifact, ['김원중 과장이 봐줄 선', '4) 김원중 과장이 봐줄 선']),
      extractLabeledValue(finalArtifact, ['입 밖으로 내면 안 좋은 말', '5) 입 밖으로 내면 안 좋은 말']),
    ],
  };
}

export function parseAiResult(text: string) {
  const finalArtifact = extractBlock(text, 'FINAL_ARTIFACT');
  const reviewNotes = extractBlock(text, 'REVIEW_NOTES');
  const fields = parseFinalArtifactFields(finalArtifact);

  return {
    finalArtifact,
    reviewNotes,
    fields,
    hasStructuredResult: Boolean(finalArtifact || reviewNotes),
  };
}
