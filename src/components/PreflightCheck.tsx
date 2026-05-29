import { useState } from 'react';
import {
  fetchDashboardDataV2,
  isGoogleSheetsConfigured,
  setupSheetsV2,
  type DashboardLoadStatus,
  type SetupSheetsDataV2,
  type SetupCheckStatus,
} from '../lib/googleSheets';

type ItemStatus = 'ready' | 'warning' | 'pending';

interface CheckItem {
  label: string;
  status: ItemStatus;
  detail: string;
}

function mapCheckStatus(status: DashboardLoadStatus | SetupCheckStatus): ItemStatus {
  if (status === 'success') return 'ready';
  if (status === 'error' || status === 'notConfigured') return 'warning';
  return 'pending';
}

export function PreflightCheck() {
  const [dashboardStatus, setDashboardStatus] = useState<DashboardLoadStatus>('idle');
  const [dashboardMessage, setDashboardMessage] = useState('아직 조회 테스트를 실행하지 않았습니다.');
  const [setupStatus, setSetupStatus] = useState<SetupCheckStatus>('idle');
  const [setupMessage, setSetupMessage] = useState('아직 시트와 헤더 점검을 실행하지 않았습니다.');
  const [setupData, setSetupData] = useState<SetupSheetsDataV2>({});
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
      label: '시트와 헤더',
      status: mapCheckStatus(setupStatus),
      detail: setupMessage,
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
      status: mapCheckStatus(dashboardStatus),
      detail: dashboardMessage,
    },
  ];

  async function runSetupCheck() {
    setSetupStatus('loading');
    setSetupMessage('Google Sheets 시트와 헤더를 점검하는 중입니다.');
    const result = await setupSheetsV2();
    setSetupStatus(result.status);
    setSetupMessage(result.message);
    setSetupData(result.data);
  }

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
        <p>파일럿 시작 전 환경변수, 시트 헤더, 교육생 화면, 강사용 대시보드, Google Sheets 조회 상태를 빠르게 확인합니다.</p>
      </section>

      <section className="preflight-actions">
        <a href="/" className="preflight-link">교육생 화면 열기</a>
        <a href="/?view=instructor" className="preflight-link">강사용 대시보드 열기</a>
        <button type="button" className="preflight-button" onClick={runSetupCheck} disabled={setupStatus === 'loading'}>
          {setupStatus === 'loading' ? '시트 점검 중...' : '시트/헤더 점검'}
        </button>
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

      {setupData.sheets?.length ? (
        <section className="preflight-summary wide">
          <h2>시트/헤더 점검 결과</h2>
          {setupData.spreadsheetName ? <p><strong>스프레드시트</strong><br />{setupData.spreadsheetName}</p> : null}
          {setupData.sheets.map((sheet) => (
            <div key={sheet.name}>
              <strong>{sheet.name}</strong>
              <span>{sheet.columns.length}개 컬럼 확인</span>
            </div>
          ))}
        </section>
      ) : null}

      <section className="preflight-summary">
        <h2>현재 조회된 데이터</h2>
        <div><strong>{counts.participants}</strong><span>참여자</span></div>
        <div><strong>{counts.responses}</strong><span>응답</span></div>
      </section>

      <section className="preflight-note">
        <h2>점검 통과 기준</h2>
        <ol>
          <li>환경변수 카드가 정상으로 표시됩니다.</li>
          <li>시트/헤더 점검이 성공하고 Participants, Responses 시트가 확인됩니다.</li>
          <li>조회 테스트가 성공합니다.</li>
          <li>교육생 화면과 강사용 대시보드가 각각 열립니다.</li>
          <li>테스트 저장 후 참여자와 응답 수가 증가합니다.</li>
        </ol>
      </section>
    </main>
  );
}
