import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'
import App from './pages/Home';
import { QueryClientProvider } from '@tanstack/react-query';
import { queyClient } from './lib/reac-query';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queyClient}>
      <App />
      </QueryClientProvider>
    
  </React.StrictMode>
);
