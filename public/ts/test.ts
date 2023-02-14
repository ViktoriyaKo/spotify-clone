import { login, signup } from './login';
import './home';
import './account';
import './player';
import './album';
import './favorite';
import './search';

console.log('hello spoty');
// DOM ELEMENTS
const formSignup = document.querySelector('#formSignup') as HTMLFormElement;
const formSignin = document.querySelector('#formSignin') as HTMLFormElement;
const inputEmail = document.querySelector('.inputEmail') as HTMLInputElement;
const inputPsw = document.querySelector('.inputPsw') as HTMLInputElement;

const inputNameUp = document.querySelector('.inputNameUp') as HTMLInputElement;
const inputEmailUp = document.querySelector(
  '.inputEmailUp'
) as HTMLInputElement;

const inputPswUp = document.querySelector(
  '.inputPasswordUp'
) as HTMLInputElement;
const inputPasswordUpConfirm = document.querySelector(
  '.inputPasswordUpConfirm'
) as HTMLInputElement;

if (formSignin) {
  formSignin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = inputEmail.value as string;
    const password = inputPsw.value as string;
    login(email, password);
  });
}

if (formSignup) {
  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = 'user';
    const name = inputNameUp.value as string;
    const email = inputEmailUp.value as string;
    const password = inputPswUp.value as string;
    const passwordConfirm = inputPasswordUpConfirm.value as string;
    signup(name, email, role, password, passwordConfirm);
  });
}
