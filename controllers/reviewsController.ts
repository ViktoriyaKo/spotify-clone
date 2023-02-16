import { NextFunction } from 'express';
import Review from '../models/reviewModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { IBody, IReq, IRes } from '../environment';

const setUser = catchAsync(async (req: IReq, res: IRes, next: NextFunction) => {
  req.body.user = req.user.id;
  //req.body.photo =
  next();
});

const addReview = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const review = 'testReview';
    const albumId = 'testID';

    const newReview = await Review.create({
      review,
      albumId,
      user: req.body.user,
    });

    res.status(200).json({
      status: 'success',
      data: {
        reviews: newReview,
      },
    });
  }
);

export default { addReview, setUser };
