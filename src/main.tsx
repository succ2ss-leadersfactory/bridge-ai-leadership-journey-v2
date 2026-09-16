import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './v3/v3.css';
import './v3/v3RedTeam.css';
import './v4/v4Action.css';
import './v4/v4InstructorPc.css';
import './v4/v4InstructorDiscussionReveal.css';
import './v4/instructorDiscussionReveal';
import './v4/commonUiPolish';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
