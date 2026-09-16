import { V4ActionSimulationShell } from './components/V4ActionSimulationShell';
import { v3Cases } from './v3/cases';
import { applyGenericCaseOverrides } from './v3/genericCaseOverrides';
import { applyHonorificTerminology } from './v3/honorificTerminology';
import { applyTheoryTerminology } from './v3/theoryTerminology';
import { applyActionSimulationOverrides } from './v4/actionSimulationConfig';

applyGenericCaseOverrides(v3Cases);
applyTheoryTerminology(v3Cases);
applyHonorificTerminology(v3Cases);
applyActionSimulationOverrides(v3Cases);

function App() {
  return <V4ActionSimulationShell />;
}

export default App;
