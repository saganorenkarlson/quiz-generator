import React, { useState } from 'react'
import { IconButton, Dialog, DialogActions, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { DialogEdit } from './DialogEdit';
import { IQuizItem } from '../models/user';

interface IQuizListItem {
  quizitem: IQuizItem,
  courseId: string,
  editQuestion: (quizItem: IQuizItem, courseId: string, question: string, answer: string) => void
  deleteQuestion: (quizItem: IQuizItem, courseId: string) => void
}

export const QuizListItem: React.FC<IQuizListItem> = ({ quizitem, editQuestion, deleteQuestion, courseId }) => {
  const [openDialogEdit, setOpenDialogEdit] = useState<boolean>(false);
  const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);

  const handleSubmit = (question: string, answer: string) => {
    editQuestion(quizitem, courseId, question, answer);
  }

  return (
    <div className='quiz-item'>
      <p className="quiz-text">{quizitem.question}</p>
      <div className='quiz-item-buttons'>
        <IconButton onClick={() => setOpenDialogEdit(true)}>
          <ModeEditIcon fontSize='small'></ModeEditIcon>
        </IconButton>
        <IconButton onClick={() => setOpenDialogDelete(true)}>
          <DeleteIcon fontSize='small' ></DeleteIcon>
        </IconButton>
      </div>
      <DialogEdit openDialog={openDialogEdit} currentQuestion={quizitem.question} currentAnswer={quizitem.answer} handleClose={() => setOpenDialogEdit(false)} handleSubmit={handleSubmit}></DialogEdit>
      <Dialog
        open={(openDialogDelete)} onClose={() => setOpenDialogDelete(false)}
        fullWidth
        maxWidth="sm">
        <div className='course-dialog'>
          <div className="course-dialog-title">
            Delete quiz item
          </div>
          <p>Are you sure you want to delete this quiz item?</p>
          <div className='course-dialog-content'>
            <DialogActions>
              <Button onClick={() => setOpenDialogDelete(false)}>No</Button>
              <Button onClick={() => { deleteQuestion(quizitem, courseId); setOpenDialogDelete(false); }}>Yes</Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>
    </div>

  )
}

