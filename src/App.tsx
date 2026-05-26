const setupItems = [
  'React + Vite + TypeScript 기본 세팅',
  '모바일·태블릿 우선 교육생 화면 구조',
  'PC 기반 강사용 대시보드 확장 준비',
  'Google Sheets 저장 연동 확장 준비',
  'AI 프롬프트 복사형 Lab 흐름 준비',
];

const rounds = [
  'R1. 계속 묻는 김민재 사원, 답보다 기준이 필요하다',
  'R2. 빠르게 한 이서연 주임, 기준은 어디서 빠졌을까',
  'R3. 정하늘 사원의 한마디, “저는 안 맞는 것 같습니다”',
  'R4. 최도윤 주임의 AI 초안, 빠르지만 그대로 쓸 수는 없다',
  'R5. 김민재 사원의 도전 요청, 어디까지 맡길 것인가',
  'Boss Round. 보고, 민원, AI 오류가 동시에 터졌을 때도 후배를 키울 수 있을까',
];

function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">한국공항공사 · 후배 육성 Lab</p>
        <h1>Bridge AI Leadership Journey v2.0</h1>
        <p className="hero-copy">
          과장급 중간관리자가 후배의 행동 패턴을 읽고, 육성 딜레마를 판단하며,
          AI를 활용해 2주 미니 육성 플랜과 현장 실행문을 완성하는 모바일 기반 시뮬레이션입니다.
        </p>
        <div className="status-card" aria-label="프로젝트 세팅 상태">
          <strong>PR #1 기본 프로젝트 세팅 진행 중</strong>
          <span>다음 단계: v2.0 데이터 타입과 라운드 데이터 구조 생성</span>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <h2>이번 세팅에 포함된 기준</h2>
          <ul>
            {setupItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>v2.0 라운드 초안</h2>
          <ol>
            {rounds.map((round) => (
              <li key={round}>{round}</li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}

export default App;
