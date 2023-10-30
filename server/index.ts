import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
const { auth } = require('express-oauth2-jwt-bearer');
import { fetchUser, addQuiz, deleteQuiz, addExistingQuiz, addQuizItemsToQuiz, updateQuizItem, deleteQuizItem, updateQuizPublicStatus, searchQuizzes, removeQuizFromUser } from "./controllers/users";

// config
dotenv.config();
const mongoose = require('mongoose');
const app: Express = express();
app.use(express.json());
app.use(cors());
const router = express.Router();


const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256',
});

// routes
router.get("/api/users", checkJwt, fetchUser);
router.post('/api/users/quizzes/:quizid', checkJwt, addExistingQuiz);
router.delete('/api/users/quizzes/:quizid/remove', checkJwt, removeQuizFromUser);
router.post('/api/quizzes', checkJwt, addQuiz);
router.delete('/api/users/quizzes/:quizid', checkJwt, deleteQuiz);
router.post('/api/quizzes/:quizid/items', checkJwt, addQuizItemsToQuiz);
router.put('/api/quizzes/:quizid/public-status', checkJwt, updateQuizPublicStatus);
router.put('/api/quizzes/:quizid/items/:quizitemid', checkJwt, updateQuizItem);
router.delete('/api/quizzes/:quizid/items/:quizitemid', checkJwt, deleteQuizItem);
router.get("/api/search", searchQuizzes);


app.use(router);
app.get('/', checkJwt, (req: Request, res: Response) => {
  res.send('Hello World From the Typescript Server!')
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@quiz-generator.hyx3ckw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});


