export interface ParsedAiFields {
  growthGoal: string;
  twoWeekTask: string;
  leaderSupport: string;
  finalLines: string[];
}

export const extractionLabels = [
  { key: 'growthGoal', label: '2주 뒤 달라졌으면 하는 모습' },
  { key: 'twoWeekTask', label: '이번 주에 맡겨볼 작은 일' },
  { key: 'leaderSupport', label: '김원중 과장이 옆에서 도와줄 일' },
  { key: 'line1', label: '먼저 풀어줄 말' },
  { key: 'line2', label: '바로 답하기 전에 물어볼 말' },
  { key: 'line3', label: '이번 주에 같이 해볼 일' },
  { key: 'line4', label: '김원중 과장이 봐줄 선' },
  { key: 'line5', label: '입 밖으로 내면 안 좋은 말' },
] as const;

export type ExtractionFieldKey = (typeof extractionLabels)[number]['key'];

export function isFilled(value: string) {
  return value.trim().length > 0;
}

export function getFieldValue(fields: ParsedAiFields, key: ExtractionFieldKey) {
  if (key === 'growthGoal') return fields.growthGoal;
  if (key === 'twoWeekTask') return fields.twoWeekTask;
  if (key === 'leaderSupport') return fields.leaderSupport;

  const lineIndex = Number(key.replace('line', '')) - 1;
  return fields.finalLines[lineIndex] ?? '';
}

export function getPreviewText(value: string) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (!normalized) return '아직 잡히지 않았습니다.';
  return normalized.length > 74 ? `${normalized.slice(0, 74)}…` : normalized;
}

export function getExtractionStatus(fields: ParsedAiFields) {
  const planItems = [fields.growthGoal, fields.twoWeekTask, fields.leaderSupport];
  const lineItems = fields.finalLines.slice(0, 5);
  const planCount = planItems.filter(isFilled).length;
  const lineCount = lineItems.filter(isFilled).length;
  const totalCount = planCount + lineCount;
  const missingLabels = extractionLabels
    .filter((item) => !isFilled(getFieldValue(fields, item.key)))
    .map((item) => item.label);

  return {
    planCount,
    lineCount,
    totalCount,
    missingLabels,
    isComplete: totalCount === 8,
  };
}
