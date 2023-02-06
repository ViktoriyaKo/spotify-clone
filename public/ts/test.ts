import { login } from './login';

console.log('hi spoty');
// DOM ELEMENTS
const loginForm = document.querySelector('.btnSignIn');
console.log('loginForm: ', loginForm);
if (loginForm) {
  loginForm.addEventListener('click', (e) => {
    console.log('btn clicked');
    e.preventDefault();
    const email = document.querySelector('.inputEmail').value as string;
    const password = document.querySelector('.inputPsw').value as string;
    login(email, password);
  });
}
