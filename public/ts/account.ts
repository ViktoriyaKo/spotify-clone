import { setPhoto, changeAccount, changePassword } from './login';
// DOM:
const checkboxAccount = document.querySelector(
  '#flexCheckDefault'
) as HTMLInputElement;
const btnSetProfile = document.querySelector(
  '.btn-set-profile'
) as HTMLInputElement;
const btnSetPhoto = document.querySelector(
  '.btn-set-photo'
) as HTMLInputElement;
const btnSetPassword = document.querySelector(
  '.btn-set-password'
) as HTMLInputElement;
const inputChangeName = document.querySelector(
  '.inputChangeName'
) as HTMLInputElement;
const inputChangeEmail = document.querySelector(
  '.inputChangeEmail'
) as HTMLInputElement;

const inputPhoto = document.querySelector('#photo') as HTMLInputElement;
const imgPreview = document.querySelector('.img-preview') as HTMLImageElement;
const formPhoto = document.querySelector('#formPhoto') as HTMLFormElement;
const formChangeData = document.querySelector(
  '#formChangeData'
) as HTMLFormElement;
const formChangePassword = document.querySelector(
  '#formChangePassword'
) as HTMLFormElement;
const currentPassword = document.querySelector(
  '#currentPassword'
) as HTMLInputElement;
const newPassword = document.querySelector('#newPassword') as HTMLInputElement;
const repeatNewPassword = document.querySelector(
  '#repeatNewPassword'
) as HTMLInputElement;

if (formPhoto) {
  inputPhoto.addEventListener('change', (el) => {
    imgPreview.onload = () => {
      URL.revokeObjectURL(inputPhoto.src);
    };
    const target = el.target as HTMLInputElement;
    if (target.files) {
      imgPreview.src = URL.createObjectURL(target.files[0]);
      btnSetPhoto.disabled = false;
    }
  });
  btnSetPhoto.addEventListener('click', () => {
    if (inputPhoto.files) {
      const data = new FormData();
      data.append('photo', inputPhoto.files[0]);
      console.log(inputPhoto.files[0].name);
      console.log(data);
      setPhoto(data);
    }
  });
}

if (formChangeData) {
  checkboxAccount.addEventListener('change', () => {
    btnSetProfile.disabled = !checkboxAccount.checked;
  });
  formChangeData.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = inputChangeName.value as string;
    const email = inputChangeEmail.value as string;
    changeAccount(name, email);
  });
}

if (formChangePassword) {
  formChangePassword.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPsw = currentPassword.value as string;
    const newPsw = newPassword.value as string;
    const repeatNewPsw = repeatNewPassword.value as string;
    changePassword(currentPsw, newPsw, repeatNewPsw);
  });
}
