import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
const mongoose = require('mongoose');

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
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


