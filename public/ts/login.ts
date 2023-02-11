import axios from 'axios';

export const login = async (email, password) => {
  try {
    console.log('data was sent', email, password);
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
        console.log('redirecting from front')
        location.assign('/home');
      }, 300);
    }
  } catch (err) {
    console.log('error', err.response.data);
  }
};

export const signup = async (name, email, role, password, passwordConfirm) => {
  try {
    console.log('data was sent', name, email, role, password, passwordConfirm);
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        role,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/home');
      }, 300);
    }
  } catch (err) {
    console.log('error', err.response.data);
  }
};
