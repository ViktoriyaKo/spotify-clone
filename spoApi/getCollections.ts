import fetch from 'cross-fetch';
import querystring from 'querystring';
import axios from 'axios';
import { IReq, IRes } from '../environment';
import User from '../models/userModel';

let token: string;

const generateRandomString = (length: number) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const login = async () => {
  const clientId = process.env.CLIENT_ID;
  const scope =
    'user-read-private user-read-email ugc-image-upload user-library-read user-follow-read user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-read-playback-position user-top-read user-read-recently-played user-library-modify user-read-email user-read-private';
  const redirectUri = `${process.env.BASE_URL}:${process.env.PORT}/callback`;

  const state = generateRandomString(16);

  const queryParams = {
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: scope,
  };

  return queryParams;
};

const callback = async (req: IReq, res: IRes) => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const code = req.query.code || null;
  const redirectUri = `${process.env.BASE_URL}:${process.env.PORT}/callback`;

  await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: {
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64')}`,
    },
  }).then((response) => {
    if (response.status === 200) {
      token = response.data.access_token;
    }
  });
};

const getOneAlbum = async (id: string) => {
  const result = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await result.json();
  return data;
};

const getSingleTrack = async (id: string) => {
  const result = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await result.json();
  return data;
};

// for home:
const getGenres = async () => {
  const offset = 0;
  const limit = 20;
  const result = await fetch(
    `https://api.spotify.com/v1/browse/categories?country=US&locale=sv_se&offset=${offset}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data.categories.items;
};

const getSingleCategory = async (genreId: string) => {
  const result = await fetch(
    `https://api.spotify.com/v1/browse/categories/${genreId}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await result.json();
  return data;
};

const getPlaylistFromGenre = async (genreId: string) => {
  const limit = 10;
  const result = await fetch(
    `https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await result.json();
  return data.playlists.items;
};

// finish home

const getNewReleases = async () => {
  const offset = 0;
  const limit = 20;
  const result = await fetch(
    `https://api.spotify.com/v1/browse/new-releases?country=SE&limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await result.json();
  return data.albums.items;
};

const getUserSavedAlbums = async () => {
  const limit = 50;
  const offset = 0;
  const result = await fetch(
    `https://api.spotify.com/v1/me/albums?limit=${limit}&offset=${offset}&market=ES`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data;
};

const getFollowedArtist = async () => {
  const type = 'artist';
  const limit = 50;
  const after = '0I2XqVXqHScXjHhk6AYYRe'; // ?????
  const result = await fetch(
    `https://api.spotify.com/v1/me/following?type=${type}&after=${after}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data.artists;
};

const getUserPlaylists = async () => {
  const offset = 0;
  const limit = 50;
  const result = await fetch(
    `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data.items;
};

const getUserTopItems = async (type: string) => {
  const offset = 0;
  const limit = 20;
  const time = 'medium_term';
  const result = await fetch(
    `https://api.spotify.com/v1/me/top/${type}?time_range=${time}&limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data;
};

const getUserSavedTracks = async () => {
  const offset = 0;
  const limit = 50;
  const result = await fetch(
    `https://api.spotify.com/v1/me/tracks?market=ES&limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data;
};

const checkUserSavedTracks = async (ids: string) => {
  const result = await fetch(
    `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data;
};

const getRecommendations = async () => {
  const track = '0c6xIDDpzE81m2q797ordA';
  const limit = 20;
  const recomendation = 'dance%2Ccountry';
  const artist = '4NHQUGzhtTLFvgF5SZesLK';
  const result = await fetch(
    `https://api.spotify.com/v1/recommendations?limit=${limit}&market=ES&seed_artists=${artist}&seed_genres=${recomendation}&seed_tracks=${track}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await result.json();
  return data.tracks;
};

// profile:

const getCurrentUser = async () => {
  const result = await fetch(`https://api.spotify.com/v1/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await result.json();
  return data;
};

//

const removeUserSavedTrack = async (id: string) => {
  const result = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

const getPlaylist = async (id: string) => {
  const result = await fetch(
    `https://api.spotify.com/v1/playlists/${id}?market=ES`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await result.json();
  return data;
};

const getArtist = async (id: string) => {
  const result = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await result.json();
  return data;
};

const getArtistTopTracks = async (id: string) => {
  const result = await fetch(
    `https://api.spotify.com/v1/artists/${id}/top-tracks?market=ES`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data;
};

const getArtistAlbums = async (id: string, limit: number) => {
  const offset = 0;
  const result = await fetch(
    `https://api.spotify.com/v1/artists/${id}/albums?&market=ES&limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data;
};

const getRelatedArtists = async (id: string) => {
  const result = await fetch(
    `https://api.spotify.com/v1/artists/${id}/related-artists`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data;
};

const getAlbumTracks = async (id: string) => {
  const limit = 50;
  const offset = 0;
  const result = await fetch(
    `https://api.spotify.com/v1/albums/${id}/tracks?market=ES&limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data;
};

const getSeveralAlbums = async (ids: string) => {
  const result = await fetch(
    `https://api.spotify.com/v1/albums?ids=${ids}&market=ES`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data;
};

const checkUserSavedAlbums = async (ids: string) => {
  const result = await fetch(
    `https://api.spotify.com/v1/me/albums/contains?ids=${ids}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await result.json();
  return data;
};

const removeUserSavedAlbums = async (ids: string) => {
  const result = await fetch(
    `https://api.spotify.com/v1/me/albums?ids=${ids}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const saveAlbumsForUser = async (ids: string) => {
  const result = await fetch(
    `https://api.spotify.com/v1/me/albums?ids=${ids}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const saveTracksForUser = async (ids: string) => {
  const result = await fetch(
    `https://api.spotify.com/v1/me/tracks?ids=${ids}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const searchForItem = async (search: string) => {
  const offset = 0;
  const limit = 20;
  const type = 'track,artist';
  const result = await fetch(
    `https://api.spotify.com/v1/search?q=${search}&type=${type}&market=ES&limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = result.json();
  return data;
};

const checkUserFollowArtist = async (ids: string) => {
  const type = 'artist';
  const result = await fetch(
    `https://api.spotify.com/v1/me/following/contains?type=${type}&ids=${ids}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await result.json();
  return data;
};

const followArtist = async (ids: string) => {
  const type = 'artist';
  const result = await fetch(
    `https://api.spotify.com/v1/me/following?type=${type}&ids=${ids}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const unfollowArtist = async (ids: string) => {
  const type = 'artist';
  const result = await fetch(
    `https://api.spotify.com/v1/me/following?type=${type}&ids=${ids}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const createPlaylist = async (userId: string, numberPlaylist: number) => {
  const result = await axios({
    method: 'POST',
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: {
      name: `New playlist ??? ${numberPlaylist}`,
      description: 'New playlist',
      public: false,
    },
  });

  const data = result.data;
  return data;
};

const startPlayback = async (
  uris: string[],
  offset: string,
  positionMs: number = 0,
  deviceIdFromDb: string
) => {
  //const uris = startPlayback //? undefined : [offset];
  const result = await axios({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/play?device_id=${deviceIdFromDb}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: {
      uris,
      offset: { uri: offset },
      position_ms: positionMs,
    },
  });

  const data = result.data;

  return data;
};

const deletePlaylist = async (playlistId: string) => {
  const result = await axios({
    method: 'DELETE',
    url: `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = result.data;
  return data;
};

const startPlaylistPlayback = async (uri: string, positionMs: number) => {
  const result = await axios({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/volume`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: {
      context_uri: uri,
      position_ms: positionMs,
    },
  });

  const data = result.data;

  return data;
};

const changeVolume = async (volumePercent: number, deviceId: string) => {
  const result = await axios({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/volume?volume_percent=${volumePercent}&device_id=${deviceId}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return result;
};

const pausePlayback = async (deviceId: string) => {
  const result = await axios({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = result.data;
  return data;
};

const getCurrentlyTrack = async () => {
  const result = await axios({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player/currently-playing?market=ES',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = result.data;
  return data;
};

const skipToNextTrack = async (deviceId: string) => {
  await axios({
    method: 'POST',
    url: `https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

const skipToPreviousTrack = async () => {
  const result = await axios({
    method: 'POST',
    url: 'https://api.spotify.com/v1/me/player/previous',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

const getToken = async () => {
  return token;
};

const setDeviceId = async (newDeviceId: string) => {
  //await User.findByIdAndUpdate(req.user.id)
  console.log('??????????');
};

const changeDevice = async (deviceId: string) => {
  const result = await axios({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: {
      device_ids: [deviceId],
      play: false,
    },
  });
};

const changePlaylistDetail = async (id: string, newName: string) => {
  const result = await axios({
    method: 'PUT',
    url: `https://api.spotify.com/v1/playlists/${id}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: {
      name: newName,
      description: '0',
      public: false,
    },
  });
};

const addTracksToPlaylist = async (id: string, trackUri: string) => {
  const result = await axios({
    method: 'POST',
    url: `https://api.spotify.com/v1/playlists/${id}/tracks?uris=${trackUri}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

const removeTracksFromPlaylist = async (id: string, trackUri: string) => {
  const result = await axios({
    method: 'DELETE',
    url: `https://api.spotify.com/v1/playlists/${id}/tracks`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: {
      tracks: [{ uri: trackUri }],
    },
  });
};

const getRecentlyPlayedTracks = async () => {
  const limit = 20;
  const result = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await result.json();
  return data.items;
};

export default {
  getOneAlbum,
  getGenres,
  getUserSavedAlbums,
  getFollowedArtist,
  getUserPlaylists,
  getUserSavedTracks,
  checkUserSavedTracks,
  getPlaylistFromGenre,
  getPlaylist,
  getArtist,
  getArtistTopTracks,
  getArtistAlbums,
  getRelatedArtists,
  getAlbumTracks,
  getSeveralAlbums,
  checkUserSavedAlbums,
  removeUserSavedAlbums,
  saveAlbumsForUser,
  checkUserFollowArtist,
  followArtist,
  unfollowArtist,
  login,
  callback,
  getUserTopItems,
  getNewReleases,
  getRecommendations,
  removeUserSavedTrack,
  getCurrentUser,
  getSingleTrack,
  searchForItem,
  saveTracksForUser,
  createPlaylist,
  startPlayback,
  startPlaylistPlayback,
  pausePlayback,
  getToken,
  changeDevice,
  getCurrentlyTrack,
  skipToNextTrack,
  skipToPreviousTrack,
  setDeviceId,
  deletePlaylist,
  changePlaylistDetail,
  addTracksToPlaylist,
  removeTracksFromPlaylist,
  getRecentlyPlayedTracks,
  changeVolume,
};
