import { InstructorDashboard } from './components/InstructorDashboard';
import { LearnerShell } from './components/LearnerShell';
import { PreflightCheck } from './components/PreflightCheck';

function App() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');

  if (view === 'instructor') {
    return <InstructorDashboard />;
  }

  if (view === 'check') {
    return <PreflightCheck />;
  }

  return <LearnerShell />;
}

export default App;
