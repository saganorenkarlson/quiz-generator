import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister();
  });
}

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN ?? ''}
      clientId={process.env.REACT_APP_AUTH0_CLIENTID ?? ''}
      authorizationParams={{
        redirect_uri: 'http://localhost:3003',
        audience: process.env.REACT_APP_AUTH0_AUDIENCE ?? '',
        scope: "openid profile email"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();
