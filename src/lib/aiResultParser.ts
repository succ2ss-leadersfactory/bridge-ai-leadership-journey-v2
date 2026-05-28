export function extractBlock(text: string, tag: string) {
  const pattern = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

const fieldAliases = {
  growthGoal: [
    '2주 뒤 달라졌으면 하는 모습',
    '2주 뒤, 뭐가 조금 달라지면 좋을까요',
    '2주 뒤 변화',
  ],
  twoWeekTask: [
    '이번 주에 맡겨볼 작은 일',
    '이번 주에 실제로 맡겨볼 일',
    '이번 주 함께 해볼 일',
  ],
  leaderSupport: [
    '김원중 과장이 옆에서 도와줄 일',
    '김원중 과장은 어디까지 봐줄까요',
    '김원중 과장이 봐줄 선',
  ],
  line1: ['먼저 풀어줄 말'],
  line2: ['바로 답하기 전에 물어볼 말'],
  line3: ['이번 주에 같이 해볼 일'],
  line4: ['김원중 과장이 봐줄 선'],
  line5: ['입 밖으로 내면 안 좋은 말'],
} as const;

type ParsedFieldKey = keyof typeof fieldAliases;

const orderedFieldKeys: ParsedFieldKey[] = [
  'growthGoal',
  'twoWeekTask',
  'leaderSupport',
  'line1',
  'line2',
  'line3',
  'line4',
  'line5',
];

function normalizeLine(line: string) {
  return line
    .replace(/^\s*[-*•]\s*/, '')
    .replace(/^\s*\d+[.)]\s*/, '')
    .trim();
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

function getFieldKeyFromLine(line: string): ParsedFieldKey | null {
  const normalized = normalizeLine(line);

  for (const key of orderedFieldKeys) {
    const aliases = fieldAliases[key];
    if (aliases.some((alias) => normalized === alias || normalized.startsWith(`${alias}:`) || normalized.startsWith(`${alias}：`))) {
      return key;
    }
  }

  return null;
}

function removeLabelFromLine(line: string, key: ParsedFieldKey) {
  let normalized = normalizeLine(line);

  for (const alias of fieldAliases[key]) {
    if (normalized === alias) return '';
    if (normalized.startsWith(`${alias}:`)) {
      return normalized.slice(alias.length + 1).trim();
    }
    if (normalized.startsWith(`${alias}：`)) {
      return normalized.slice(alias.length + 1).trim();
    }
  }

  return normalized;
}

function parseFieldsFromText(text: string) {
  const buckets: Record<ParsedFieldKey, string[]> = {
    growthGoal: [],
    twoWeekTask: [],
    leaderSupport: [],
    line1: [],
    line2: [],
    line3: [],
    line4: [],
    line5: [],
  };

  let currentKey: ParsedFieldKey | null = null;

  text.split(/\r?\n/).forEach((line) => {
    const nextKey = getFieldKeyFromLine(line);

    if (nextKey) {
      currentKey = nextKey;
      const inlineValue = removeLabelFromLine(line, nextKey);
      if (inlineValue) buckets[nextKey].push(inlineValue);
      return;
    }

    if (!currentKey) return;

    const normalized = normalizeLine(line);
    const isSectionTitle = /^\d+\.\s/.test(normalized) || /^<\/?[A-Z_]+>$/.test(normalized);
    if (isSectionTitle) return;

    if (line.trim().length > 0) {
      buckets[currentKey].push(line.trim());
    }
  });

  return {
    growthGoal: cleanExtractedValue(buckets.growthGoal.join('\n')),
    twoWeekTask: cleanExtractedValue(buckets.twoWeekTask.join('\n')),
    leaderSupport: cleanExtractedValue(buckets.leaderSupport.join('\n')),
    finalLines: [
      cleanExtractedValue(buckets.line1.join('\n')),
      cleanExtractedValue(buckets.line2.join('\n')),
      cleanExtractedValue(buckets.line3.join('\n')),
      cleanExtractedValue(buckets.line4.join('\n')),
      cleanExtractedValue(buckets.line5.join('\n')),
    ],
  };
}

export function parseFinalArtifactFields(finalArtifact: string) {
  return parseFieldsFromText(finalArtifact);
}

export function parseAiResult(text: string) {
  const taggedFinalArtifact = extractBlock(text, 'FINAL_ARTIFACT');
  const finalArtifact = taggedFinalArtifact || text;
  const reviewNotes = extractBlock(text, 'REVIEW_NOTES');
  const fields = parseFinalArtifactFields(finalArtifact);

  return {
    finalArtifact: taggedFinalArtifact,
    reviewNotes,
    fields,
    hasStructuredResult: Boolean(taggedFinalArtifact || reviewNotes || fields.growthGoal || fields.twoWeekTask || fields.finalLines.some(Boolean)),
  };
}
