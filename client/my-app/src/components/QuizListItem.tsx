import React, {useState} from 'react'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { DialogEdit } from './DialogEdit';

interface IQuizListItem {
    quizitem: {
        question: string,
        answer: string
    }
}

export const QuizListItem:React.FC<IQuizListItem> = ({quizitem}) => {
    const [openDialogEdit, setOpenDialogEdit] = useState<boolean>(false);

    const handleClickOpen = () => {
        setOpenDialogEdit(true);
    };

    const handleClose = () => {
        setOpenDialogEdit(false);
    };

    const editQuestion = (question: string, answer: string) => {
        console.log(question, answer);
    }

  return (
    <div className='quiz-item'>                    
        <p className="quiz-text">{quizitem.question}</p>
        <div className='quiz-item-buttons'>
            <IconButton onClick={handleClickOpen}>
                <ModeEditIcon fontSize='small'></ModeEditIcon>
            </IconButton>
            <IconButton>
                <DeleteIcon fontSize='small' ></DeleteIcon>
            </IconButton>
        </div>
        <DialogEdit openDialog={openDialogEdit} currentQuestion={quizitem.question} currentAnswer={quizitem.answer} handleClose={handleClose} handleSubmit={editQuestion}></DialogEdit>
    </div>   
    
    )
}

