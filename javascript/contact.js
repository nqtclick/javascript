const contactButtons = document.querySelectorAll(".js-contactButton");
const contactContents = document.querySelectorAll(".js-contactContent");
const contactWrapper = document.querySelector(".js-contactWrapper");

window.addEventListener("DOMContentLoaded", () => {
  contactButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const name = e.target.dataset.name;
      contactButtons.forEach((item) => {
        item.classList.remove("is-show");
        e.target.classList.add("is-show");
      });

      contactContents.forEach((item) => {
        if (item.dataset.name === name) {
          item.classList.add("is-show");
        } else {
          item.classList.remove("is-show");
        }
      });
    });
  });
});
