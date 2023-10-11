import React, { useState } from 'react'
import { Dialog, DialogActions, Button, IconButton } from '@mui/material'
import { ICourse } from '../models/user'
import '../styles/dashboard.css'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

interface IDialogQuiz {
    openDialog: boolean,
    handleClose: () => void,
    course: ICourse | null
}

export const DialogQuiz: React.FC<IDialogQuiz> = ({ openDialog, handleClose, course }) => {
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(1);

    if (!openDialog) return null;

    const updateIndex = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, change: number) => {
        e.stopPropagation();
        setIsFlipped(false);
        setTimeout(() => {
            setIndex(index + change);
        }, 200);
    }

    return (
        (course && course?.quiz.length > 0) ?
            <Dialog
                open={openDialog}
                fullScreen
                maxWidth={false}
                sx={{
                    '.MuiPaper-root': {
                        background: 'transparent',
                        boxShadow: 'none',
                        overflow: 'hidden'
                    }
                }}
            >
                <div className="card-container" onClick={() => {
                    setIndex(1); setIsFlipped(false); handleClose()
                }}>
                    <div className={`card ${isFlipped ? 'is-flipped' : ''}`} onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}>
                        <h3 className={`course-name-dialog ${isFlipped ? 'is-unflipped' : ''}`}>{course.name}</h3>
                        <div className="card-face front">
                            {course.quiz[index - 1].question}
                            <p className='card-text-info'>Click to reveal answer</p>
                        </div>
                        <div className="card-face back">
                            {course.quiz[index - 1].answer}
                            <p className='card-text-info'>Click to show question</p>
                        </div>
                    </div>
                    <div className='quiz-navigation' onClick={(e) => e.stopPropagation()}>
                        <IconButton disabled={index === 1} onClick={(e) => updateIndex(e, -1)}>
                            <ArrowBackIosNewOutlinedIcon />
                        </IconButton>
                        <p className="quiz-navigation-text">{index}/{course.quiz.length}</p>
                        <IconButton disabled={index === course.quiz.length} onClick={(e) => updateIndex(e, 1)}>
                            <ArrowForwardIosOutlinedIcon />
                        </IconButton>
                    </div>
                </div>
            </Dialog > :
            <div>No questions</div>
    )
}
