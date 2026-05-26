import { InstructorDashboard } from './components/InstructorDashboard';
import { LearnerShell } from './components/LearnerShell';

function App() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');

  if (view === 'instructor') {
    return <InstructorDashboard />;
  }

  return <LearnerShell />;
}

export default App;
