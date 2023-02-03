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
