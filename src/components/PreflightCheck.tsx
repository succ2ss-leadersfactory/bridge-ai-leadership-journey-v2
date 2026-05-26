import { useState } from 'react';
import { fetchDashboardDataV2, isGoogleSheetsConfigured, type DashboardLoadStatus } from '../lib/googleSheets';

type ItemStatus = 'ready' | 'warning' | 'pending';

interface CheckItem {
  label: string;
  status: ItemStatus;
  detail: string;
}

export function PreflightCheck() {
  const [dashboardStatus, setDashboardStatus] = useState<DashboardLoadStatus>('idle');
  const [dashboardMessage, setDashboardMessage] = useState('아직 조회 테스트를 실행하지 않았습니다.');
  const [counts, setCounts] = useState({ participants: 0, responses: 0 });

  const isConfigured = isGoogleSheetsConfigured();

  const items: CheckItem[] = [
    {
      label: 'Vercel 환경변수',
      status: isConfigured ? 'ready' : 'warning',
      detail: isConfigured
        ? 'Google Apps Script URL 환경변수가 설정되어 있습니다.'
        : 'Google Apps Script URL 환경변수를 확인해야 합니다.',
    },
    {
      label: '교육생 화면',
      status: 'ready',
      detail: '기본 접속 화면은 스마트폰 교육생 화면입니다.',
    },
    {
      label: '강사용 대시보드',
      status: 'ready',
      detail: 'view 값을 instructor로 설정하면 강사용 대시보드가 열립니다.',
    },
    {
      label: '데이터 조회',
      status: dashboardStatus === 'success' ? 'ready' : dashboardStatus === 'error' || dashboardStatus === 'notConfigured' ? 'warning' : 'pending',
      detail: dashboardMessage,
    },
  ];

  async function runDashboardCheck() {
    setDashboardStatus('loading');
    setDashboardMessage('Google Sheets 연결을 확인하는 중입니다.');
    const result = await fetchDashboardDataV2();
    setDashboardStatus(result.status);
    setDashboardMessage(result.message);
    setCounts({ participants: result.data.participants.length, responses: result.data.responses.length });
  }

  return (
    <main className="preflight-shell">
      <section className="preflight-hero">
        <p className="dashboard-eyebrow">Preflight Check · v2.0</p>
        <h1>운영 전 연결 점검</h1>
        <p>파일럿 시작 전 환경변수, 교육생 화면, 강사용 대시보드, Google Sheets 조회 상태를 빠르게 확인합니다.</p>
      </section>

      <section className="preflight-actions">
        <a href="/" className="preflight-link">교육생 화면 열기</a>
        <a href="/?view=instructor" className="preflight-link">강사용 대시보드 열기</a>
        <button type="button" className="preflight-button" onClick={runDashboardCheck} disabled={dashboardStatus === 'loading'}>
          {dashboardStatus === 'loading' ? '조회 중...' : '조회 테스트'}
        </button>
      </section>

      <section className="preflight-grid">
        {items.map((item) => (
          <article className={`preflight-card ${item.status}`} key={item.label}>
            <span>{item.status === 'ready' ? '정상' : item.status === 'warning' ? '확인 필요' : '대기'}</span>
            <h2>{item.label}</h2>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="preflight-summary">
        <h2>현재 조회된 데이터</h2>
        <div><strong>{counts.participants}</strong><span>참여자</span></div>
        <div><strong>{counts.responses}</strong><span>응답</span></div>
      </section>

      <section className="preflight-note">
        <h2>점검 통과 기준</h2>
        <ol>
          <li>환경변수 카드가 정상으로 표시됩니다.</li>
          <li>조회 테스트가 성공합니다.</li>
          <li>교육생 화면과 강사용 대시보드가 각각 열립니다.</li>
          <li>테스트 저장 후 참여자와 응답 수가 증가합니다.</li>
        </ol>
      </section>
    </main>
  );
}
