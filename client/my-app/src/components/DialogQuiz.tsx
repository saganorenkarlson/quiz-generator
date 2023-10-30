import React, { useState, useEffect } from 'react'
import { Dialog, IconButton } from '@mui/material'
import { IQuiz } from '../models/user'
import '../styles/dashboard.css'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

interface IDialogQuiz {
    openDialog: boolean,
    handleClose: () => void,
    quiz: IQuiz | null
}

export const DialogQuiz: React.FC<IDialogQuiz> = ({ openDialog, handleClose, quiz }) => {
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(1);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (!openDialog) return;
    
            switch (event.key) {
                case 'ArrowLeft':
                    if (index > 1) setIndex(index - 1);
                    break;
                case 'ArrowRight':
                    if (index !== quiz?.quiz?.length) setIndex(index + 1);
                    break;
                case ' ':
                    setIsFlipped(!isFlipped);
                    break;
                default:
                    break;
            }
        };
    
        window.addEventListener('keydown', handleKeyPress);
    
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [index, isFlipped, quiz, openDialog]);

    const updateIndex = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, change: number) => {
        e.stopPropagation();
        setIsFlipped(false);
        setTimeout(() => {
            setIndex(index + change);
        }, 200);
    }

    return (
        (quiz && quiz?.quiz.length > 0) ?
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
                        <h3 className={`quiz-name-dialog ${isFlipped ? 'is-unflipped' : ''}`}>{quiz.name}</h3>
                        <div className="card-face front">
                            {quiz.quiz[index - 1].question}
                            <p className='card-text-info'>Click to reveal answer</p>
                        </div>
                        <div className="card-face back">
                            {quiz.quiz[index - 1].answer}
                            <p className='card-text-info'>Click to show question</p>
                        </div>
                    </div>
                    <div className='quiz-navigation' onClick={(e) => e.stopPropagation()}>
                        <IconButton sx={{color: "white"}} disabled={index === 1} onClick={(e) => updateIndex(e, -1)}>
                            <ArrowBackIosNewOutlinedIcon />
                        </IconButton>
                        <p className="quiz-navigation-text">{index}/{quiz.quiz.length}</p>
                        <IconButton sx={{color: "white"}} disabled={index === quiz.quiz.length} onClick={(e) => updateIndex(e, 1)}>
                            <ArrowForwardIosOutlinedIcon />
                        </IconButton>
                    </div>
                </div>
            </Dialog > :
            null)
}
