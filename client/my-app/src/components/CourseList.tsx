import React, { useState } from 'react'
import { QuizListItem } from './QuizListItem';
import { Accordion, AccordionSummary, AccordionDetails, IconButton, Tooltip, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { Person, Delete, PlaylistRemove } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { DialogGenerate } from './DialogGenerate';
import { ICourse, IQuizItem } from '../models/user';
import { DialogQuiz } from './DialogQuiz';


interface ICourseList {
    courses: ICourse[],
    generateQuestions: (course: ICourse | null, courseMaterial: string, numberOfQuestions: number) => void
    editQuestion: (quizItem: IQuizItem, courseId: string, question: string, answer: string) => void
    deleteQuestion: (quizItem: IQuizItem, courseId: string) => void
    updatePublicValue: (newPublicValue: boolean, courseId: string) => void
    deleteCourse: (courseId: string) => void
    removeCourseFromList: (courseId: string) => void
    userId: string,
}

export const CourseList: React.FC<ICourseList> = ({ generateQuestions, editQuestion, deleteQuestion, updatePublicValue, deleteCourse, removeCourseFromList, courses, userId }) => {
    const theme = useTheme();
    const [openDialogGenerate, setOpenDialogGenerate] = useState<boolean>(false);
    const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
    const [openDialogQuiz, setOpenDialogQuiz] = useState<boolean>(false);
    const [currentCourse, setCurrentCourse] = useState<ICourse | null>(null);

    const handlePublicValueChange = (_event: React.MouseEvent<HTMLElement, MouseEvent>, value: string, courseId: string) => {
        updatePublicValue(value === 'public' ? true : false, courseId);
    }

    return (
        <div>
            {courses.map((course) =>
            (<Accordion key={course._id} sx={{ marginBottom: '0.5rem' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    <div className="accordion-block">
                        <h3 className="course-name">{course.name}</h3>
                        <IconButton aria-label='Play quiz' sx={{ fontSize: "2rem", height: "fit-content" }} onClick={(e) => { e.stopPropagation(); setCurrentCourse(course); setOpenDialogQuiz(true); }}>
                            <PlayCircleIcon sx={{ fontSize: "2rem", color: theme.palette.text.secondary }}></PlayCircleIcon>
                        </IconButton>
                    </div>
                    {course.createdBy.id !== userId ? <div className="created-by-wrapper">
                        <Typography className="created-by-content" fontSize={12}><Person fontSize='small' />{course.createdBy.username} </Typography>
                    </div> : null
                    }

                </AccordionSummary>
                <AccordionDetails sx={{ padding: '0 0 16px 0', backgroundColor: '#F8F9FB' }}>
                    <p className='course-settings-text'>Settings</p>
                    <div className='course-settings'>
                        <div className="visibility-wrapper">
                            <p className="course-setting-visibility-text">Visibility: </p> <ToggleButtonGroup
                                className='visibility-button'
                                aria-label="Change course visibility"
                                value={course.public ? 'public' : 'private'}
                                exclusive
                                onChange={(_event: React.MouseEvent<HTMLElement, MouseEvent>, value: string) => handlePublicValueChange(_event, value, course._id)}
                                size='small'
                            >
                                <ToggleButton value="private" aria-pressed={course.public === false}>
                                    Private
                                </ToggleButton>
                                <ToggleButton value="public" aria-pressed={course.public === true}>
                                    Public
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        <IconButton aria-label="Delete course" onClick={() => course.createdBy.id === userId ? deleteCourse(course._id) : removeCourseFromList(course._id)} className="delete-button" sx={{ backgroundColor: 'none', borderRadius: '4px', border: 'solid #e1e4e9 1px', height: '28px' }}>
                            {course.createdBy.id === userId ? <> <Delete sx={{ width: '1rem', height: '1rem' }} /> <span className="delete-button-text">DELETE COURSE </span>  </> : <><PlaylistRemove /> <span className="delete-button-text">REMOVE FROM LIST</span> </>}
                        </IconButton>
                    </div>
                    <hr className='course-hr' />
                    <div className='quiz-header'>
                        <p className='quiz-text'>Questions</p>
                        <Tooltip title="Generate more questions">
                            <IconButton aria-label="Generate more questions for the course" onClick={() => { setOpenDialogGenerate(true); setSelectedCourse(course) }}>
                                <AddCircleIcon></AddCircleIcon>
                            </IconButton>
                        </Tooltip>
                    </div>
                    {course.quiz.map((quizitem) => (
                        <QuizListItem key={quizitem._id} quizitem={quizitem} courseId={course._id} editQuestion={editQuestion} deleteQuestion={deleteQuestion} />
                    ))}
                </AccordionDetails>
            </Accordion>))}
            <DialogQuiz course={currentCourse} openDialog={openDialogQuiz} handleClose={() => setOpenDialogQuiz(false)} />
            <DialogGenerate course={selectedCourse} openDialog={openDialogGenerate} handleClose={() => setOpenDialogGenerate(false)} handleSubmit={generateQuestions}></DialogGenerate>
        </div>
    )
}