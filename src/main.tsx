import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './completedRounds.css';
import './developmentCards.css';
import './kacUiOverrides.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
