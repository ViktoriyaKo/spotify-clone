import express, { Request } from 'express';
import path from 'path';
// Cross-Origin Resource Sharing politics
import cors from 'cors';
// defence against any mongo query in input from user
import mongoSanitize from 'express-mongo-sanitize';
// Express middleware to protect against HTTP Parameter Pollution attacks
import hpp from 'hpp';
// parse cookie
import cookieParser from 'cookie-parser';
// compress response bodies, increase speed
import compression from 'compression';
// defense againt ddos attack
import rateLimit from 'express-rate-limit';
import AppError from './utils/appError';
import { IReq } from './environment';
import viewRouter from './routs/viewRoutes';

import userRouter from './routs/userRoutes';
import spoAPI from './routs/spoAPI';

const app = express();
app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.options('*', cors());
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use(
  hpp({
    whitelist: ['rating'],
  })
);

app.use((req: any, _res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.body);
  next();
});

app.use(compression());

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/spotyApi', spoAPI);
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

export default app;
