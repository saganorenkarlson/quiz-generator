import { useState, useEffect, useCallback } from 'react'
import '../styles/dashboard.css'
import { QuizList } from '../components/QuizList';
import { DialogNewQuiz } from '../components/DialogNewQuiz';
import { IconButton, Backdrop, CircularProgress, Typography, useTheme, Snackbar, Alert } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { IQuiz, IQuizItem } from '../models/user';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

export const Dashboard = () => {

  const { getAccessTokenSilently, user } = useAuth0();
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState<boolean>(true);
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
        setQuizzes(response.data.quizzes ? response.data.quizzes : []);
        setLoadingQuizzes(false);
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
  const [openDialogNewQuiz, setOpenDialogNewQuiz] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpenDialogNewQuiz(true);
  };

  const handleClose = () => {
    setOpenDialogNewQuiz(false);
  };

  const addQuiz = async (quizName: string, courseMaterial: string, numberOfQuestions: number) => {
    setGeneratingQuestions(true);
    const token = await getToken();
    const data = { name: quizName, courseMaterial: courseMaterial, numberOfQuestions: numberOfQuestions, userName: user?.nickname };

    var options = {
      method: 'POST',
      url: `http://localhost:8000/api/quizzes`,
      headers: { authorization: `Bearer ${token}` },
      data: data,
    };

    axios.request(options).then(function (response) {
      const newQuiz = response.data;
      setQuizzes(prevQuizzes => [...prevQuizzes, newQuiz]);
      setGeneratingQuestions(false);
      setSnackbarInfo({ message: "Quiz added successfully", type: 'success' });
    }).catch(function (error) {
      setGeneratingQuestions(false);
      setSnackbarInfo({ message: 'Error adding quiz!', type: 'error' });
    });

    handleClose();
  }


  const generateQuestions = async (quiz: IQuiz | null, courseMaterial: string, numberOfQuestions: number) => {
    setGeneratingQuestions(true);

    const token = await getToken();
    if (!quiz) return;
    const data = { courseMaterial: courseMaterial, numberOfQuestions: numberOfQuestions };

    var options = {
      method: 'POST',
      url: `http://localhost:8000/api/quizzes/${quiz._id}/items`,
      headers: { authorization: `Bearer ${token}` },
      data: data,
    };

    axios.request(options).then(function (response) {
      const updatedQuiz = response.data;
      setQuizzes(prevQuizzes => prevQuizzes.map(c => c._id === updatedQuiz._id ? updatedQuiz : c));
      setGeneratingQuestions(false);
      setSnackbarInfo({ message: "Questions generated successfully", type: 'success' });
    }).catch(function (error) {
      setGeneratingQuestions(false);
      setSnackbarInfo({ message: 'Error generating questions!', type: 'error' });
    });

  }

  const editQuestion = async (quizItem: IQuizItem, quizId: string, question: string, answer: string) => {
    const token = await getToken();
    const newQuizItem = { question, answer };

    var options = {
      method: 'PUT',
      url: `http://localhost:8000/api/quizzes/${quizId}/items/${quizItem._id}`,
      headers: { authorization: `Bearer ${token}` },
      data: newQuizItem,
    };

    axios.request(options).then(function (response) {
      const updatedQuiz = response.data;
      setQuizzes(prevQuizzes => prevQuizzes.map(c => c._id === updatedQuiz._id ? updatedQuiz : c));
    }).catch(function (error) {
      setSnackbarInfo({ message: 'Error editing questions!', type: 'error' });
    });

  }

  const deleteQuestion = async (quizItem: IQuizItem, quizId: string) => {
    const token = await getToken();
    var options = {
      method: 'DELETE',
      url: `http://localhost:8000/api/quizzes/${quizId}/items/${quizItem._id}`,
      headers: { authorization: `Bearer ${token}` },
    };

    axios.request(options).then(function (response) {
      const updatedQuiz = response.data;
      setQuizzes(prevQuizzes => prevQuizzes.map(c => c._id === updatedQuiz._id ? updatedQuiz : c));
    }).catch(function (error) {
      setSnackbarInfo({ message: 'Error deleting question!', type: 'error' });
    });
  }

  const updatePublicValue = async (newPublicValue: boolean, quizId: string) => {
    const token = await getToken();
    var options = {
      method: 'PUT',
      url: `http://localhost:8000/api/quizzes/${quizId}/public-status`,
      headers: { authorization: `Bearer ${token}` },
      data: { isPublic: newPublicValue },
    };

    axios.request(options).then(function (response) {
      const updatedQuiz = response.data;
      setQuizzes(prevQuizzes => prevQuizzes.map(c => c._id === updatedQuiz._id ? updatedQuiz : c));
    }).catch(function (error) {
      setSnackbarInfo({ message: 'Error editing questions!', type: 'error' });
    });
  }

  const deleteQuiz = async (quizId: string) => {
    const token = await getToken();
    var options = {
      method: 'DELETE',
      url: `http://localhost:8000/api/users/quizzes/${quizId}`,
      headers: { authorization: `Bearer ${token}` },
    };

    axios.request(options).then(function (response) {
      setQuizzes((prevQuizzes) => prevQuizzes.filter(quiz => quiz._id !== quizId));
    }).catch(function (error) {
      setSnackbarInfo({ message: 'Error deleting quiz!', type: 'error' });
    });
  }

  const removeQuizFromList = async (quizId: string) => {
    const token = await getToken();
    var options = {
      method: 'DELETE',
      url: `http://localhost:8000/api/users/quizzes/${quizId}/remove`,
      headers: { authorization: `Bearer ${token}` },
    };

    axios.request(options).then(function (response) {
      setQuizzes((prevQuizzes) => prevQuizzes.filter(quiz => quiz._id !== quizId));
    }).catch(function (error) {
      setSnackbarInfo({ message: 'Error removing quiz!', type: 'error' });
    });
  }

  return (
    <div className="dashboard">
      {loadingQuizzes ? (
        <>
          <div className="loading-skeleton">
            <Skeleton height={50} width={300} />
            <Skeleton className="add-quiz-loading-skeleton" circle={true} height={35} width={35} />
          </div>
          <Skeleton className="quiz-loading-skeleton" count={4} height={72} />
        </>
      ) : (
        <>
          <div className='dashboard-upper-wrapper'>
            <Typography variant="h5" component="h1" sx={{ color: theme.palette.text.primary }}>
              Quizzes
            </Typography>
            <IconButton aria-label='Create quiz' onClick={handleClickOpen} size="large" sx={{ color: theme.palette.text.secondary }}>
              <AddCircleIcon fontSize='large'></AddCircleIcon>
            </IconButton>
          </div>
          <div>
            {quizzes.length > 0 ? <QuizList
              generateQuestions={generateQuestions}
              editQuestion={editQuestion}
              deleteQuestion={deleteQuestion}
              updatePublicValue={updatePublicValue}
              deleteQuiz={deleteQuiz}
              removeQuizFromList={removeQuizFromList}
              quizzes={quizzes}
              userId={userId}
            /> :
              <p className="quiz-list-info">
                You haven't added any quizzes yet. Add one with the button to the right.
              </p>
            }

            <DialogNewQuiz
              openDialog={openDialogNewQuiz}
              handleClose={handleClose}
              handleSubmit={addQuiz}
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
