import { login } from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.btnSignIn');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('.inputEmail').value as string;
    const password = document.getElementById('password').value as string;
    login(email, password);
  });
}
