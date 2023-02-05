import fetch from 'cross-fetch';

const fetchPlaylists = async () => {
  const dataForApi = {
    site: 'https://jsonplaceholder.typicode.com/todos',
    apiKey: 'qdwqwdqwd',
  };
  return fetch(dataForApi.site).then((response) => response.json());
};

export default { fetchPlaylists };
