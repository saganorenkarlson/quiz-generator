import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InputAdornment, TextField, Accordion, AccordionSummary, IconButton, Typography, Tooltip, Pagination, ToggleButton, ToggleButtonGroup, Snackbar, Alert } from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import '../styles/searchpage.css'
import axios from 'axios'
import { ICourse } from '../models/user';
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
    const filterFromUrl = params.get('filter') ?? 'course';

    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<ICourse[]>()
    const [loadingSearchResults, setLoadingSearchResults] = useState<boolean>(false);
    const [openDialogQuiz, setOpenDialogQuiz] = useState<boolean>(false);
    const [currentCourse, setCurrentCourse] = useState<ICourse | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentCourses, setCurrentCourses] = useState<ICourse[]>();
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
                setCurrentCourses(response.data.courses ? response.data.courses : []);
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
            setSearchResults(response.data.courses ?? []);
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

    const addCourse = async (courseId: string) => {
        const token = await getToken();
        var options = {
            method: 'PUT',
            url: 'http://localhost:8000/api/users/courses',
            headers: { authorization: `Bearer ${token}` },
            data: { courseId: courseId }
        };
        axios.request(options).then(function (response) {
            setCurrentCourses(response.data.courses ? response.data.courses : []);
            setShowSuccessSnackbar(true);
        }).catch(function (error) {
            console.error(error);
        });
    }

    return (
        <div className='search-page-wrapper'>
            <Typography className="search-page-title" fontWeight={600} fontSize={'28px'}>Showing results for <i>{queryFromUrl}</i></Typography>
            <form className='search-form' onSubmit={handleSearch}>
                <TextField
                    type="text"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setQuery(event.target.value);
                    }}
                    inputProps={{
                        'aria-label': 'Search course or user'
                      }}
                    placeholder={queryFromUrl || 'Search course or user'}
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
                    <ToggleButton value="course">
                        Course
                    </ToggleButton>
                    <ToggleButton value="user">
                        User
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            {loadingSearchResults || isLoading ? (
                <div className="result-list">
                    <Skeleton className="course-loading-skeleton" count={4} height={72} />
                </div>
            ) : (
                <>
                    <div className="result-list">
                        {searchResults?.map((course) => <Accordion key={course._id} sx={{ marginBottom: '0.5rem' }}>
                            <AccordionSummary
                                expandIcon={null}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <div className="accordion-block">
                                    <h3 className="course-name">{course.name}</h3>
                                    <IconButton aria-label='Play quiz' sx={{ fontSize: "2rem", height: "fit-content" }} onClick={(e) => { e.stopPropagation(); setCurrentCourse(course); setOpenDialogQuiz(true); }}>
                                        <PlayCircle sx={{ fontSize: "2rem", color: theme.palette.text.secondary }}></PlayCircle>
                                    </IconButton>
                                </div>
                                <div className="accordion-block" onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}>
                                    <div className="created-by-wrapper">
                                        <Typography className="created-by-content" fontSize={12}><Person fontSize='small' />{course.createdBy.username} </Typography>
                                    </div>
                                    {isAuthenticated ?
                                        (currentCourses?.find((course_) => course.name === course_.name) ? <IconButton disabled> <PlaylistAddCheck />
                                        </IconButton> :
                                            <Tooltip title="Add course to your list">
                                                <IconButton aria-label='Add course to list' onClick={() => addCourse(course._id)}>
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
                    {"Course successfully added"}
                </Alert>
            </Snackbar>
            <DialogQuiz course={currentCourse} openDialog={openDialogQuiz} handleClose={() => setOpenDialogQuiz(false)} />
        </div>
    )
}
