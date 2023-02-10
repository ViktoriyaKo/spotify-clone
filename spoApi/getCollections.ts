import fetch from 'cross-fetch';

const getToken = async () => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await result.json();
  return data.access_token;
};

const getOneAlbum = async (id: string) => {
  // const token = await getToken();
  const result = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await result.json();
  return data;
};

// for home:
const getGenres = async () => {
  // const token = await getToken();
  const offset = 0;
  const limit = 20;
  const result = await fetch(
    `https://api.spotify.com/v1/browse/categories?country=US&locale=sv_se&offset=${offset}&limit=${limit}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await result.json();
  return data.categories.items;
};

// const getSingleCategory = async (genreId: string) => {
const token = await getToken();
//   const result = await fetch(
//     `https://api.spotify.com/v1/browse/categories/${genreId}`,
//     {
//       method: 'GET',
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );

//   const data = await result.json();
//   console.log(data);
//   return data;
// };

// getPlaylistFromGenre('dinner');
const getPlaylistFromGenre = async (genreId: string) => {
  // const token = await getToken();
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
  // const token = await getToken();
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
  // const token = await getToken();
  const limit = 50;
  const offset = 5;
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
  // const token = await getToken();
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
  return data.artists.items;
};

const getUserPlaylists = async () => {
  // const token = await getToken();
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
  // const token = process.env.CLIENT_TOKEN;
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
  // const token = process.env.CLIENT_TOKEN;
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

const getRecommendations = async () => {
  // const token = await getToken();
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
  // const token = process.env.CLIENT_TOKEN;
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
  // const token = process.env.CLIENT_TOKEN;
  const result = await fetch(`https://api.spotify.com/v1/me/tracks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await result.json();
  return data;
};

export default {
  getOneAlbum,
  getGenres,
  getUserSavedAlbums,
  getFollowedArtist,
  getUserPlaylists,
  getUserSavedTracks,
  getPlaylistFromGenre,
  getCurrentUser,
  removeUserSavedTrack,
  getUserTopItems,
  getNewReleases,
  getRecommendations,
};
