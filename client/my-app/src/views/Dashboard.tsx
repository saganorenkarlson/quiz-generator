import { useState, useEffect } from 'react'
import '../styles/dashboard.css'
import { CourseList } from '../components/CourseList';
import { DialogNewCourse } from '../components/DialogNewCourse';
import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { ICourse, IQuizItem } from '../models/user';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

export const Dashboard = () => {

  const { getAccessTokenSilently, user } = useAuth0();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);

  const getToken = async () => {
    const token = await getAccessTokenSilently();
    return token;
  }

  useEffect(() => {

    const getToken = async () => {
      const token = await getAccessTokenSilently();
      return token;
    }

    const signUp = async () => {
      const token = await getToken();
      const createUserOptions = {
        method: 'POST',
        url: 'http://localhost:8000/api/users',
        headers: { authorization: `Bearer ${token}` },
      };
      axios
        .request(createUserOptions)
        .then(function (createUserResponse) {
        })
        .catch(function (error) {
          console.error(error);
        });

    }

    if (user) {
      signUp();
    }

  }, [user]);

  useEffect(() => {
    const fetchResult = async () => {
      const token = await getToken();
      var options = {
        method: 'GET',
        url: 'http://localhost:8000/api/users',
        headers: { authorization: `Bearer ${token}` },
        params: { userId: user?.sub }
      };

      axios.request(options).then(function (response) {
        setCourses(response.data.courses ? response.data.courses : []);
        setLoadingCourses(false);
      }).catch(function (error) {
        console.error(error);
      });
    }

    if (user) {
      console.log("in user")
      fetchResult();
    }

  }, [user, getAccessTokenSilently])

  const theme = useTheme();
  const [openDialogNewCourse, setOpenDialogNewCourse] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpenDialogNewCourse(true);
  };

  const handleClose = () => {
    setOpenDialogNewCourse(false);
  };

  const addCourse = async (courseName: string, courseMaterial: string, numberOfQuestions: number) => {
    const token = await getToken();
    const course = { name: courseName, quiz: [] };

    var options = {
      method: 'POST',
      url: `http://localhost:8000/api/courses`,
      headers: { authorization: `Bearer ${token}` },
      data: course,
    };

    axios.request(options).then(function (response) {
      const newCourse = response.data;
      setCourses(prevCourses => [...prevCourses, newCourse]);

    }).catch(function (error) {
      console.error(error.response.data);
    });

    handleClose();
  }


  const generateQuestions = async (course: ICourse | null, courseMaterial: string, numberOfQuestions: number) => {
    const token = await getToken();
    if (!course) return;

    const quizItems = [
      {
        question: "What is the capital of Sweden?",
        answer: "Stockholm"
      },
      {
        question: "What is the capital of Sweden?",
        answer: "Stockholm"
      },
      {
        question: "What is the capital of Sweden?",
        answer: "Stockholm"
      }
    ]

    var options = {
      method: 'PUT',
      url: `http://localhost:8000/api/courses/${course._id}`,
      headers: { authorization: `Bearer ${token}` },
      data: quizItems,
    };

    axios.request(options).then(function (response) {
      const updatedCourse = response.data;
      setCourses(prevCourses => prevCourses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
    }).catch(function (error) {
      console.error(error.response.data);
    });

  }

  const editQuestion = async (quizItem: IQuizItem, courseId: string, question: string, answer: string) => {
    const token = await getToken();
    const newQuizItem = { question, answer };

    var options = {
      method: 'PUT',
      url: `http://localhost:8000/api/courses/${courseId}/${quizItem._id}`,
      headers: { authorization: `Bearer ${token}` },
      data: newQuizItem,
    };

    axios.request(options).then(function (response) {
      const updatedCourse = response.data;
      setCourses(prevCourses => prevCourses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
    }).catch(function (error) {
      console.error(error.response.data);
    });

  }

  const deleteQuestion = async (quizItem: IQuizItem, courseId: string) => {
    const token = await getToken();

    var options = {
      method: 'DELETE',
      url: `http://localhost:8000/api/courses/${courseId}/${quizItem._id}`,
      headers: { authorization: `Bearer ${token}` },
    };

    axios.request(options).then(function (response) {
      const updatedCourse = response.data;
      setCourses(prevCourses => prevCourses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
    }).catch(function (error) {
      console.error(error.response.data);
    });
  }

  return (
    <div className="dashboard">
      {loadingCourses ? (
        <>
          <div className="loading-skeleton">
            <Skeleton height={50} width={300} />
            <Skeleton className="add-course-loading-skeleton" circle={true} height={35} width={35} />
          </div>
          <Skeleton className="course-loading-skeleton" count={4} height={72} />
        </>
      ) : (
        <>
          <div className='dashboard-upper-wrapper'>
            <Typography variant="h5" component="h1" sx={{ color: theme.palette.text.primary }}>
              Courses
            </Typography>
            <IconButton onClick={handleClickOpen} size="large" sx={{ color: theme.palette.text.secondary }}>
              <AddCircleIcon fontSize='large'></AddCircleIcon>
            </IconButton>
          </div>
          <div>
            <CourseList
              generateQuestions={generateQuestions}
              editQuestion={editQuestion}
              deleteQuestion={deleteQuestion}
              courses={courses}
            />
            <DialogNewCourse
              openDialog={openDialogNewCourse}
              handleClose={handleClose}
              handleSubmit={addCourse}
            />
          </div>
        </>
      )}
    </div>
  )

}
