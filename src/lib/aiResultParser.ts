export function extractBlock(text: string, tag: string) {
  const pattern = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

export function parseAiResult(text: string) {
  const finalArtifact = extractBlock(text, 'FINAL_ARTIFACT');
  const reviewNotes = extractBlock(text, 'REVIEW_NOTES');

  return {
    finalArtifact,
    reviewNotes,
    hasStructuredResult: Boolean(finalArtifact || reviewNotes),
  };
}
