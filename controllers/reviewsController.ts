import { NextFunction } from 'express';
import Review from '../models/reviewModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { IBody, IReq, IRes } from '../environment';

const setUser = catchAsync(async (req: IReq, res: IRes, next: NextFunction) => {
  req.body.user = req.user.id;
  req.body.albumId = req.headers.referer?.split('/').at(-1);
  req.body.name = req.user.name;
  req.body.photo = req.user.photo;
  //req.body.photo =
  next();
});

const addReview = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const newReview = await Review.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        reviews: newReview,
      },
    });
  }
);

export default { addReview, setUser };
