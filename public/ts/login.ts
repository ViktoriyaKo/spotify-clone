import axios from 'axios';

export const login = async (email: string, password: string) => {
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
        console.log('redirecting from front');
        location.assign('/home');
      }, 300);
    }
  } catch (err) {
    console.log('error', err.response.data);
  }
};

export const signup = async (
  name: string,
  email: string,
  role: string,
  password: string,
  passwordConfirm: string
) => {
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

export const setPhoto = async (photo) => {
  try {
    console.log('photo was sent', photo);
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: {
        photo,
      },
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/profile/account');
      }, 300);
    }
  } catch (err) {
    console.log('error', err.response.data);
  }
};
