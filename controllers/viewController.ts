import { NextFunction } from 'express';
import { IReq, IRes } from '../environment';
import User from '../models/userModel';
import spotyApi from '../spoApi/getCollections';
import catchAsync from '../utils/catchAsync';
import querystring from 'querystring';

const getOverview = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('overview');
  }
);

const getPlaylists = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const userTopTracks = await spotyApi.getUserTopItems('tracks');
    const userTopArtists = await spotyApi.getUserTopItems('artists');
    const topCategory = await spotyApi.getGenres();
    const trackRecommendations = await spotyApi.getRecommendations();
    const newReleases = await spotyApi.getNewReleases();
    res.status(200).render('home', {
      userTopTracks,
      userTopArtists,
      topCategory,
      newReleases,
      trackRecommendations,
      state: 'btnHome',
    });
  }
);

const getFavoriteTracks = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const tracks = await spotyApi.getUserSavedTracks();
    const account = await spotyApi.getCurrentUser();
    res.status(200).render('favorite', {
      tracks,
      account,
      state: 'btnFavorite',
    });
  }
);

// profile:
const getProfileMain = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const account = await spotyApi.getCurrentUser();
    res.status(200).render('profile/profile-account', {
      account,
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

// library:

const getUserPlaylists = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const playlists = await spotyApi.getUserPlaylists();
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

const getPlaylist = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.params.id;
    const playlist = await spotyApi.getPlaylist(id);
    res.status(200).render('playlist', {
      playlist,
      state: 'btnLibrary',
    });
  }
);

const getArtist = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.params.id;
    const artist = await spotyApi.getArtist(id);
    const artistAlbums = await spotyApi.getArtistAlbums(id);
    const artistTopTracks = await spotyApi.getArtistTopTracks(id);
    const relatedArtist = await spotyApi.getRelatedArtist(id);
    res.status(200).render('artist', {
      artist,
      artistTopTracks,
      artistAlbums,
      relatedArtist,
      state: 'btnLibrary',
    });
  }
);

const getAlbum = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.params.id;
    const album = await spotyApi.getOneAlbum(id);
    const albumTracks = await spotyApi.getAlbumTracks(id);
    const artistId = album.artists[0].id;
    const artistAlbums = await spotyApi.getArtistAlbums(artistId);
    const checkSavedAlbums = await spotyApi.checkUserSavedAlbums(id);
    res.status(200).render('album', {
      album,
      albumTracks,
      artistAlbums,
      checkSavedAlbums,
      state: 'btnLibrary',
    });
  }
);

const delAlbum = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.body.albumId as string;
    await spotyApi.removeUserSavedAlbums(id);
    res.status(202).json({
      status: 'album was deleted',
    });
  }
);

const saveAlbum = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.body.albumId as string;
    await spotyApi.saveAlbumsForUser(id);
    res.status(202).json({
      status: 'album was saved',
    });
  }
);

const getDiscography = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.params.id;
    const artistAlbums = await spotyApi.getArtistAlbums(id);
    res.status(200).render('discography', {
      artistAlbums,
      state: 'btnLibrary',
    });
  }
);

const login = catchAsync(async (req: IReq, res: IRes, next: NextFunction) => {
  const queryParams = await spotyApi.login();
  const stateKey = 'spotify_auth_state';
  res.cookie(stateKey, queryParams.state);

  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify(
      queryParams
    )}`
  );
});

const callback = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    await spotyApi.callback(req, res);

    res.redirect('http://localhost:7999/home');
  }
);

export default {
  delAlbum,
  saveAlbum,
  getOverview,
  getPlaylists,
  getFavoriteTracks,
  getProfileMain,
  changeProfilePassword,
  changeProfile,
  getUserPlaylists,
  getUserArtists,
  getUserAlbums,
  getPlaylist,
  getArtist,
  getAlbum,
  getDiscography,
  login,
  callback,
};
