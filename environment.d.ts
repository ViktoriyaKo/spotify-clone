import { Request, Response } from 'express';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE: string;
      DATABASE_PASSWORD: string;
      PORT: number;
      NODE_ENV: string;
      JWT_COOKIE_EXPIRES_IN:number;
      JWT_SECRET: string;
    }
  }
}

export interface IRes extends Response {
  cookie: any;
}

export interface IReq extends Request {
  requestTime: string
  secure: string
}

export {};
