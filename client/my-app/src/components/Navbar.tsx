import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, IconButton, Dialog, InputAdornment, TextField } from '@mui/material';
import Search from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import ListIcon from '@mui/icons-material/List';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout'
import { useTheme } from '@mui/material/styles';
import '../styles/navbar.css'
import { useAuth0 } from "@auth0/auth0-react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as Logo } from "../assets/qlogo.svg";

interface INavbar {
  loading: boolean
}

export const Navbar: React.FC<INavbar> = ({ loading }) => {
  const theme = useTheme();
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const [openInfoDialog, setOpenInfoDialog] = useState<boolean>(false);
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [width, setWidth] = useState<number>(window.innerWidth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenSearchDialog(false);
    navigate(`/search?query=${query}&page=1&filter=quiz`);
  }

  const handleAuthentication = async () => {
    if (isAuthenticated) {
      logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      loginWithRedirect();
    }
  }

  const handleClickOpen = () => {
    setOpenInfoDialog(true);
  };

  const handleClose = () => {
    setOpenInfoDialog(false);
  };

  const informationDialog = () => {
    return (
      <Dialog open={openInfoDialog} onClose={handleClose}>
        <div className='information-dialog'>
          <div className="information-dialog-title">
            Website information
            <InfoIcon sx={{ marginLeft: "0.7rem", marginTop: "0.2rem", color: theme.palette.primary.main }} />
          </div>
          <div className='information-dialog-text'>
            <h3>Welcome to Quiz Generator!</h3>
            <p>
              This intuitive platform transforms your course material into interactive quizzes, making studying both efficient and engaging. Here's what you can do:
            </p>
            <ul>
              <li>
                <b>Create Custom Quizzes:</b> Simply input your study material, and let our AI-powered system generate tailored quizzes for you.
              </li>
              <li>
                <b>Edit and Organize:</b> Have full control over your quizzes. Edit them to fit your learning needs.
              </li>
              <li>
                <b>Share and Collaborate:</b> Take your learning experience further by sharing your quizzes with friends or classmates. It's a great way to test each other's knowledge and enhance understanding.
              </li>
              <li>
                <b>Discover New Content:</b> Delve into quizzes created by other users. This feature not only broadens your knowledge but also introduces you to different perspectives and topics.
              </li>
              <li>
                <b>Powered by OpenAI:</b> This system uses the latest in AI technology from OpenAI, ensuring a dynamic and responsive quiz-making experience.
              </li>
            </ul>
          </div>
          {/* <p className="information-dialog-text">



          </p> */}
        </div>
      </Dialog>)
  };


  const searchDialog = () => {
    return (
      <Dialog className="information-dialog-wrapper" open={openSearchDialog} onClose={() => setOpenSearchDialog(false)}>
        <div className='information-dialog'>
          <form id="search-dialog"onSubmit={handleSearch}>
            <TextField
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value)
              }}
              placeholder="Search quiz or user"
              size='small'
              type='text'
              inputProps={{
                'aria-label': 'Search quiz or user'
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </div>
      </Dialog>)
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#F8F9FB' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="navbar-title" onClick={() => navigate('/')}>
            <Logo />
          </div>
          {loading ? <div className="navbar-options-wrapper">
            {isAuthenticated && location.pathname !== '/search' && <Skeleton className="navbar-loading-skeleton" height={40} width={isMobile ? 45 : 250} />}
            <Skeleton className="navbar-loading-skeleton" height={40} width={154} />
            <Skeleton className="navbar-loading-skeleton" height={40} width={isMobile ? 45 : 94} />
            <Skeleton className="navbar-loading-skeleton" height={40} width={isMobile ? 45 : 124} />
          </div>
            : <>
              <div className="navbar-options-wrapper">
                {isAuthenticated && location.pathname !== '/search' ? (isMobile ?
                  <IconButton sx={{ backgroundColor: 'none', borderRadius: '4px', border: 'solid #e1e4e9 1px', height: '40px', padding: '10px' }} onClick={() => setOpenSearchDialog(true)} size="large" aria-label="Search quizzes or users">
                    <Search fontSize='small' />
                  </IconButton> : <form id="search-nabvar" onSubmit={handleSearch}>
                    <TextField
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setQuery(event.target.value)
                      }}
                      placeholder="Search quiz or user"
                      size='small'
                      type='text'
                      inputProps={{
                        'aria-label': 'Search quiz or user'
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </form>) : null}
                {isAuthenticated ? <IconButton sx={{ backgroundColor: 'none', borderRadius: '4px', border: 'solid #e1e4e9 1px', height: '40px' }} onClick={() => navigate('/')} size="large" aria-label="website description">
                  <ListIcon fontSize='small' />
                  <span className={"navbar-option-text"}>MY QUIZZES</span>
                </IconButton> : null}
                <IconButton sx={{ backgroundColor: 'none', borderRadius: '4px', border: 'solid #e1e4e9 1px', height: '40px' }} onClick={handleClickOpen} size="large" aria-label="website description">
                  <InfoIcon fontSize='small' sx={{ color: theme.palette.secondary.main }} />
                  <span className="navbar-option-text hidden">INFO</span>
                </IconButton>
                <IconButton sx={{ backgroundColor: 'none', borderRadius: '4px', border: 'solid #e1e4e9 1px', height: '40px' }} onClick={handleAuthentication} size="large" aria-label="website description">
                  {isAuthenticated ?
                    <>
                      <LogoutIcon fontSize='small' />
                      <span className="navbar-option-text hidden">LOGOUT</span>
                    </> :
                    <>
                      <LoginIcon fontSize='small' />
                      <span className="navbar-option-text hidden">LOGIN</span>
                    </>}
                </IconButton>
              </div>
            </>}
        </Toolbar>
      </AppBar >
      {informationDialog()}
      {searchDialog()}
    </>
  )
}

export default Navbar