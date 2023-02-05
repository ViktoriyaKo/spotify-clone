import { NextFunction } from 'express';
import { IReq, IRes } from '../environment';
import User from '../models/userModel';
import spotyApi from '../spoApi/getCollections';
import catchAsync from '../utils/catchAsync';

const getOverview = catchAsync(async (req: IReq, res: IRes, next: NextFunction) => {
  res.status(200).render('overview', {
    msg: 'All tours',
  });
});

const getPlaylists = catchAsync(async (req: IReq, res: IRes, next: NextFunction) => {
  const playlists = await spotyApi.fetchPlaylists();
  res.status(200).render('collections', {
    playlists: playlists.slice(0, 10),
  });
});

export default { getOverview, getPlaylists };
