import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './redux/store'; 
import { Provider } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './context/ThemeContext'; // Adjust the path as necessary

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <Router>
      <ThemeProvider> {/* Wrap App with ThemeProvider */}
        <App />
      </ThemeProvider>
    </Router>
  </Provider>
);

reportWebVitals(console.log);