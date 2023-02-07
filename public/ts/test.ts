import login from './login';
import './home';

console.log('hello spoty');
// DOM ELEMENTS
const loginForm = document.querySelector('.btnSignIn');
const inputEmail = document.querySelector('.inputEmail') as HTMLInputElement;
const inputPsw = document.querySelector('.inputPsw') as HTMLInputElement;
if (loginForm) {
  loginForm.addEventListener('click', () => {
    const email = inputEmail.value as string;
    const password = inputPsw.value as string;
    login(email, password);
  });
}
