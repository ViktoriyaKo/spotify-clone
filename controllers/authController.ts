// @ts-nocheck
import crypto from 'crypto';
import { promisify } from 'util';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { IReq, IRes } from '../environment';

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (
  user: IUser,
  statusCode: number,
  req: IReq,
  res: IRes
) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure:
      req.secure || (req.headers['x-forwarded-proto'] as string) === 'https',
  };
  res.cookie('jwt', token, cookieOptions);
  // remove the password from the responce
  user.password = '';
  res.status(200).json({
    status: 'success',
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }
  // 3. if everything ok, send token to client
  createSendToken(user, 200, req, res, next);
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

const protect = catchAsync(async (req: IReq, res: IRes, next: NextFunction) => {
  // 1. Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1] as string;
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt as string;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // 2. Verification token
  //@ts-ignore
  const decoded = (await promisify(jwt.verify)(
    token,
    //@ts-ignore
    process.env.JWT_SECRET
    //@ts-ignore
  )) as jwt.JWT;
  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to the token does not longer exist', 401)
    );
  }
  // 4. Check if user changed password after the JWT(=token) was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }
  // Grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

const updatePassword = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    // 1. Get user from collection
    const user = await User.findById(req.user.id as string).select('+password');
    // 2. Check if POSTed current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError('Your current password is wrong', 401));
    }
    // 3. If so, update password.
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // 4. Log user in, send JWT
    createSendToken(user, 200, req, res);
  }
);

const isLoggedIn = async (req: IReq, res: IRes, next: NextFunction) => {
  if (req.cookies.jwt) {
    try {
      // 1. Verify token
      //@ts-ignore
      const decoded = (await promisify(jwt.verify)(
        req.cookies.jwt,
        // @ts-ignore
        process.env.JWT_SECRET
        // @ts-ignore
      )) as jwt.JWT;
      // 3. Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      // 4. Check if user changed password after the JWT(=token) was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // There is a logged in user
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

const logout = (req: IReq, res: IRes) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

export default {
  login,
  signup,
  protect,
  isLoggedIn,
  updatePassword,
  logout,
};
