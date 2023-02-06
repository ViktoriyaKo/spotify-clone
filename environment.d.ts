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
      JWT_COOKIE_EXPIRES_IN:number;
      JWT_SECRET: Secret;
      CLIENT_SECRET: string;
      CLIENT_ID: string;
    }
  }
}

export interface IRes extends Response {
  cookie: any;
}

export interface IReq extends Request {
  token: string | JwtPayload;
  requestTime: string;
  secure: string;
  user: IUser;
}

export {};
