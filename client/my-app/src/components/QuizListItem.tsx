import React from 'react'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

interface IQuizListItem {
    quizitem: {
        question: string,
        answer: string
    }
}

export const QuizListItem:React.FC<IQuizListItem> = ({quizitem}) => {
  return (
    <div className='quiz-item'>                    
        <p className="quiz-text">{quizitem.question}</p>
        <div className='quiz-item-buttons'>
            <IconButton>
                <ModeEditIcon fontSize='small'></ModeEditIcon>
            </IconButton>
            <IconButton>
                <DeleteIcon fontSize='small' ></DeleteIcon>
            </IconButton>
        </div>
    </div>   )
}

