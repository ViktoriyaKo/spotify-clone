import fetch from 'cross-fetch';

const getToken = async () => {
  const clientId = process.env.CLIENT_ID;
  console.log(clientId)
  const clientSecret = process.env.CLIENT_SECRET;
  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await result.json();
  return data.access_token;
};

const getOneAlbum = async (id: string) => {
  const token = await getToken();
  const result = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await result.json();
  console.log(data)
  return data;
};


export default { getOneAlbum };
