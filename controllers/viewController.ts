import { NextFunction } from 'express';
import { IReq, IRes } from '../environment';
import User from '../models/userModel';
import spotyApi from '../spoApi/getCollections';
import catchAsync from '../utils/catchAsync';
import querystring from 'querystring';

const getOverview = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('overview', {
      msg: 'All tours',
    });
  }
);

const getPlaylists = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const categories = await spotyApi.getGenres();
    res.status(200).render('home', {
      categories,
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
    res.status(200).render('profile-account');
  }
);

const changeProfilePassword = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('password');
  }
);

const changeProfile = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('account');
  }
);

// library:

const getUserPlaylists = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const playlists = spotyApi.getUserPlaylists();
    res.status(200).render('library-playlists', {
      playlists,
      state: 'btnLibrary',
    });
  }
);

const getUserAlbums = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const albums = await spotyApi.getUserSavedAlbums();
    res.status(200).render('library-albums', {
      albums,
      state: 'btnLibrary',
    });
  }
);

const getUserArtists = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const artists = await spotyApi.getFollowedArtist();
    res.status(200).render('library-artists', {
      artists,
      state: 'btnLibrary',
    });
  }
);

const login = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const queryParams = await spotyApi.login();
    const stateKey = 'spotify_auth_state';
    res.cookie(stateKey, queryParams.state);
  
    res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify(queryParams)}`);
  }
)

const callback = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    await spotyApi.callback(req, res);
  
    res.redirect('http://localhost:7999/home');
  }
)

export default {
  getOverview,
  getPlaylists,
  getFavoriteTracks,
  getProfileMain,
  changeProfilePassword,
  changeProfile,
  getUserPlaylists,
  getUserArtists,
  getUserAlbums,
  login,
  callback,
};
