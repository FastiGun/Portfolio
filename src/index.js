import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import AuthProvider from './Utils/AuthContext';
import { ToastProvider } from './Utils/ToastContext';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode >
);

