// const slideItems = [
//   {
//     img: "../images/slider-1.png",
//   },
//   {
//     img: "../images/slider-2.png",
//   },
//   {
//     img: "../images/slider-3.png",
//   },
// ];

// class Slide {
//   constructor(img) {
//     this.img = img;
//   }
// }

// const slides = slideItems.map((slide) => {
//   return new Slide(slide.img);
// });

// console.log(slides);

// class Slider {
//   constructor(slides) {
//     this.slides = slides;
//     this.slideItemContainer = document.querySelector(".js-sliderItemContainer");
//   }

//   init() {
//     const slideItemHTML = this.slides
//       .map((slide, index) => {
//         let position = "next";
//         if (index === 0) {
//           position = "active";
//         }
//         if (index === this.slides.length - 1) {
//           position = "last";
//         }
//         if (this.slides.length <= 1) {
//           position = "active";
//         }
//         return `<a href="#" class="slider__item js-sliderItem ${position}">
//                   <img class="slider__item__image" src="${slide.img}" alt="Shopping">
//                 &gt;</a>`;
//       })
//       .join("");

//     this.slideItemContainer.innerHTML = slideItemHTML;

//     const buttonPrev = document.querySelector(".js-btnPrev");
//     const buttonNext = document.querySelector(".js-btnNext");

//     buttonNext.addEventListener("click", () => {
//       this.changeSlider();
//     });

//     buttonPrev.addEventListener("click", () => {
//       this.changeSlider("prev");
//     });
//   }

//   changeSlider(type) {
//     const active = document.querySelector(".active");
//     const last = document.querySelector(".last");
//     let next = active.nextElementSibling;
//     if (!next) {
//       next = this.slideItemContainer.firstElementChild;
//     }
//     active.classList.remove("active");
//     last.classList.remove("last");
//     next.classList.remove("next");

//     if (type === "prev") {
//       active.classList.add("next");
//       last.classList.add("active");
//       let next = last.previousElementSibling;
//       if (!next) {
//         next = this.slideItemContainer.lastElementChild;
//       }
//       next.classList.remove("next");
//       next.classList.add("last");
//       return;
//     }

//     active.classList.add("last");
//     next.classList.add("active");
//     last.classList.add("next");
//   }
// }

// const slider = new Slider(slides);

// console.log(slider.init());
