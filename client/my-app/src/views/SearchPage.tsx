import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InputAdornment, TextField, Accordion, AccordionSummary, IconButton, Typography, Tooltip, Pagination, ToggleButton, ToggleButtonGroup, Snackbar, Alert } from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import '../styles/searchpage.css'
import axios from 'axios'
import { IQuiz } from '../models/user';
import { useTheme } from '@mui/material/styles';
import { PlayCircle, Search, Person, PlaylistAdd, PlaylistAddCheck } from '@mui/icons-material';
import { DialogQuiz } from '../components/DialogQuiz';
import { useAuth0 } from "@auth0/auth0-react";


export const SearchPage = () => {
    const theme = useTheme();

    const { isLoading, isAuthenticated, getAccessTokenSilently, user } = useAuth0();

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get('query');
    const pageFromUrl: number = Number(params.get('page')) ?? 1;
    const filterFromUrl = params.get('filter') ?? 'quiz';

    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<IQuiz[]>()
    const [loadingSearchResults, setLoadingSearchResults] = useState<boolean>(false);
    const [openDialogQuiz, setOpenDialogQuiz] = useState<boolean>(false);
    const [currentQuiz, setCurrentQuiz] = useState<IQuiz | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentQuizzes, setCurrentQuizzes] = useState<IQuiz[]>();
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState<boolean>(false);
    const pageSize = 10;

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
                setCurrentQuizzes(response.data.quizzes ? response.data.quizzes : []);
            }).catch(function (error) {
                console.error(error);
            });
        }

        if (user) {
            fetchResult();
        }

    }, [user, getToken]);

    useEffect(() => {
        setLoadingSearchResults(true);
        var options = {
            method: 'GET',
            url: 'http://localhost:8000/api/search',
            params: { term: queryFromUrl, page: pageFromUrl, pageSize: pageSize, filter: filterFromUrl }
        };

        axios.request(options).then(function (response) {
            setSearchResults(response.data.quizzes ?? []);
            setTotalPages(response.data.totalPages ?? 0)
            setLoadingSearchResults(false);
        }).catch(function (error) {
            console.error(error);
        });

    }, [queryFromUrl, pageFromUrl, filterFromUrl]);

    const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
        navigate(`/search?query=${queryFromUrl}&page=${value}&filter=${filterFromUrl}`);
    }

    const handleFilterChange = (_event: ChangeEvent<unknown>, value: string) => {
        navigate(`/search?query=${queryFromUrl}&page=${pageFromUrl}&filter=${value}`);
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/search?query=${query}&page=1&filter=${filterFromUrl}`);
    }

    const addQuiz = async (quizId: string) => {
        const token = await getToken();
        var options = {
            method: 'POST',
            url: `http://localhost:8000/api/users/quizzes/${quizId}`,
            headers: { authorization: `Bearer ${token}` },
        };
        axios.request(options).then(function (response) {
            setCurrentQuizzes(response.data.quizzes ? response.data.quizzes : []);
            setShowSuccessSnackbar(true);
        }).catch(function (error) {
            console.error(error);
        });
    }

    return (
        <div className='search-page-wrapper'>
            <Typography className="search-page-title" fontWeight={600} fontSize={'28px'}>Showing results for <i>{queryFromUrl}</i></Typography>
            <form  id="search-searchpage" className='search-form' onSubmit={handleSearch}>
                <TextField
                    type="text"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setQuery(event.target.value);
                    }}
                    inputProps={{
                        'aria-label': 'Search quiz or user'
                    }}
                    placeholder={queryFromUrl || 'Search quiz or user'}
                    defaultValue={queryFromUrl}
                    size='small'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </form>

            <div className='filter-wrapper'>
                <Typography fontSize={'14px'}>Filter by: </Typography>
                <ToggleButtonGroup
                    value={filterFromUrl}
                    exclusive
                    onChange={handleFilterChange}
                    size='small'
                >
                    <ToggleButton value="quiz">
                        Quiz
                    </ToggleButton>
                    <ToggleButton value="user">
                        User
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            {loadingSearchResults || isLoading ? (
                <div className="result-list">
                    <Skeleton className="quiz-loading-skeleton" count={4} height={72} />
                </div>
            ) : (
                <>
                    <div className="result-list">
                        {searchResults?.map((quiz) => <Accordion key={quiz._id} sx={{ marginBottom: '0.5rem' }}>
                            <AccordionSummary
                                expandIcon={null}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <div className="accordion-block-left">
                                    <h3 className="quiz-name">{quiz.name}</h3>
                                    <IconButton aria-label='Play quiz' sx={{ fontSize: "2rem", height: "fit-content" }} onClick={(e) => { e.stopPropagation(); setCurrentQuiz(quiz); setOpenDialogQuiz(true); }}>
                                        <PlayCircle sx={{ fontSize: "2rem", color: theme.palette.text.secondary }}></PlayCircle>
                                    </IconButton>
                                </div>
                                <div className="accordion-block-right" onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}>
                                    <div className="created-by-wrapper">
                                        <Typography className="created-by-content" fontSize={12}><Person fontSize='small' />{quiz.createdBy.username} </Typography>
                                    </div>
                                    {isAuthenticated ?
                                        (currentQuizzes?.find((quiz_) => quiz.name === quiz_.name) ? <IconButton disabled> <PlaylistAddCheck />
                                        </IconButton> :
                                            <Tooltip title="Add quiz to your list">
                                                <IconButton aria-label='Add quiz to list' onClick={() => addQuiz(quiz._id)}>
                                                    <PlaylistAdd />
                                                </IconButton>
                                            </Tooltip>
                                        )
                                        : null}
                                </div>
                            </AccordionSummary>
                        </Accordion>)}
                        {searchResults?.length === 0 ? <Typography color={"#a4a6a9"}>No search results for "{queryFromUrl}"</Typography> : null}
                    </div>
                    {totalPages > 1 ? <Pagination page={pageFromUrl} style={{ marginTop: "1rem" }} count={totalPages} onChange={handlePageChange} /> : null}
                </>
            )}
            <Snackbar
                open={showSuccessSnackbar}
                autoHideDuration={6000}
                onClose={() => setShowSuccessSnackbar(false)}
            >
                <Alert onClose={() => setShowSuccessSnackbar(false)} severity={'success'} sx={{ width: '100%' }}>
                    {"Quiz successfully added"}
                </Alert>
            </Snackbar>
            <DialogQuiz quiz={currentQuiz} openDialog={openDialogQuiz} handleClose={() => setOpenDialogQuiz(false)} />
        </div>
    )
}
