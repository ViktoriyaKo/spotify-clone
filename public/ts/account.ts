import { setPhoto } from './login';
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
const inputChangeName = document.querySelector(
  '.inputChangeName'
) as HTMLInputElement;
const inputChangeEmail = document.querySelector(
  '.inputChangeEmail'
) as HTMLInputElement;

const inputPhoto = document.querySelector('#photo') as HTMLInputElement;
const imgPreview = document.querySelector('.img-preview') as HTMLImageElement;

if (inputPhoto) {
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
      // const formData = new FormData();
      // formData.append('photo', inputPhoto.files[0])
      console.log(inputPhoto.files[0]);
      setPhoto(inputPhoto.files[0]);
    }
  });
}

// checkboxAccount.addEventListener('change', () => {
//   btnSetProfile.disabled = !checkboxAccount.checked;
// });
// btnSetProfile.addEventListener('click', () => {
//   const name = inputChangeName.value as string;
//   const email = inputChangeEmail.value as string;
//   changeAccount(name, email);
// });
