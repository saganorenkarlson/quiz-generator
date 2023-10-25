import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton, Dialog, InputAdornment, TextField } from '@mui/material';
import Search from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import { useTheme } from '@mui/material/styles';
import '../styles/navbar.css'
import { useAuth0 } from "@auth0/auth0-react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate, useLocation } from 'react-router-dom';

interface INavbar {
  loading: boolean
}

export const Navbar: React.FC<INavbar> = ({ loading }) => {
  const theme = useTheme();
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/search?query=${query}&page=1&filter=course`);
  }

  const handleAuthentication = async () => {
    if (isAuthenticated) {
      logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      loginWithRedirect();
    }
  }

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const informationDialog = () => {
    return (
      <Dialog open={openDialog} onClose={handleClose}>
        <div className='information-dialog'>
          <div className="information-dialog-title">
            Website information
            <InfoIcon sx={{ marginLeft: "0.7rem", marginTop: "0.2rem", color: theme.palette.primary.main }} />
          </div>
          <p className="information-dialog-text">This website is your automatic quiz generator. Enter course material and let the website give you a quiz to practice on.
            Easily browse your saved courses and edit the quizzes according to your liking. <br></br> <br></br>
            Quiz generator uses OpenAI.
          </p>
        </div>
      </Dialog>)
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#F8F9FB' }}>
        <Toolbar>
          <Typography onClick={() => navigate('/')} variant="h5" component="div" sx={{ flexGrow: 1, color: theme.palette.text.primary, cursor: 'pointer' }}>
            <span className="navbar-title-full">Quiz-generator</span>
            <span className="navbar-title-short">Q</span>
          </Typography>
          {loading ? <>
            {isAuthenticated && location.pathname !== '/search' && <Skeleton className="navbar-loading-skeleton" height={40} width={250} />}
            <Skeleton className="navbar-loading-skeleton" circle={true} height={22} width={22} />
            <Skeleton className="navbar-loading-skeleton" height={26} width={65} />
          </>
            : <>

              {isAuthenticated && location.pathname !== '/search' && <form onSubmit={handleSearch}>
                <TextField
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setQuery(event.target.value);
                  }}
                  placeholder="Search course or user"
                  size='small'
                  sx={{ marginRight: "12px" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </form>}
              <IconButton onClick={handleClickOpen} size="large" aria-label="website description">
                <InfoIcon sx={{ color: theme.palette.secondary.main }} />
              </IconButton>
              <Button onClick={handleAuthentication} size="large" color="inherit" sx={{ color: theme.palette.text.primary }}>{isAuthenticated ? "Logout" : "Login"}</Button>
            </>}
        </Toolbar>
      </AppBar >
      {informationDialog()}
    </>
  )
}

export default Navbar