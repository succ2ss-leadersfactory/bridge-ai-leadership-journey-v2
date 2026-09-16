import { V3LearnerShellRedTeam } from './components/V3LearnerShellRedTeam';
import { v3Cases } from './v3/cases';
import { applyGenericCaseOverrides } from './v3/genericCaseOverrides';

applyGenericCaseOverrides(v3Cases);

function App() {
  return <V3LearnerShellRedTeam />;
}

export default App;
