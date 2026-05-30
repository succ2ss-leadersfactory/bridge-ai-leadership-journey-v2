import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const targetDirs = [
  'src/data',
  'src/lib',
];

const fileExtensions = new Set(['.ts', '.tsx']);

const noBreakPatterns = [
  { label: '숫자 변경 여부', pattern: /숫자 변경(?:\\n|\n)여부/g },
  { label: '외부 공유 여부', pattern: /외부 공유(?:\\n|\n)여부/g },
  { label: '확정 여부', pattern: /확정(?:\\n|\n)여부/g },
  { label: '출처 확인', pattern: /출처(?:\\n|\n)확인/g },
  { label: '표현 수위', pattern: /표현(?:\\n|\n)수위/g },
  { label: '검증 기준', pattern: /검증(?:\\n|\n)기준/g },
  { label: '지원 범위', pattern: /지원(?:\\n|\n)범위/g },
  { label: '작은 역할', pattern: /작은(?:\\n|\n)역할/g },
  { label: '넘길 기준', pattern: /넘길(?:\\n|\n)기준/g },
  { label: '대체 경로 안내', pattern: /대체 경로(?:\\n|\n)안내/g },
  { label: '보고 후 리뷰', pattern: /보고 후(?:\\n|\n)리뷰/g },
  { label: '이번 주 행동', pattern: /이번 주(?:\\n|\n)행동/g },
  { label: '개입 범위', pattern: /개입(?:\\n|\n)범위/g },
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    if (!fileExtensions.has(path.extname(entry.name))) return [];
    return [fullPath];
  });
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split('\n').length;
}

const files = targetDirs.flatMap((dir) => walk(path.join(rootDir, dir)));
const findings = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const rule of noBreakPatterns) {
    const matches = content.matchAll(rule.pattern);
    for (const match of matches) {
      findings.push({
        file: path.relative(rootDir, file),
        line: lineNumberAt(content, match.index ?? 0),
        label: rule.label,
        match: match[0],
      });
    }
  }
}

if (findings.length === 0) {
  console.log('✅ 콘텐츠 줄바꿈 감사 통과: 붙어 읽어야 하는 표현의 부자연스러운 줄바꿈이 없습니다.');
  process.exit(0);
}

console.error('❌ 콘텐츠 줄바꿈 감사 실패: 부자연스러운 줄바꿈 후보가 있습니다.');
for (const finding of findings) {
  console.error(`- ${finding.file}:${finding.line} [${finding.label}] ${JSON.stringify(finding.match)}`);
}
console.error('\n수정 기준: docs/content-line-break-policy.md를 확인하세요.');
process.exit(1);
