import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Optional, for global styles (you can skip it for now if not needed)
import App from './App';  // Import the App component
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Ensure the 'root' div exists in your public/index.html
);

reportWebVitals();
