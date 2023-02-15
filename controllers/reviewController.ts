
import Review from '../models/reviewModel';
import { IReq, IRes } from '../environment';
import { NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';

const setTourUserIds = (req: IReq, res: IRes, next: NextFunction) => {
  if (!req.body.albumId) req.body.albumId = '123456-id-album'//req.params.albumId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};


const addReview  = catchAsync(async (req: IReq, res: IRes, next: NextFunction) => {
  const doc = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

export default { addReview, setTourUserIds };