import express from 'express';
import path from 'path';
import logger from 'morgan';
import dotenv from 'dotenv';

import usersRouter from './routes/user';
import teamRouter from './routes/team';
import fixtureRouter from './routes/fixture';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

connectDB();
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/teams', teamRouter);
app.use('/api/fixtures', fixtureRouter);

app.use(errorHandler);

export default app;
