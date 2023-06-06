import React from 'react';
import './App.css';
import Dashboard from './views/Dashboard'
import Navbar from './components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  return (
    <ThemeProvider theme={theme}>
    <Navbar/>
    <div className="app-wrapper"> 
    {isLoading ? <div>loading</div> : isAuthenticated ? <Dashboard/> : <div>You need to login to use this website</div>}  
    </div>
    </ThemeProvider>
  );
}

export default App;
