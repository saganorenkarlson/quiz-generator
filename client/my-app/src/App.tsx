import React from 'react';
import './App.css';
import Dashboard from './views/Dashboard'
import Navbar from './components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Navbar/>
    <div className="app-wrapper">    
      <Dashboard/>
    </div>
    </ThemeProvider>
  );
}

export default App;
