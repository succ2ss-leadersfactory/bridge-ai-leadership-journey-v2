import { V4ActionSimulationShell } from './components/V4ActionSimulationShell';
import { V4InstructorPcShell } from './components/V4InstructorPcShell';
import { v3Cases } from './v3/cases';
import { applyGenericCaseOverrides } from './v3/genericCaseOverrides';
import { applyHonorificTerminology } from './v3/honorificTerminology';
import { applyTheoryTerminology } from './v3/theoryTerminology';
import { applyActionSimulationOverrides } from './v4/actionSimulationConfig';

applyGenericCaseOverrides(v3Cases);
applyTheoryTerminology(v3Cases);
applyHonorificTerminology(v3Cases);
applyActionSimulationOverrides(v3Cases);

function isInstructorMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('mode') === 'instructor' || document.documentElement.dataset.appMode === 'instructor';
}

function App() {
  return isInstructorMode() ? <V4InstructorPcShell /> : <V4ActionSimulationShell />;
}

export default App;
