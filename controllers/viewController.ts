import { NextFunction } from 'express';
import { IReq, IRes } from '../environment';
import User from '../models/userModel';
import spotyApi from '../spoApi/getCollections';
import catchAsync from '../utils/catchAsync';

const getOverview = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('overview', {
      msg: 'All tours',
    });
  }
);

const getPlaylists = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const playlist = await spotyApi.getOneAlbum('4aawyAB9vmqN3uQ7FjRGTy');
    res.status(200).render('home', {
      playlist,
    });
  }
);

const getFavoriteTracks = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('favorite');
  }
);

export default { getOverview, getPlaylists, getFavoriteTracks };
