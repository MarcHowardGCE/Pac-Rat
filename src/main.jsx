/**
 * Main Entry Point
 * 
 * This is the entry point for the React application.
 * It renders the App component into the root DOM element.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
