import React, {useState} from 'react'
import { Dialog, TextField, DialogActions, Button} from '@mui/material'

interface IDialogEdit {
  openDialog: boolean,
  currentQuestion: string,
  currentAnswer: string,
  handleClose: () => void,
  handleSubmit: (question: string, answer: string) => void,
}

export const DialogEdit:React.FC<IDialogEdit> = ({currentQuestion, currentAnswer, openDialog,handleClose,handleSubmit}) => {

  const [question, setQuestion] = useState<string>(currentQuestion);
  const [answer, setAnswer] = useState<string>(currentAnswer);

  const validateSubmit = () => {
    //check that input is correct
    handleSubmit(question,answer);
    handleClose();
  }

  return (
    <Dialog 
      open={openDialog} onClose={handleClose}  
      fullWidth
      maxWidth="sm">
      <div className='course-dialog'>
        <div className="course-dialog-title">
          Edit question
        </div>
        <div className='course-dialog-content'>
        
          <TextField
          id="outlined-multiline-flexible"
          label="Question"
          defaultValue={currentQuestion}
          onChange={(e) => setQuestion(e.target.value)}
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
          label="Answer"
          onChange={(e) => setAnswer(e.target.value)}
          defaultValue={currentAnswer}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiFormLabel-root': {
              color: '#485A6C',
            }, 
            marginBottom: '0.5rem',
          }}
          multiline
          size='medium'
          rows={4}
        >
        </TextField>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={validateSubmit}>Submit</Button>
        </DialogActions>
          </div>
      </div>  
    </Dialog>  )
}
