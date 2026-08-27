import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Schriften liegen im Bundle — keine Anfrage an Dritte, kein Flash of Unstyled Text.
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource-variable/inter-tight/wght.css';
import './index.css';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
