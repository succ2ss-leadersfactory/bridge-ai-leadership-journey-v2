import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { installIPhoneSafariOptimizations } from './lib/iphoneSafari';
import './styles.css';
import './completedRounds.css';
import './developmentCards.css';
import './kacUiOverrides.css';
import './readabilityPolish.css';
import './iphoneSafari.css';

installIPhoneSafariOptimizations();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
