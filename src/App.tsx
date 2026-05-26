import { flowSteps } from './data/flowSteps';
import { rounds } from './data/rounds';

const setupItems = [
  'React + Vite + TypeScript 기본 세팅 완료',
  'v2.0 라운드 데이터 구조 연결',
  '모바일·태블릿 우선 교육생 화면 구조',
  'PC 기반 강사용 대시보드 확장 준비',
  'Google Sheets 저장 컬럼 매핑 준비',
  'AI 프롬프트 복사형 Lab 흐름 준비',
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
          <strong>PR #2 데이터 구조 세팅 진행 중</strong>
          <span>{rounds.length}개 라운드 · {flowSteps.length}개 학습 단계 연결</span>
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
          <h2>v2.0 라운드 데이터</h2>
          <ol>
            {rounds.map((round) => (
              <li key={round.id}>
                <strong>{round.title}</strong>
                <span className="round-meta">
                  {round.juniorName} {round.juniorRole} · {round.developmentTask}
                </span>
              </li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}

export default App;
