import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './redux/store'; 
import { Provider } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import reportWebVitals from './reportWebVitals';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

const Root = () => {
  const [theme, colorMode] = useMode(); // Use the custom hook to get theme and color mode

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* This will help with consistent baseline styling */}
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <Router>
      <Root />
    </Router>
  </Provider>
);

reportWebVitals(console.log);