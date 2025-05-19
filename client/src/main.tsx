import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import axios from 'axios';
import { AuthProvider } from './contexts/AuthContext';

axios.defaults.baseURL = 'http://localhost:5232';
axios.defaults.withCredentials = true; // for session/cookie handling

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
