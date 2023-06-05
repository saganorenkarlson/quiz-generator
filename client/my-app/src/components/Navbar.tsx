import React, {useState} from 'react'
import { AppBar, Toolbar,Typography,Button, IconButton, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useTheme } from '@mui/material/styles';
import '../styles/navbar.css'

function Navbar() {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <AppBar position="static" sx={{ backgroundColor: '#F8F9FB' }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 , color: theme.palette.text.primary}}>
            Quiz-generator
          </Typography>
          <IconButton  onClick={handleClickOpen} size="large" aria-label="website description">
            <InfoIcon sx={{color: theme.palette.secondary.main}}/>
          </IconButton>
          <Button size="large" color="inherit" sx={{color: theme.palette.text.primary}}>Login</Button>
        </Toolbar>
      </AppBar>  
      
    <Dialog open={open} onClose={handleClose}>
      <div className='information-dialog'>
        <div className="information-dialog-title">
          Website information
          <InfoIcon sx={{marginLeft: "0.7rem", marginTop:"0.2rem", color: theme.palette.primary.main}}/>
        </div>
        <p className="information-dialog-text">This website is your automatic quiz generator. Enter course material and let the website give you a quiz to practice on. 
        Easily browse your saved courses and edit the quizzes according to your liking. <br></br> <br></br>
        Quiz generator uses OpenAI.
        </p>
      </div>
    </Dialog>
    </>
      )
}

export default Navbar