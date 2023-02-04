import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { IReq, IRes } from '../environment';
import { NextFunction } from 'express';

const signToken = (id: string) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

const createSendToken = (user: IUser, statusCode: number, req: IReq, res: IRes) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] as string === 'https',
  };
  res.cookie('jwt', token, cookieOptions);
  // remove the password from the responce
  user.password = '';
  //@ts-ignore
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const login = catchAsync(async (req: IReq, res: IRes, next: NextFunction) => {
  const { email, password } = req.body;
  // 1. chech if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2. check if user exists && password correct
  const user = await User.findOne({ email }).select('+password');
  //@ts-ignore
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }
  // 3. if everything ok, send token to client
  createSendToken(user, 200, req, res);
});

const signup = catchAsync(async (req: IReq, res: IRes, next: NextFunction) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  createSendToken(newUser, 201, req, res);
});

export default { login, signup };
