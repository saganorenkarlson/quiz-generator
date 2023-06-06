import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
dotenv.config();

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256',
});

const mongoose = require('mongoose');


const app: Express = express();

app.use(express.json());  
app.use(cors());

app.get('/', checkJwt, (req: Request, res: Response) => {
  res.send('Hello World From the Typescript Server!')
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_NAME}.hyx3ckw.mongodb.net/?retryWrites=true&w=majority`, {
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


