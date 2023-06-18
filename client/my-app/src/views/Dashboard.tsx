import React, {useState, useEffect} from 'react'
import '../styles/dashboard.css'
import {CourseList} from '../components/CourseList';
import { DialogNewCourse } from '../components/DialogNewCourse';
import {Typography} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from  "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { ICourse, IQuizItem } from '../models/user';

export default function Dashboard() {

  const { getAccessTokenSilently, user } = useAuth0();
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(()=>{

    const getToken = async () => {
      const token  = await getAccessTokenSilently();
      return token;
    }

     const fetchResult = async () => {
      const token = await getToken();
      var options = {
        method: 'GET',
        url: 'http://localhost:8000/api/users',
        headers: {authorization: `Bearer ${token}`},
        params: { userId: user?.sub } 
      };
      
      axios.request(options).then(function (response) {
        setCourses(response.data.courses);
      }).catch(function (error) {
        console.error(error);
      });
    }
  
    if(user) {
      fetchResult();
    }

  },[user, getAccessTokenSilently])

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
      <CourseList courses={courses}></CourseList>
      {addCourseDialog()}
    </div>
  )
}
