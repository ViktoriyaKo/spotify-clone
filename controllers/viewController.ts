import { NextFunction } from 'express';
import { IReq, IRes } from '../environment';
import User from '../models/userModel';
import spotyApi from '../spoApi/getCollections';
import catchAsync from '../utils/catchAsync';
import querystring from 'querystring';
import {ITrack, IPlaylistTrack} from '../public/ts/interfaces'

const getOverview = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('overview');
  }
);

const getPlaylists = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const userTopTracks = await spotyApi.getUserTopItems('tracks');
    const userTopArtists = await spotyApi.getUserTopItems('artists');
    const trackRecommendations = await spotyApi.getRecommendations();
    const newReleases = await spotyApi.getNewReleases();
    res.status(200).render('home', {
      userTopTracks,
      userTopArtists,
      newReleases,
      trackRecommendations,
      state: 'btnHome',
    });
  }
);

const getMoreInfo = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.params.id;
    const userTopTracks = await spotyApi.getUserTopItems('tracks');
    const userTopArtists = await spotyApi.getUserTopItems('artists');
    const trackRecommendations = await spotyApi.getRecommendations();
    const newReleases = await spotyApi.getNewReleases();
    res.status(200).render('home-more', {
      id,
      userTopTracks,
      userTopArtists,
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
    const playlists = await spotyApi.getUserPlaylists();
    res.status(200).render('favorite', {
      tracks,
      account,
      playlists,
      state: 'btnFavorite',
    });
  }
);

// profile:
const getProfileMain = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    res.status(200).render('profile/profile-account', {
      name: req.user.name,
      email: req.user.email,
      photo: req.user.photo,
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
      photo: req.user.photo,
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

async function checkSavedTracks(tracksArray: [ITrack | IPlaylistTrack]): Promise<Map<string, boolean>> {
  let idsSavedTracks = [];
  for(let item of tracksArray) {
    if("track" in item) {
      idsSavedTracks.push(item.track.id);
    } else {
      idsSavedTracks.push(item.id);
    }
  }
  const checkSavedTracks = await spotyApi.checkUserSavedTracks(idsSavedTracks.join(','));
  let savedTracks = new Map();
  for(let i = 0; i < idsSavedTracks.length - 1; i ++) {
    savedTracks.set(idsSavedTracks[i], checkSavedTracks[i]);
  }

  return savedTracks;
}

const getPlaylist = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.params.id;
    const playlist = await spotyApi.getPlaylist(id);
    const savedTracks = await checkSavedTracks(playlist.tracks.items);
    const playlists = await spotyApi.getUserPlaylists();
    res.status(200).render('playlist', {
      playlist,
      savedTracks,
      playlists,
      state: 'btnLibrary',
    });
  }
);

const createPlaylist = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const user = await spotyApi.getCurrentUser();
    const playlists = await spotyApi.getUserPlaylists();
    const newPlaylist = await spotyApi.createPlaylist(user.id, playlists.length + 1);
    const id = newPlaylist.id;

    res.status(202).json({
      status: 'playlist was created',
      playlistId: id
    });
  }
);

const deletePlaylist = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const playlistId = req.body.playlistId as string;
    await spotyApi.deletePlaylist(playlistId);
    console.log('ok')
    res.status(202).json({
      status: 'success',
    });
  }
);

const changePlaylistDetail = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.body.playlistId as string;
    const newName = req.body.playlistName as string;
    await spotyApi.changePlaylistDetail(id, newName);
    res.status(202).json({
      status: 'success',
    });
  }
);

const addTracksToPlaylist = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.body.playlistId as string;
    const trackUri = req.body.trackUri as string;
    await spotyApi.addTracksToPlaylist(id, trackUri);
    res.status(202).json({
      status: 'success',
    });
  }
);

const deleteTracksFromPlaylist = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.body.playlistId as string;
    const trackUri = req.body.trackUri as string;
    await spotyApi.removeTracksFromPlaylist(id, trackUri);
    res.status(202).json({
      status: 'success',
    });
  }
);

