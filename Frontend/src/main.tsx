import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from './App';
import './index.css';
import { TON_CONFIG } from './config/ton.config';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl={TON_CONFIG.manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </StrictMode>
);
