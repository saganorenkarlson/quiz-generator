import { useState, useEffect, useCallback } from 'react'
import '../styles/dashboard.css'
import { CourseList } from '../components/CourseList';
import { DialogNewCourse } from '../components/DialogNewCourse';
import { IconButton, Backdrop, CircularProgress, Typography, useTheme, Snackbar, Alert } from '@mui/material';
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
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [userId, setUserId] = useState<string>('');

  const getToken = useCallback(async () => {
    const token = await getAccessTokenSilently();
    return token;
  }, [getAccessTokenSilently]);

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
        setUserId(response.data._id);
      }).catch(function (error) {
        console.error(error);
      });
    }

    if (user) {
      fetchResult();
    }

  }, [user, getToken]);

  const theme = useTheme();
  const [openDialogNewCourse, setOpenDialogNewCourse] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpenDialogNewCourse(true);
  };

  const handleClose = () => {
    setOpenDialogNewCourse(false);
  };

  const addCourse = async (courseName: string, courseMaterial: string, numberOfQuestions: number) => {
    setGeneratingQuestions(true);
    const token = await getToken();
    const data = { name: courseName, courseMaterial: courseMaterial, numberOfQuestions: numberOfQuestions, userName: user?.nickname };

    var options = {
      method: 'POST',
      url: `http://localhost:8000/api/courses`,
      headers: { authorization: `Bearer ${token}` },
      data: data,
    };

    axios.request(options).then(function (response) {
      const newCourse = response.data;
      setCourses(prevCourses => [...prevCourses, newCourse]);
      setGeneratingQuestions(false);
      setSnackbarInfo({ message: "Course added successfully", type: 'success' });
    }).catch(function (error) {
      setGeneratingQuestions(false);
      setSnackbarInfo({ message: 'Error adding course!', type: 'error' });
    });

    handleClose();
  }


  const generateQuestions = async (course: ICourse | null, courseMaterial: string, numberOfQuestions: number) => {
    setGeneratingQuestions(true);

    const token = await getToken();
    if (!course) return;
    const data = { courseMaterial: courseMaterial, numberOfQuestions: numberOfQuestions };

    var options = {
      method: 'PUT',
      url: `http://localhost:8000/api/courses/${course._id}`,
      headers: { authorization: `Bearer ${token}` },
      data: data,
    };

    axios.request(options).then(function (response) {
      const updatedCourse = response.data;
      setCourses(prevCourses => prevCourses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
      setGeneratingQuestions(false);
      setSnackbarInfo({ message: "Questions generated successfully", type: 'success' });
    }).catch(function (error) {
      setGeneratingQuestions(false);
      setSnackbarInfo({ message: 'Error generating questions!', type: 'error' });
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
      setSnackbarInfo({ message: 'Error editing questions!', type: 'error' });
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
      setSnackbarInfo({ message: 'Error deleting question!', type: 'error' });
    });
  }

  const updatePublicValue = async (newPublicValue: boolean, courseId: string) => {
    const token = await getToken();
    var options = {
      method: 'PUT',
      url: `http://localhost:8000/api/courses/${courseId}/public`,
      headers: { authorization: `Bearer ${token}` },
      data: { isPublic: newPublicValue },
    };

    axios.request(options).then(function (response) {
      const updatedCourse = response.data;
      setCourses(prevCourses => prevCourses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
    }).catch(function (error) {
      setSnackbarInfo({ message: 'Error editing questions!', type: 'error' });
    });
  }

  const deleteCourse = async (courseId: string) => {
    const token = await getToken();
    var options = {
      method: 'DELETE',
      url: `http://localhost:8000/api/courses`,
      headers: { authorization: `Bearer ${token}` },
      data: { courseId }
    };

    axios.request(options).then(function (response) {
      setCourses((prevCourses) => prevCourses.filter(course => course._id !== courseId));
    }).catch(function (error) {
      setSnackbarInfo({ message: 'Error deleting course!', type: 'error' });
    });
  }

  const removeCourseFromList = async (courseId: string) => {
    const token = await getToken();
    var options = {
      method: 'DELETE',
      url: `http://localhost:8000/api/users/courses`,
      headers: { authorization: `Bearer ${token}` },
      data: { courseId }
    };

    axios.request(options).then(function (response) {
      setCourses((prevCourses) => prevCourses.filter(course => course._id !== courseId));
    }).catch(function (error) {
      setSnackbarInfo({ message: 'Error removing course!', type: 'error' });
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
            {courses.length > 0 ? <CourseList
              generateQuestions={generateQuestions}
              editQuestion={editQuestion}
              deleteQuestion={deleteQuestion}
              updatePublicValue={updatePublicValue}
              deleteCourse={deleteCourse}
              removeCourseFromList={removeCourseFromList}
              courses={courses}
              userId={userId}
            /> :
              <p className="course-list-info">
                You haven't added any courses yet. Add one with the button to the right.
              </p>
            }

            <DialogNewCourse
              openDialog={openDialogNewCourse}
              handleClose={handleClose}
              handleSubmit={addCourse}
            />
          </div>
        </>
      )}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={generatingQuestions}
      >
        <div className="backdrop-loading-quiz">
          <CircularProgress color="inherit" />
          <p>Generating quiz...</p>
        </div>
      </Backdrop>
      <Snackbar
        open={snackbarInfo !== null}
        autoHideDuration={6000}
        onClose={() => setSnackbarInfo(null)}
      >
        <Alert onClose={() => setSnackbarInfo(null)} severity={snackbarInfo?.type} sx={{ width: '100%' }}>
          {snackbarInfo?.message}
        </Alert>
      </Snackbar>
    </div>
  )

}
