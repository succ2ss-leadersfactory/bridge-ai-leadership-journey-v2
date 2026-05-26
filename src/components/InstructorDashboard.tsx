import { useMemo, useState } from 'react';
import { rounds } from '../data/rounds';
import {
  fetchDashboardDataV2,
  type DashboardDataV2,
  type DashboardLoadStatus,
  type DashboardResponseRow,
} from '../lib/googleSheets';

function getRoundTitle(roundId: string) {
  return rounds.find((round) => round.id === roundId)?.title ?? (roundId || '라운드 미입력');
}

function isCompleted(response: DashboardResponseRow) {
  return String(response.is_completed).toLowerCase() === 'true';
}

function groupByTeam(responses: DashboardResponseRow[]) {
  return responses.reduce<Record<string, DashboardResponseRow[]>>((acc, response) => {
    const teamName = response.team_name || '팀 미입력';
    acc[teamName] = acc[teamName] ?? [];
    acc[teamName].push(response);
    return acc;
  }, {});
}

function countByRound(responses: DashboardResponseRow[]) {
  return responses.reduce<Record<string, number>>((acc, response) => {
    const title = getRoundTitle(response.round_id);
    acc[title] = (acc[title] ?? 0) + 1;
    return acc;
  }, {});
}

export function InstructorDashboard() {
  const [status, setStatus] = useState<DashboardLoadStatus>('idle');
  const [message, setMessage] = useState('아직 데이터를 불러오지 않았습니다.');
  const [data, setData] = useState<DashboardDataV2>({ participants: [], responses: [] });

  const completedResponses = useMemo(() => data.responses.filter(isCompleted), [data.responses]);
  const teamGroups = useMemo(() => groupByTeam(data.responses), [data.responses]);
  const roundCounts = useMemo(() => countByRound(data.responses), [data.responses]);
  const recentResponses = useMemo(
    () => [...data.responses].sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at))).slice(0, 12),
    [data.responses],
  );

  async function loadDashboard() {
    setStatus('loading');
    setMessage('Google Sheets에서 데이터를 불러오는 중입니다.');
    const result = await fetchDashboardDataV2();
    setStatus(result.status);
    setMessage(result.message);
    setData(result.data);
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Instructor Dashboard · v2.0</p>
          <h1>Bridge AI Leadership Journey 운영 대시보드</h1>
          <p>
            교육생의 라운드 진행 결과, 팀별 저장 현황, 육성 방향과 5줄 실행문을 강의 운영용으로 확인합니다.
          </p>
        </div>
        <button type="button" className="dashboard-refresh" onClick={loadDashboard} disabled={status === 'loading'}>
          {status === 'loading' ? '불러오는 중...' : '데이터 새로고침'}
        </button>
      </header>

      <section className={`dashboard-message ${status}`}>
        {message}
        {data.loaded_at ? <span> · {new Date(data.loaded_at).toLocaleString('ko-KR')}</span> : null}
      </section>

      <section className="dashboard-stats">
        <article>
          <strong>{data.participants.length}</strong>
          <span>참여자</span>
        </article>
        <article>
          <strong>{data.responses.length}</strong>
          <span>전체 응답</span>
        </article>
        <article>
          <strong>{completedResponses.length}</strong>
          <span>완료 응답</span>
        </article>
        <article>
          <strong>{Object.keys(teamGroups).length}</strong>
          <span>참여 팀</span>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <h2>팀별 진행 현황</h2>
          <div className="dashboard-list">
            {Object.entries(teamGroups).length === 0 ? <p className="empty-text">아직 저장된 응답이 없습니다.</p> : null}
            {Object.entries(teamGroups).map(([teamName, responses]) => (
              <div className="team-row" key={teamName}>
                <strong>{teamName}</strong>
                <span>{responses.length}건 · 완료 {responses.filter(isCompleted).length}건</span>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card">
          <h2>라운드별 응답 분포</h2>
          <div className="dashboard-list">
            {Object.entries(roundCounts).length === 0 ? <p className="empty-text">아직 저장된 응답이 없습니다.</p> : null}
            {Object.entries(roundCounts).map(([roundTitle, count]) => (
              <div className="round-row" key={roundTitle}>
                <span>{roundTitle}</span>
                <strong>{count}건</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-card full-width">
        <h2>최근 저장 응답</h2>
        <div className="response-table">
          <div className="response-table-head">
            <span>팀/닉네임</span>
            <span>라운드</span>
            <span>육성 방향</span>
            <span>상태</span>
          </div>
          {recentResponses.length === 0 ? <p className="empty-text">아직 저장된 응답이 없습니다.</p> : null}
          {recentResponses.map((response) => (
            <details className="response-row" key={response.response_id}>
              <summary>
                <span>{response.team_name || '-'} / {response.nickname || '-'}</span>
                <span>{getRoundTitle(response.round_id)}</span>
                <span>{response.development_direction || '-'}</span>
                <strong>{isCompleted(response) ? '완료' : '진행 중'}</strong>
              </summary>
              <div className="response-detail">
                <p><strong>후배 행동 읽기</strong><br />{response.junior_reading || '-'}</p>
                <p><strong>육성 딜레마</strong><br />{response.development_dilemma || '-'}</p>
                <p><strong>2주 미니 육성 플랜</strong><br />성장 목표: {response.growth_goal || '-'}<br />작은 과제: {response.two_week_task || '-'}<br />과장 지원: {response.leader_support || '-'}<br />점검 시점: {response.check_timing || '-'}<br />주의점: {response.watch_out || '-'}</p>
                <p><strong>5줄 현장 실행문</strong></p>
                <ol>
                  {[response.final_line_1, response.final_line_2, response.final_line_3, response.final_line_4, response.final_line_5].map((line, index) => (
                    <li key={`${response.response_id}-${index}`}>{line || '-'}</li>
                  ))}
                </ol>
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
