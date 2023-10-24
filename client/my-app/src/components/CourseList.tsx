import React, { useState } from 'react'
import { QuizListItem } from './QuizListItem';
import { Accordion, AccordionSummary, AccordionDetails, IconButton, Tooltip, Typography, Switch } from '@mui/material'
import { useTheme } from '@mui/material/styles';
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
}

export const CourseList: React.FC<ICourseList> = ({ generateQuestions, editQuestion, deleteQuestion, updatePublicValue, courses }) => {
    const theme = useTheme();
    const [openDialogGenerate, setOpenDialogGenerate] = useState<boolean>(false);
    const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
    const [openDialogQuiz, setOpenDialogQuiz] = useState<boolean>(false);
    const [currentCourse, setCurrentCourse] = useState<ICourse | null>(null);

    const handlePublicValueChange = (newPublicValue: boolean, courseId: string) => {
        updatePublicValue(newPublicValue, courseId);
    };

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
                        <IconButton sx={{ fontSize: "2rem", height: "fit-content" }} onClick={(e) => { e.stopPropagation(); setCurrentCourse(course); setOpenDialogQuiz(true); }}>
                            <PlayCircleIcon sx={{ fontSize: "2rem", color: theme.palette.text.secondary }}></PlayCircleIcon>
                        </IconButton>
                    </div>
                    <div className="accordion-block" onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}>
                        <Typography fontSize={12}>Private</Typography>
                        <Switch size="small" checked={course.public} onChange={(_, checked: boolean) => handlePublicValueChange(checked, course._id)} />
                        <Typography fontSize={12}>Public</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: '0 0 16px 0', backgroundColor: '#F8F9FB' }}>
                    <div className='quiz-header'>
                        <p className='quiz-text'>Questions</p>
                        <Tooltip title="Genereate more questions">
                            <IconButton onClick={() => { setOpenDialogGenerate(true); setSelectedCourse(course) }}>
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