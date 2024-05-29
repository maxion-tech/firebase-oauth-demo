import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  // Mainnet,
  DAppProvider,
  // useEtherBalance,
  // useEthers,
  // Config,
  // Goerli,
  BSCTestnet,
} from '@usedapp/core';

const root = ReactDOM.createRoot(document.getElementById('root'));

const config = {
  readOnlyChainId: BSCTestnet.chainId,
};

root.render(
  <StrictMode>
    <DAppProvider config={config}>
      <header>
        <title>Ragnarok Landverse Authentication | Maxion</title>
        <link
          href="/icons/favicon.ico"
          rel="icon"
          media="(prefers-color-scheme: light)"
        />
        <link href="/icons/favicon.ico" rel="icon" media="(prefers-color-scheme: dark)" />
        <meta name="description" content="Maxion Tech" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </header>
      <App />
    </DAppProvider>
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
