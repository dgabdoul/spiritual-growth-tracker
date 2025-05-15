
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Vérification stricte de l'élément racine
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Élément racine non trouvé');

const root = createRoot(rootElement);

// Assurons-nous que l'App est bien encapsulée dans StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
