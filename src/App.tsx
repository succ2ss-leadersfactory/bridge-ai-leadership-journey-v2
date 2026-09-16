import { V3LearnerShellRedTeam } from './components/V3LearnerShellRedTeam';
import { v3Cases } from './v3/cases';
import { applyGenericCaseOverrides } from './v3/genericCaseOverrides';
import { applyHonorificTerminology } from './v3/honorificTerminology';
import { applyTheoryTerminology } from './v3/theoryTerminology';

applyGenericCaseOverrides(v3Cases);
applyTheoryTerminology(v3Cases);
applyHonorificTerminology(v3Cases);

function App() {
  return <V3LearnerShellRedTeam />;
}

export default App;
