import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from '@/app/providers';
import '@/app/styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element with id 'root'");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>
);