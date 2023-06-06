import React, {useState} from 'react'
import '../styles/dashboard.css'
import CourseList from '../components/CourseList';
import { DialogNewCourse } from '../components/DialogNewCourse';
import {Typography} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';


export default function Dashboard() {
  const theme = useTheme();
  const [openDialogNewCourse, setOpenDialogNewCourse] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpenDialogNewCourse(true);
  };

  const handleClose = () => {
    setOpenDialogNewCourse(false);
  };

  const addCourse = (courseName: string, courseMaterial: string, numberOfQuestions: number) => {
    console.log(courseName, courseMaterial, numberOfQuestions);
    handleClose();
  }

  const addCourseDialog = () => {
    return (
      <DialogNewCourse openDialog={openDialogNewCourse} handleClose={handleClose} handleSubmit={addCourse}></DialogNewCourse>
    )
  };


  return (
    <div className="dashboard" >  
      <div className='dashboard-upper-wrapper'>
        <Typography variant="h5" component="h1" sx={{color: theme.palette.text.primary}}  >
          Courses        
        </Typography>
        <IconButton onClick={handleClickOpen} size="large" sx={{color: theme.palette.text.secondary}}>
          <AddCircleIcon fontSize='large'></AddCircleIcon>
        </IconButton>
      </div>
      <CourseList></CourseList>
      {addCourseDialog()}
    </div>
  )
}
