export function extractBlock(text: string, tag: string) {
  const pattern = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cleanExtractedValue(value: string) {
  return value
    .split('\n')
    .map((line) => line.replace(/^\s*[-*•]\s*/, '').trimEnd())
    .join('\n')
    .replace(/^[:：\s]+/, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const allKnownLabels = [
  '2주 뒤 달라졌으면 하는 모습',
  '2주 뒤, 뭐가 조금 달라지면 좋을까요',
  '2주 뒤 변화',
  '이번 주에 맡겨볼 작은 일',
  '이번 주에 실제로 맡겨볼 일',
  '이번 주 함께 해볼 일',
  '김원중 과장이 옆에서 도와줄 일',
  '김원중 과장은 어디까지 봐줄까요',
  '김원중 과장이 봐줄 선',
  '언제 짧게 같이 볼지',
  '말할 때 조심할 표현',
  '먼저 풀어줄 말',
  '바로 답하기 전에 물어볼 말',
  '이번 주에 같이 해볼 일',
  '입 밖으로 내면 안 좋은 말',
];

function buildNextLabelLookahead(currentLabels: string[]) {
  const nextLabels = allKnownLabels.filter((label) => !currentLabels.includes(label));
  const escapedLabels = nextLabels.map(escapeRegExp).join('|');

  return `(?=\\n\\s*(?:[-*•]\\s*)?(?:\\d+[.)]\\s*)?(?:${escapedLabels})\\s*[:：]|\\n\\s*\\d+[.)]\\s|$)`;
}

function extractLabeledValue(text: string, labels: string[]) {
  for (const label of labels) {
    const pattern = new RegExp(
      `(?:^|\\n)\\s*(?:[-*•]\\s*)?(?:\\d+[.)]\\s*)?${escapeRegExp(label)}\\s*[:：]?\\s*([\\s\\S]*?)${buildNextLabelLookahead(labels)}`,
      'i',
    );
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
      extractLabeledValue(finalArtifact, ['먼저 풀어줄 말']),
      extractLabeledValue(finalArtifact, ['바로 답하기 전에 물어볼 말']),
      extractLabeledValue(finalArtifact, ['이번 주에 같이 해볼 일']),
      extractLabeledValue(finalArtifact, ['김원중 과장이 봐줄 선']),
      extractLabeledValue(finalArtifact, ['입 밖으로 내면 안 좋은 말']),
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
