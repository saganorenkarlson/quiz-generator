import React, { useState } from 'react'
import { Dialog, TextField, MenuItem, DialogActions, Button } from '@mui/material'
import { IQuiz } from '../models/user'

interface IDialogGenerate {
  quiz: IQuiz | null,
  openDialog: boolean,
  handleClose: () => void,
  handleSubmit: (quiz: IQuiz | null, courseMaterial: string, numberOfQuestions: number) => void,
}

export const DialogGenerate: React.FC<IDialogGenerate> = ({ quiz, openDialog, handleClose, handleSubmit }) => {
  const nrQuestionOptions = [5, 10, 15, 20]

  const [courseMaterial, setCourseMaterial] = useState<string>("");
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);
  const [error, setError] = useState<string>("");

  const validateSubmit = () => {
    if (!courseMaterial.trim()) {
      setError("Course material is required");
      return;
    } handleSubmit(quiz, courseMaterial, numberOfQuestions);
    setCourseMaterial("");
    handleClose();
  }

  return (
    <Dialog
      open={openDialog} onClose={handleClose}
      fullWidth
      maxWidth="sm">
      <div className='quiz-dialog'>
        <div className="quiz-dialog-title">
          Generate questions
        </div>
        <div className='quiz-dialog-content'>

          <TextField
            id="outlined-multiline-flexible"
            label="Course material"
            onChange={(e) => setCourseMaterial(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiFormLabel-root': {
                color: '#485A6C',
              },
              marginBottom: '1rem',
            }}
            multiline
            size='medium'
            rows={4}
          />
          <TextField
            id="outlined-disabled"
            required
            select
            label="Number of questions to be generated"
            disabled={!courseMaterial}
            onChange={(e) => setNumberOfQuestions(+e.target.value)}
            defaultValue="5"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiFormLabel-root': {
                color: '#485A6C',
              },
              '& .Mui-disabled': {
                color: '#B4B4B4',
              },
              marginBottom: '0.5rem',
            }}
          >
            {nrQuestionOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {error && <p style={{ color: 'red', margin: '0 0 0.5rem 0', padding:'0', fontSize: '0.8rem' }}>{error}</p>}
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={validateSubmit}>Submit</Button>
          </DialogActions>
        </div>
      </div>
    </Dialog>)
}
