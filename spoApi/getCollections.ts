import fetch from 'cross-fetch';
import querystring from 'querystring';
import axios  from 'axios';
import { IReq, IRes } from '../environment';

let token: string;

const generateRandomString = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const login = async () => {
  const clientId = process.env.CLIENT_ID;
  const scope = 'user-read-private user-read-email ugc-image-upload user-library-read user-follow-read user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-read-playback-position user-top-read user-read-recently-played user-library-modify user-read-email user-read-private';
  const redirectUri = 'http://localhost:7999/callback';

  const state = generateRandomString(16);

  const queryParams = {
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: scope,
  };

  return queryParams;
}

const callback = async (req: IReq, res: IRes) => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const code = req.query.code || null;
  const redirectUri = 'http://localhost:7999/callback';

  await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: {
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
    })
    .then(response => {
      if (response.status === 200) {
        token = response.data.access_token;
      }
    })
}

const getOneAlbum = async (id: string) => {
  const result = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await result.json();
  return data;
};

const getGenres = async () => {
  console.log(token)
  const result = await fetch(
    `https://api.spotify.com/v1/browse/categories?country=SE&locale=sv_SE&limit=10&offset=5`,
    {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}` },
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

// example: dinner
// getPlaylistFromGenre('dinner');
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

const getNewReleases = async () => {
  // Default value: 20
  const result = await fetch(`https://api.spotify.com/v1/browse/new-releases`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await result.json();
  return data.albums.items;
};

const getUserSavedAlbums = async ()=> {
  const limit = 50; 
  const offset = 5;
  const result = await fetch(`https://api.spotify.com/v1/me/albums?limit=${limit}&offset=${offset}&market=ES`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await result.json();
  return data;
}

const getFollowedArtist = async ()=> {
  const type = 'artist'; 
  const limit = 50;
  const after = '0I2XqVXqHScXjHhk6AYYRe'; // ?????
  const result = await fetch(`https://api.spotify.com/v1/me/following?type=${type}&after=${after}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await result.json();
  return data.artists.items;
}

const getUserPlaylists = async ()=> {
  const offset = 0;
  const limit = 50;
  const result = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await result.json();
  return data.items;
}

const getUserSavedTracks = async () => {
  const offset = 0;
  const limit = 50;
  const result = await fetch(`https://api.spotify.com/v1/me/tracks?market=ES&limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await result.json();
  return data;
}

export default { 
  getOneAlbum, 
  getGenres, 
  getUserSavedAlbums, 
  getFollowedArtist, 
  getUserPlaylists,
  getUserSavedTracks,
  login,
  callback
};
