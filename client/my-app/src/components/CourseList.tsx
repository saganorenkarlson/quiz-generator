import React, {useState} from 'react'
import { QuizListItem } from './QuizListItem';
import { Accordion, AccordionSummary, AccordionDetails, IconButton, Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import  ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import {DialogGenerate} from './DialogGenerate';
import { ICourse, IQuizItem } from '../models/user';


interface ICourseList {
    courses:  ICourse[]
}

export const CourseList:React.FC<ICourseList> = ({courses}) => {
    const theme = useTheme();

    const [openDialogGenerate, setOpenDialogGenerate] = useState<boolean>(false);

    const handleClickOpen = () => {
        setOpenDialogGenerate(true);
    };

    const handleClose = () => {
        setOpenDialogGenerate(false);
    };

    const generateQuestions = (courseMaterial: string, numberOfQuestions: number) => {
        console.log(courseMaterial, numberOfQuestions);
    }


    return (
        <div>
        {courses.map((course) => (
        <Accordion key={course.name} sx={{marginBottom: '0.5rem'}}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{display: "flex", alignItems: "center"}}
            >
                <h3 className="course-name">{course.name}</h3>
                <IconButton sx={{fontSize: "2rem", height: "fit-content"}}>
                        <PlayCircleIcon sx={{fontSize: "2rem", color: theme.palette.text.secondary}}></PlayCircleIcon>
                </IconButton>
            </AccordionSummary>
            <AccordionDetails sx={{padding: '0',backgroundColor:'#F8F9FB'}}>
                <div className='quiz-header'>
                    <p  className='quiz-text'>Questions</p> 
                    <Tooltip title="Genereate more questions">
                    <IconButton onClick={handleClickOpen}>
                        <AddCircleIcon></AddCircleIcon>
                    </IconButton>
                    </Tooltip>
                </div>
                {course.quiz.map((quizitem) => (
                <QuizListItem quizitem={quizitem}/>
                ))}
            </AccordionDetails>
        </Accordion>
        ))}
        <DialogGenerate openDialog={openDialogGenerate} handleClose={handleClose} handleSubmit={generateQuestions}></DialogGenerate>
    </div>
    )
}

// export default function CourseList() {
//     const theme = useTheme();
//     const Courses = [
//         {
//             name: 'TDD34',
//             quiz: [
//                 {
//                     question: 'What is the capital of Sweden?',
//                     answer: 'Stockholm'
//                 },
//                 {
//                     question: 'What is the capital of Sweden?',
//                     answer: 'Stockholm'
//                 },
//             ]
//         },
//         {
//             name: 'TSB34',
//             quiz: [
//                 {
//                     question: 'What is the capital of Sweden? It is a very long question that i want to become a lot of dots if it is too long so please make it work',
//                     answer: 'Stockholm'
//                 },
//                 {
//                     question: 'What is the capital of Sweden?',
//                     answer: 'Stockholm'
//                 },
//             ]
//         },
//         {
//             name: 'Avancerad geografi trolololo too long very long question. It is so long',
//             quiz: [
//                 {
//                     question: 'What is the capital of Sweden?',
//                     answer: 'Stockholm'
//                 },
//                 {
//                     question: 'What is the capital of Sweden?',
//                     answer: 'Stockholm'
//                 },
//                 {
//                     question: 'What is the capital of Sweden?',
//                     answer: 'Stockholm'
//                 },
//                 {
//                     question: 'What is the capital of Sweden?',
//                     answer: 'Stockholm'
//                 },
//             ]
//         },
//     ]

//     const [openDialogGenerate, setOpenDialogGenerate] = useState<boolean>(false);

//     const handleClickOpen = () => {
//         setOpenDialogGenerate(true);
//     };

//     const handleClose = () => {
//         setOpenDialogGenerate(false);
//     };

//     const generateQuestions = (courseMaterial: string, numberOfQuestions: number) => {
//         console.log(courseMaterial, numberOfQuestions);
//     }


//   return (
//     <div>
//         {Courses.map((course) => (
//         <Accordion key={course.name} sx={{marginBottom: '0.5rem'}}>
//             <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel1a-content"
//             id="panel1a-header"
//             sx={{display: "flex", alignItems: "center"}}
//             >
//                 <h3 className="course-name">{course.name}</h3>
//                 <IconButton sx={{fontSize: "2rem", height: "fit-content"}}>
//                         <PlayCircleIcon sx={{fontSize: "2rem", color: theme.palette.text.secondary}}></PlayCircleIcon>
//                 </IconButton>
//             </AccordionSummary>
//             <AccordionDetails sx={{padding: '0',backgroundColor:'#F8F9FB'}}>
//                 <div className='quiz-header'>
//                     <p  className='quiz-text'>Questions</p> 
//                     <Tooltip title="Genereate more questions">
//                     <IconButton onClick={handleClickOpen}>
//                         <AddCircleIcon></AddCircleIcon>
//                     </IconButton>
//                     </Tooltip>
//                 </div>
//                 {course.quiz.map((quizitem) => (
//                 <QuizListItem quizitem={quizitem}/>
//                 ))}
//             </AccordionDetails>
//         </Accordion>
//         ))}
//         <DialogGenerate openDialog={openDialogGenerate} handleClose={handleClose} handleSubmit={generateQuestions}></DialogGenerate>
//     </div>
//   )
// }
