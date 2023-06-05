import React from 'react'
import '../styles/dashboard.css'
import CourseList from '../components/CourseList';
import {Typography} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';


export default function Dashboard() {
  const theme = useTheme();
  return (
    <div className="dashboard" >  
      <div className='dashboard-upper-wrapper'>
        <Typography variant="h5" component="h1" sx={{color: theme.palette.text.primary}}  >
          Courses        
        </Typography>
        <IconButton size="large" sx={{color: theme.palette.text.secondary}}>
          <AddCircleIcon fontSize='large'></AddCircleIcon>
        </IconButton>
      </div>
      <CourseList></CourseList>
    </div>
  )
}
