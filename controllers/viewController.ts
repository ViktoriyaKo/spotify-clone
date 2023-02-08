import { NextFunction } from 'express';
import { IReq, IRes } from '../environment';
import User from '../models/userModel';
import spotyApi from '../spoApi/getCollections';
import catchAsync from '../utils/catchAsync';

const getOverview = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('overview');
  }
);

const getPlaylists = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const playlists = await spotyApi.getOneAlbum('4aawyAB9vmqN3uQ7FjRGTy');
    res.status(200).render('home', {
      playlists,
      state: 'btnHome',
    });
  }
);

const getFavoriteTracks = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('favorite', {
      state: 'btnFavorite',
    });
  }
);

// profile:
const getProfileMain = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('profile/profile-account', {
      state: 'btnAcc',
    });
  }
);

const changeProfilePassword = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('profile/password', {
      state: 'btnPsw',
    });
  }
);

const changeProfile = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('profile/account', {
      state: 'btnChange',
    });
  }
);

export default {
  getOverview,
  getPlaylists,
  getFavoriteTracks,
  getProfileMain,
  changeProfilePassword,
  changeProfile,
};