const getArtist = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.params.id;
    const artist = await spotyApi.getArtist(id);
    const artistAlbums = await spotyApi.getArtistAlbums(id, 10);
    const artistTopTracks = await spotyApi.getArtistTopTracks(id);
    const relatedArtist = await spotyApi.getRelatedArtists(id);
    const checkFollowArtist = await spotyApi.checkUserFollowArtist(id);
    const savedTracks = await checkSavedTracks(artistTopTracks.tracks);
    const playlists = await spotyApi.getUserPlaylists();
    
    res.status(200).render('artist', {
      artist,
      artistTopTracks,
      artistAlbums,
      relatedArtist,
      checkFollowArtist,
      savedTracks,
      state: 'btnLibrary',
      playlists
    });
  }
);


const getAlbum = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.params.id;
    const album = await spotyApi.getOneAlbum(id);
    const albumTracks = await spotyApi.getAlbumTracks(id);
    const artistId = album.artists[0].id;
    const artistAlbums = await spotyApi.getArtistAlbums(artistId, 10);
    const checkSavedAlbums = await spotyApi.checkUserSavedAlbums(id);
    const savedTracks = await checkSavedTracks(albumTracks.items);
    const playlists = await spotyApi.getUserPlaylists();

    res.status(200).render('album', {
      album,
      albumTracks,
      artistAlbums,
      checkSavedAlbums,
      savedTracks,
      playlists,
      state: 'btnLibrary',
    });
  }
);

const getTrack = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.params.id;
    const track = await spotyApi.getSingleTrack(id);
    const artistId = track.artists[0].id;
    const artist = await spotyApi.getArtist(artistId);
    const artistAlbums = await spotyApi.getArtistAlbums(artistId, 10);
    const playlists = await spotyApi.getUserPlaylists();
    res.status(200).render('track', {
      track,
      artist,
      artistId,
      artistAlbums,
      playlists
    });
  }
);

const delAlbum = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.body.albumId as string;
    await spotyApi.removeUserSavedAlbums(id);
    res.status(202).json({
      status: 'success',
    });
  }
);

const deleteTrack = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.body.idTrack as string;
    await spotyApi.removeUserSavedTrack(id);
    res.status(202).json({
      status: 'success',
    });
  }
);

const searchItems = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const inputSearch = 'test';
    const tracks = await spotyApi.searchForItem(inputSearch);
    res.status(200).render('search', {
      tracks,
      state: 'btnSearch',
    });
  }
);

const saveAlbum = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.body.albumId as string;
    await spotyApi.saveAlbumsForUser(id);
    res.status(202).json({
      status: 'success',
    });
  }
);

const saveTrack = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.body.idTrack as string;
    await spotyApi.saveTracksForUser(id);
    res.status(202).json({
      status: 'success',
    });
  }
);

const getDiscography = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.params.id;
    const artistAlbums = await spotyApi.getArtistAlbums(id, 50);
    res.status(200).render('discography', {
      artistAlbums,
      state: 'btnLibrary',
    });
  }
);

const getRelatedArtists = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.params.id;
    const relatedArtists = await spotyApi.getRelatedArtists(id);
    res.status(200).render('related-artist', {
      relatedArtists,
      state: 'btnLibrary',
    });
  }
);

const followArtist = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.body.artistId as string;
    await spotyApi.followArtist(id);
    res.status(202).json({
      status: 'success',
    });
  }
);

const unfollowArtist = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const id = req.body.artistId as string;
    await spotyApi.unfollowArtist(id);
    res.status(202).json({
      status: 'success',
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
  getRelatedArtists,
  followArtist,
  unfollowArtist,
  login,
  callback,
  getTrack,
  getMoreInfo,
  deleteTrack,
  searchItems,
  saveTrack,
  createPlaylist,
  deletePlaylist,
  changePlaylistDetail,
  addTracksToPlaylist,
  deleteTracksFromPlaylist
};
