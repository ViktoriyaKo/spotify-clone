import axios from 'axios';

const login = async (email, password) => {
  try {
    console.log('testetstest')
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log('error', err.response.data.message);
  }
};

export default login
