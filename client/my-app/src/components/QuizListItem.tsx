import React, { useState } from 'react'
import { IconButton, Dialog, DialogActions, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { DialogEdit } from './DialogEdit';
import { IQuizItem } from '../models/user';

interface IQuizListItem {
  quizitem: IQuizItem,
  quizId: string,
  editQuestion: (quizItem: IQuizItem, quizId: string, question: string, answer: string) => void
  deleteQuestion: (quizItem: IQuizItem, quizId: string) => void
}

export const QuizListItem: React.FC<IQuizListItem> = ({ quizitem, editQuestion, deleteQuestion, quizId }) => {
  const [openDialogEdit, setOpenDialogEdit] = useState<boolean>(false);
  const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);

  const handleSubmit = (question: string, answer: string) => {
    editQuestion(quizitem, quizId, question, answer);
  }

  return (
    <div className='quiz-item'>
      <p className="quiz-text">{quizitem.question}</p>
      <div className='quiz-item-buttons'>
        <IconButton aria-label="Edit quiz item" onClick={() => setOpenDialogEdit(true)}>
          <ModeEditIcon fontSize='small'></ModeEditIcon>
        </IconButton>
        <IconButton aria-label="Delete quiz item" onClick={() => setOpenDialogDelete(true)}>
          <DeleteIcon fontSize='small' ></DeleteIcon>
        </IconButton>
      </div>
      <DialogEdit openDialog={openDialogEdit} currentQuestion={quizitem.question} currentAnswer={quizitem.answer} handleClose={() => setOpenDialogEdit(false)} handleSubmit={handleSubmit}></DialogEdit>
      <Dialog
        open={(openDialogDelete)} onClose={() => setOpenDialogDelete(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description">
        <div className='quiz-dialog'>
          <div id="delete-dialog-title" className="quiz-dialog-title">
            Delete quiz item
          </div>
          <p id="delete-dialog-description">Are you sure you want to delete this quiz item?</p>
          <div className='quiz-dialog-content'>
            <DialogActions>
              <Button onClick={() => setOpenDialogDelete(false)}>No</Button>
              <Button onClick={() => { deleteQuestion(quizitem, quizId); setOpenDialogDelete(false); }}>Yes</Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>
    </div>

  )
}

