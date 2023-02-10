import { Request, Response } from 'express';
import { Secret, JwtPayload } from 'jsonwebtoken';
import { IUser } from './models/userModel';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE: string;
      DATABASE_PASSWORD: string;
      PORT: number;
      NODE_ENV: string;
      JWT_COOKIE_EXPIRES_IN: number;
      JWT_SECRET: Secret;
      CLIENT_SECRET: string;
      CLIENT_ID: string;
      CLIENT_TOKEN: string;
      BASE_URL: string;
    }
  }
}

export interface IRes extends Response {
  cookie: any;
}

export interface IBody {
  email?: string;
  passwordChangedAt?: string;
  role?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  photo?: string;
}
export interface IReq extends Request {
  body: IBody;
  token: string | JwtPayload;
  requestTime: string;
  secure: string;
  user: IUser;
}

export {};
