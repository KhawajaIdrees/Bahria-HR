import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Configure axios defaults — empty baseURL in dev so /api is served by Vite and proxied to the backend (vite.config.js)
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ?? '';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);