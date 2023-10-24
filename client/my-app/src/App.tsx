import React from 'react';
import './App.css';
import { Dashboard } from './views/Dashboard'
import Navbar from './components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import { SearchPage } from './views/SearchPage';
import { StartPage } from './views/StartPage';

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar loading={isLoading} />
        <Routes>
          <Route path="/search" element={<div className='app-wrapper'><SearchPage /></div>} />
          <Route path="/" element={<div className="app-wrapper">
            {isAuthenticated || isLoading ? <Dashboard /> : <StartPage/>}
          </div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;
