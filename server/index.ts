import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
const { auth } = require('express-oauth2-jwt-bearer');
import { createUser, fetchUser, addCourse, addQuizItemsToCourse, updateQuizItem, deleteQuizItem, updateCoursePublicStatus, searchCourses } from "./controllers/users";

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
router.post("/api/users", checkJwt, createUser);
router.get("/api/users", checkJwt, fetchUser);
router.post("/api/courses", checkJwt, addCourse);
router.put("/api/courses/:courseid", checkJwt, addQuizItemsToCourse);
router.put("/api/courses/:courseid/public", checkJwt, updateCoursePublicStatus);
router.put("/api/courses/:courseid/:quizitemid", checkJwt, updateQuizItem);
router.delete("/api/courses/:courseid/:quizitemid", checkJwt, deleteQuizItem);
router.get("/api/search", searchCourses);

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


