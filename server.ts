import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import AppError from './utils/appError';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT Exception, shutting down....');
  console.log('1.', err.name, '\n2.', err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE!.replace(
  '<password>',
  process.env.DATABASE_PASSWORD!,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log('DB connection sucessful!');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err: AppError) => {
  console.log('1.', err.name, '\n2.', err.message);
  console.log('UNHANDLED Rejection, shutting down....');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECIEVED. SHUTTING DOWN.');
  server.close(() => {
    console.log('Process terminated');
  });
});
