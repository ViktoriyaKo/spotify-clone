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
  const token = await getToken();
  initial.test = token;
  const result = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await result.json();
  console.log(data);
  return data;
};

const getGenres = async () => {
  const token = await getToken();
  const result = await fetch(
    `https://api.spotify.com/v1/browse/categories?locale=sv_US`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await result.json();
  return data.categories.items;
};

const getSingleCategory = async (genreId) => {
  const token = await getToken();
  const result = await fetch(
    `https://api.spotify.com/v1/browse/categories/${genreId}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await result.json();
  console.log(data);
  return data;
};

// example: dinner
// getPlaylistFromGenre('dinner');
const getPlaylistFromGenre = async (genreId) => {
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
  const token = await getToken();
  const result = await fetch(`https://api.spotify.com/v1/browse/new-releases`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await result.json();
  return data.albums.items;
};

export default { getOneAlbum, getGenres };
