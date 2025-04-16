
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Create a strict 'rootElement' check
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

// Make sure to wrap the App component with StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
