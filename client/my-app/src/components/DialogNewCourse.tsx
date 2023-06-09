import React, {useState} from 'react'
import { Dialog, TextField, MenuItem, DialogActions, Button} from '@mui/material'

interface IDialogNewCourse {
  openDialog: boolean,
  handleClose: () => void,
  handleSubmit: (courseName: string, courseMaterial: string, numberOfQuestions: number) => void,
}

export const DialogNewCourse:React.FC<IDialogNewCourse> = ({openDialog,handleClose,handleSubmit}) => {
  const nrQuestionOptions = [5,10,15,20]

  const [courseName, setCourseName] = useState<string>("");
  const [courseMaterial, setCourseMaterial] = useState<string>("");
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);

  const validateSubmit = () => {
    //check that input is correct
    handleSubmit(courseName,courseMaterial,numberOfQuestions);
    setCourseMaterial("");
  }

  return (
    <Dialog 
      open={openDialog} onClose={handleClose}  
      fullWidth
      maxWidth="sm">
      <div className='course-dialog'>
        <div className="course-dialog-title">
          Add new course
        </div>
        <div className='course-dialog-content'>
        <TextField
          required
          id="outlined-required"
          label="Course name"
          onChange={(e) => setCourseName(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiFormLabel-root': {
              color: '#485A6C',
            }, 
            marginBottom: '1rem'
          }}
          />
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
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={validateSubmit}>Submit</Button>
        </DialogActions>
          </div>
      </div>  
    </Dialog>  )
}
