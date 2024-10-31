const headerButtonMenu = document.querySelector(".js-headerButtonMenu");
const header = document.querySelector(".js-header");
const headerButtonCart = document.querySelector(".js-headerButtonCart");
const cartCloseButton = document.querySelector(".js-cartCloseButton");
const headerCart = document.querySelector(".js-cart");

headerButtonMenu.addEventListener("click", () =>
  header.classList.toggle("is-show")
);

headerButtonCart.addEventListener("click", () =>
  headerCart.classList.add("is-show")
);
cartCloseButton.addEventListener("click", () =>
  headerCart.classList.remove("is-show")
);
