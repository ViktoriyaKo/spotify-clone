const asideBlock = document.querySelector(".aside-block");
const shadowAside = document.querySelector(".shadow-aside");

document.querySelector(".open-aside").addEventListener("click", () => {
  asideBlock.style.transform = "translateX(0)";
  shadowAside.style.display = "block";
});
shadowAside.addEventListener("click", () => {
  asideBlock.style.transform = "translateX(-100%)";
  shadowAside.style.display = "none";
});

const swiper = new Swiper(".swiper", {
  // Default parameters
  slidesPerView: 1,
  spaceBetween: 10,
  // Responsive breakpoints
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
  },
});
