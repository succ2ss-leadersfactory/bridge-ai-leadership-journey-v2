import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const rootDir = process.cwd();
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kac-parser-smoke-'));
const parserTs = path.join(rootDir, 'src/lib/aiResultParser.ts');
const parserMjs = path.join(tempDir, 'aiResultParser.mjs');
const smokeMjs = path.join(tempDir, 'smoke.mjs');

const source = fs
  .readFileSync(parserTs, 'utf8')
  .replace(/\bas const\b/g, '')
  .replace(/^type\s+[^;]+;$/gm, '')
  .replace(/: string/g, '')
  .replace(/: ParsedFieldKey \| null/g, '')
  .replace(/: ParsedFieldKey/g, '')
  .replace(/Record<ParsedFieldKey, string\[]>/g, '')
  .replace(/\) \{/g, ') {');

fs.writeFileSync(parserMjs, source, 'utf8');

const testCode = `
import { parseAiResult } from ${JSON.stringify(parserMjs)};

const sample = \`<FINAL_ARTIFACT>
1. 2주 동안 같이 해볼 일
- 2주 뒤 달라졌으면 하는 모습: 황성빈 대리가 빠르게 자료를 만들되, 제출 전 기준 항목을 스스로 확인한다.
- 이번 주에 맡겨볼 작은 일: 다음 자료 제출 전 기준일자, 숫자, 공유 대상 3가지를 먼저 체크해서 가져온다.
- 김원중 과장이 옆에서 도와줄 일: 처음 두 번은 제출 전 5분만 함께 보고, 이후에는 황성빈 대리가 먼저 기준을 잡아본다.
- 언제 짧게 같이 볼지: 향후 2주 동안 회의자료 제출 후 5분.
- 말할 때 조심할 표현: 다음부터는 천천히 하세요.

2. 후배 코칭 대화문 5줄
1) 먼저 풀어줄 말: 빠르게 정리해서 올린 건 좋았습니다.
2) 바로 답하기 전에 물어볼 말: 이번 자료는 올리기 전에 기준일자와 숫자, 공유 대상 중 어떤 항목까지 확인했나요?
3) 이번 주에 같이 해볼 일: 아직 참여하지 않았습니다.
4) 김원중 과장이 봐줄 선: 아직 참여하지 않았습니다.
5) 입 밖으로 내면 안 좋은 말: 아직 참여하지 않았습니다.
</FINAL_ARTIFACT>\`;

const result = parseAiResult(sample);
const { fields } = result;

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    console.error('❌ ' + label);
    console.error('Expected:', expected);
    console.error('Actual:  ', actual);
    process.exit(1);
  }
}

assertEqual(
  fields.finalLines[2],
  fields.twoWeekTask,
  '코칭 대화문 3번이 비어 있으면 이번 주에 맡겨볼 작은 일로 fallback되어야 합니다.',
);

assertEqual(
  fields.finalLines[3],
  fields.leaderSupport,
  '코칭 대화문 4번이 비어 있으면 김원중 과장이 옆에서 도와줄 일로 fallback되어야 합니다.',
);

assertEqual(
  fields.finalLines[4],
  fields.watchOut,
  '코칭 대화문 5번이 비어 있으면 말할 때 조심할 표현으로 fallback되어야 합니다.',
);

console.log('✅ AI 결과 파서 스모크 테스트 통과: 3번/4번/5번 fallback이 정상 작동합니다.');
`;

fs.writeFileSync(smokeMjs, testCode, 'utf8');
execFileSync(process.execPath, [smokeMjs], { stdio: 'inherit' });
