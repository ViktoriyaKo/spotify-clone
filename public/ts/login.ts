import axios from 'axios';

const error1 = document.querySelector('.error1');
const error2 = document.querySelector('.error2');

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
  } catch (err: any) {
    if (err.response.status === 401) {
      if (error2) {
        error2.classList.remove('hidden');
        error2.innerHTML = 'Incorrect email or password';
      }
    }
    console.log(err);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 300);
    }
  } catch (err: any) {
    console.log('error ', err);
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
      if (error1) {
        error1.classList.add('hidden');
      }
      window.setTimeout(() => {
        location.assign('/home');
      }, 300);
    }
  } catch (err: any) {
    if (error1) {
      if (err.response.status === 500) {
        console.log(err);
        error1.classList.remove('hidden');
        error1.innerHTML = 'Incorrect password';
      }
    }
    console.log(err);
  }
};

export const setPhoto = async (data: FormData) => {
  try {
    console.log('photo was sent', data);
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data,
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
  } catch (err: any) {
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
      if (error1) {
        error1.classList.add('hidden');
      }
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
  } catch (err: any) {
    if (error1) {
      console.log(err);
      error1.classList.remove('hidden');
      error1.innerHTML = 'Please enter correct data';
    }
    console.log(err);
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
      const form = document.querySelector(
        '#formChangePassword'
      ) as HTMLFormElement;
      if (error2) {
        error2.classList.add('hidden');
      }
      if (info) {
        info.classList.remove('hidden');
        info.innerHTML =
          '<div class="info"><h3>Your password was updated</h3></div>';
        form.reset();
        setTimeout(() => {
          info.classList.add('hidden');
        }, 2000);
      }
    }
  } catch (err: any) {
    if (err.response.status === 401) {
      if (error2) {
        error2.classList.remove('hidden');
        error2.innerHTML = 'Incorrect your current password';
      }
    }
    if (err.response.status === 500) {
      if (error2) {
        error2.classList.remove('hidden');
        error2.innerHTML = 'Incorrect new password';
      }
    }
    console.log(err);
  }
};
