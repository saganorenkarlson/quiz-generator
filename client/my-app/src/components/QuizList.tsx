import React, { useState } from 'react'
import { QuizListItem } from './QuizListItem';
import { Accordion, AccordionSummary, AccordionDetails, IconButton, Tooltip, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { Person, Delete, PlaylistRemove } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { DialogGenerate } from './DialogGenerate';
import { IQuiz, IQuizItem } from '../models/user';
import { DialogQuiz } from './DialogQuiz';


interface IQuizList {
    quizzes: IQuiz[],
    generateQuestions: (quiz: IQuiz | null, courseMaterial: string, numberOfQuestions: number) => void
    editQuestion: (quizItem: IQuizItem, quizId: string, question: string, answer: string) => void
    deleteQuestion: (quizItem: IQuizItem, quizId: string) => void
    updatePublicValue: (newPublicValue: boolean, quizId: string) => void
    deleteQuiz: (quizId: string) => void
    removeQuizFromList: (quizId: string) => void
    userId: string,
}

export const QuizList: React.FC<IQuizList> = ({ generateQuestions, editQuestion, deleteQuestion, updatePublicValue, deleteQuiz, removeQuizFromList, quizzes, userId }) => {
    const theme = useTheme();
    const [openDialogGenerate, setOpenDialogGenerate] = useState<boolean>(false);
    const [selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>(null);
    const [openDialogQuiz, setOpenDialogQuiz] = useState<boolean>(false);
    const [currentQuiz, setCurrentQuiz] = useState<IQuiz | null>(null);

    const handlePublicValueChange = (_event: React.MouseEvent<HTMLElement, MouseEvent>, value: string, quizId: string) => {
        updatePublicValue(value === 'public' ? true : false, quizId);
    }

    return (
        <div>
            {quizzes.map((quiz) =>
            (<Accordion key={quiz._id} sx={{ marginBottom: '0.5rem' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    <div className="accordion-block-left">
                        <h3 className="quiz-name">{quiz.name}</h3>
                        <IconButton aria-label='Play quiz' sx={{ fontSize: "2rem", height: "fit-content" }} onClick={(e) => { e.stopPropagation(); setCurrentQuiz(quiz); setOpenDialogQuiz(true); }}>
                            <PlayCircleIcon sx={{ fontSize: "2rem", color: theme.palette.text.secondary }}></PlayCircleIcon>
                        </IconButton>
                    </div>
                    {quiz.createdBy.id !== userId ? <div className="created-by-wrapper">
                        <Typography className="created-by-content" fontSize={12}><Person fontSize='small' />{quiz.createdBy.username} </Typography>
                    </div> : null
                    }

                </AccordionSummary>
                <AccordionDetails sx={{ padding: '0 0 16px 0', backgroundColor: '#F8F9FB' }}>
                    {quiz.createdBy.id === userId ? <> <p className='quiz-settings-text'>Settings</p>
                        <div className='quiz-settings'>
                            <div className="visibility-wrapper">
                                <p className="quiz-setting-visibility-text">Visibility: </p> <ToggleButtonGroup
                                    className='visibility-button'
                                    aria-label="Change quiz visibility"
                                    value={quiz.public ? 'public' : 'private'}
                                    exclusive
                                    onChange={(_event: React.MouseEvent<HTMLElement, MouseEvent>, value: string) => handlePublicValueChange(_event, value, quiz._id)}
                                    size='small'
                                >
                                    <ToggleButton value="private" aria-pressed={quiz.public === false}>
                                        Private
                                    </ToggleButton>
                                    <ToggleButton value="public" aria-pressed={quiz.public === true}>
                                        Public
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                            <IconButton aria-label="Delete quiz" onClick={() => deleteQuiz(quiz._id)} className="delete-button" sx={{ backgroundColor: 'none', borderRadius: '4px', border: 'solid #e1e4e9 1px', height: '28px' }}>
                                <Delete sx={{ width: '1rem', height: '1rem' }} /> <span className="delete-button-text">DELETE QUIZ </span>
                            </IconButton>
                        </div>
                        <hr className='quiz-hr' />
                        <div className='quiz-header'>
                            <p className='quiz-text'>Questions</p>
                            <Tooltip title="Generate more questions">
                                <IconButton aria-label="Generate more questions for the quiz" onClick={() => { setOpenDialogGenerate(true); setSelectedQuiz(quiz) }}>
                                    <AddCircleIcon></AddCircleIcon>
                                </IconButton>
                            </Tooltip>
                        </div>
                        {quiz.quiz.map((quizitem) => (
                            <QuizListItem key={quizitem._id} quizitem={quizitem} quizId={quiz._id} editQuestion={editQuestion} deleteQuestion={deleteQuestion} />
                        ))} </> :
                        <div className='quiz-settings-hidden'>
                            <IconButton aria-label="Delete quiz" onClick={() => removeQuizFromList(quiz._id)} className="delete-button" sx={{ backgroundColor: 'none', borderRadius: '4px', border: 'solid #e1e4e9 1px', height: '28px' }}>
                                <PlaylistRemove sx={{ width: '1rem', height: '1rem' }} /> <span className="delete-button-text">REMOVE QUIZ </span>
                            </IconButton>
                        </div>
                    }

                </AccordionDetails>
            </Accordion>))}
            <DialogQuiz quiz={currentQuiz} openDialog={openDialogQuiz} handleClose={() => setOpenDialogQuiz(false)} />
            <DialogGenerate quiz={selectedQuiz} openDialog={openDialogGenerate} handleClose={() => setOpenDialogGenerate(false)} handleSubmit={generateQuestions}></DialogGenerate>
        </div>
    )
}