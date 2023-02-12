import { login, signup } from './login';
import './home';
import './player'
import './album'

console.log('hello spoty');
// DOM ELEMENTS
const loginForm = document.querySelector('.btnSignIn');
const inputEmail = document.querySelector('.inputEmail') as HTMLInputElement;
const inputPsw = document.querySelector('.inputPsw') as HTMLInputElement;
const btnSignUp = document.querySelector('.btnSignUp') as HTMLInputElement;
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

if (loginForm) {
  loginForm.addEventListener('click', () => {
    const email = inputEmail.value as string;
    const password = inputPsw.value as string;
    login(email, password);
  });
}

if (btnSignUp) {
  btnSignUp.addEventListener('click', () => {
    const role = 'user';
    const name = inputNameUp.value as string;
    const email = inputEmailUp.value as string;
    const password = inputPswUp.value as string;
    const passwordConfirm = inputPasswordUpConfirm.value as string;
    signup(name, email, role, password, passwordConfirm);
  });
}
