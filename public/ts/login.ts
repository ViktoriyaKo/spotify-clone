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
      const info = document.querySelector('.wrapper-info');
      if (info) {
        info.classList.remove('hidden');
        info.innerHTML = '<div class="info"><h3>Your photo is saved</h3></div>';
        setTimeout(() => {
          info.classList.add('hidden');
        }, 2000);
      }
    }
  } catch (err) {
    console.log('error', err.response.data);
  }
};

export const changeAccount = async (name: string, email: string) => {
  try {
    console.log('data was sent', name, email);
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });
    if (res.data.status === 'success') {
      const info = document.querySelector('.wrapper-info');
      const form = document.querySelector('#formChangeData') as HTMLFormElement;
      if (info && form) {
        info.classList.remove('hidden');
        info.innerHTML =
          '<div class="info"><h3>Your data was updated</h3></div>';
        setTimeout(() => {
          info.classList.add('hidden');
          form.reset();
        }, 2000);
      }
    }
  } catch (err) {
    console.log('error', err.response.data);
  }
};

export const changePassword = async (
  currentPsw: string,
  newPsw: string,
  repeatNewPsw: string
) => {
  try {
    console.log('password was sent', currentPsw, newPsw, repeatNewPsw);
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent: currentPsw,
        password: newPsw,
        passwordConfirm: repeatNewPsw,
      },
    });
    if (res.data.status === 'success') {
      const info = document.querySelector('.wrapper-info');
      if (info) {
        info.classList.remove('hidden');
        info.innerHTML =
          '<div class="info"><h3>Your password was updated</h3></div>';
        setTimeout(() => {
          info.classList.add('hidden');
        }, 2000);
      }
    }
  } catch (err) {
    console.log('error', err.response.data);
  }
};
