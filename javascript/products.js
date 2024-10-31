fetch("../data/products.json")
  .then((response) => response.json())
  .then((json) => {
    productsDOM.products = JSON.parse(json).map((product) => {
      return new Product(
        product.id,
        product.title,
        product.desc,
        product.img,
        product.price,
        product.category
      );
    });
    productsDOM.showProducts();
    cart.showLocalStorage();
  });

fetch("../data/categories.json")
  .then((response) => response.json())
  .then((json) => {
    productsDOM.categories = JSON.parse(json).map((category) => {
      return new Category(category);
    });
    productsDOM.showCategoryButton();
  });

class Product {
  constructor(id, title, desc, img, price, category) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.img = img;
    this.price = price;
    this.category = category;
  }

  formatPrice() {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    });
    return formatter.format(this.price);
  }
}

class Category {
  constructor(name) {
    this.name = name;
  }
}

class ProductsDOM {
  products = [];
  categories = [];

  constructor() {
    this.categoryContainerDom = document.querySelector(
      ".js-productCategoryContainer"
    );
    this.productContainerDom = document.querySelector(".js-productContainer");
  }

  showCategoryButton() {
    const categoryButtonHTML = this.categories
      .map((category) => {
        return `<button type="button" class="product__category js-productCategory ${
          category.name === "all" ? "is-active" : ""
        }" aria-label="${category.name}" data-name="${category.name}">${
          category.name
        }</button>`;
      })
      .join("");
    this.categoryContainerDom.innerHTML = categoryButtonHTML;
    this.setCategoryButtonClickEvent();
  }

  showProducts() {
    const productsHTML = this.products
      .map((product) => {
        return `<div class="product__item js-productItem" data-id="${
          product.id
        }" data-category="${product.category}">
              <img class="product__item__image" src="${product.img}" alt="${
          product.title
        }">
              <div class="product__item__detail">
                <div class="product__item__detail__title">${product.title}</div>
                <div class="product__item__detail__desc">
                  ${product.desc}
                </div>
                <div class="product__item__detail__price js-productItemPrice">
                  ${product.formatPrice()}
                </div>
              </div>
              <button class="button button--primary js-productItemButton" type="button" aria-label="Add to Cart">
                Add to Cart
              </button>
            </div>`;
      })
      .join("");
    this.productContainerDom.innerHTML = productsHTML;

    const productButtonDoms = this.productContainerDom.querySelectorAll(
      ".js-productItemButton"
    );
    productButtonDoms.forEach((productButtonDom) => {
      const productDom = productButtonDom.parentElement;
      const product = this.products.find(
        (product) => +product.id === +productDom.dataset.id
      );
      product.dom = new ProductDOM(product, productDom, productButtonDom);
      product.dom.addEventClick();
    });
  }

  setCategoryButtonClickEvent() {
    const productCategoryDoms = this.categoryContainerDom.querySelectorAll(
      ".js-productCategory"
    );
    productCategoryDoms.forEach((dom) => {
      dom.addEventListener("click", (event) => {
        this.changeCategoryActive(productCategoryDoms, event);
        this.showProductsOfCategory(event);
      });
    });
  }

  changeCategoryActive(productCategoryDoms, event) {
    productCategoryDoms.forEach((dom) => {
      if (dom === event.currentTarget) {
        dom.classList.add("is-active");
      } else {
        dom.classList.remove("is-active");
      }
    });
  }

  showProductsOfCategory(event) {
    const productDoms =
      this.productContainerDom.querySelectorAll(".js-productItem");
    const categorySelected = event.currentTarget.dataset.name;
    if (categorySelected === "all") {
      productDoms.forEach((product) => (product.style.display = "grid"));
    } else {
      productDoms.forEach((product) => {
        if (product.dataset.category === categorySelected) {
          product.style.display = "grid";
        } else {
          product.style.display = "none";
        }
      });
    }
  }
}

class ProductDOM {
  constructor(product, productDom, buttonDom) {
    this.product = product;
    this.productDom = productDom;
    this.buttonDom = buttonDom;
  }

  addEventClick() {
    this.buttonDom.addEventListener("click", () => {
      this.addToCart();
      this.transformAddToCartButtonToQuantityButton();
    });
  }

  addToCart() {
    cart.addProduct(this.product);
  }

  transformAddToCartButtonToQuantityButton() {
    this.buttonDom.outerHTML = `<div class="product__quantity">
                  <button type="button" aria-label="Product Decrease" class="product__quantity__item product__quantity__item--decrease js-quantityButton js-quantityDecreaseButton">
                    <svg class="icon icon-minus">
                      <use xlink:href="#icon-minus"></use>
                    </svg>
                  </button>
                  <input type="number" class="product__quantity__item product__quantity__item--input js-quantityInput" max="7" value="1">
                  <button type="button" aria-label="Product Increase" class="product__quantity__item product__quantity__item--increase js-quantityButton js-quantityIncreaseButton">
                    <svg class="icon icon-plus">
                      <use xlink:href="#icon-plus"></use>
                    </svg>
                  </button>
                </div>`;
    const quantityIncreaseButtonDom = this.productDom.querySelector(
      ".js-quantityIncreaseButton"
    );

    const quantityDecreaseButtonDom = this.productDom.querySelector(
      ".js-quantityDecreaseButton"
    );

    this.increaseQuantityButton(quantityIncreaseButtonDom);
    this.decreaseQuantityButton(quantityDecreaseButtonDom);
  }

  updateCartQuantity(type) {
    cart.updateQuantity(this.product, type, 1);
  }

  increaseQuantityButton(quantityIncreaseButtonDom) {
    quantityIncreaseButtonDom.addEventListener("click", () => {
      const currentQuantity = this.getCurrentQuantity();
      this.setQuantity(currentQuantity + 1);
      this.updateCartQuantity("increase");
    });
  }

  getCurrentQuantity() {
    return +this.productDom.querySelector(".js-quantityInput").value;
  }

  removeProductFromCart() {
    cart.removeProduct(this.product);
  }

  setQuantity(quantity) {
    this.productDom.querySelector(".js-quantityInput").value = quantity;
  }

  decreaseQuantityButton(quantityDecreaseButtonDom) {
    quantityDecreaseButtonDom.addEventListener("click", () => {
      const currentQuantity = this.getCurrentQuantity();
      if (currentQuantity === 1) {
        quantityDecreaseButtonDom.parentElement.outerHTML = `<button class="button button--primary js-productItemButton" type="button" aria-label="Add to Cart">
                Add to Cart
              </button>`;
        this.buttonDom = this.productDom.querySelector(".js-productItemButton");
        this.addEventClick();
        this.removeProductFromCart();
      } else {
        this.setQuantity(currentQuantity - 1);
        this.updateCartQuantity("decrease");
      }
    });
  }
}

class Cart {
  products = [];
  LOCAL_STORAGE_KEY = "CART";

  constructor() {
    this.cartDom = new CartDom(this);
  }

  addProduct(product) {
    product.quantity = 1;
    this.products.push(product);
    this.cartDom.renderCart();
    this.saveLocalStorage();
  }

  removeProduct(product) {
    const productCartIndex = this.products.findIndex(
      (p) => p.id === product.id
    );
    this.products.splice(productCartIndex, 1);
    this.cartDom.renderCart();
    this.saveLocalStorage();
  }

  updateQuantity(product, type, quantity = 1) {
    const productCart = this.products.find((p) => p.id === product.id);
    if (type === "increase") {
      productCart.quantity += quantity;
    } else {
      productCart.quantity -= quantity;
    }
    this.cartDom.renderCart();
    this.saveLocalStorage();
  }

  totalCount() {
    return this.products.length;
  }

  totalPrice() {
    const price = this.products.reduce((total, product) => {
      return total + product.quantity * product.price;
    }, 0);
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    });
    return formatter.format(price);
  }

  totalQuantity() {
    const quantity = this.products.reduce((total, product) => {
      return total + product.quantity;
    }, 0);

    return quantity;
  }

  isEmpty() {
    return this.products.length === 0;
  }

  saveLocalStorage() {
    localStorage.setItem(
      this.LOCAL_STORAGE_KEY,
      JSON.stringify(
        this.products.map((product) => {
          return {
            id: product.id,
            quantity: product.quantity,
          };
        })
      )
    );
  }

  showLocalStorage() {
    const storedProducts = JSON.parse(
      localStorage.getItem(this.LOCAL_STORAGE_KEY)
    );

    storedProducts.forEach((storedProduct) => {
      const product = productsDOM.products.find(
        (product) => product.id === storedProduct.id
      );
      product.dom.transformAddToCartButtonToQuantityButton();
      product.dom.addToCart();

      if (storedProduct.quantity <= 1) {
        return;
      }

      product.dom.setQuantity(storedProduct.quantity);
      this.updateQuantity(product, "increase", storedProduct.quantity - 1);
    });
  }
}

class CartDom {
  constructor(cart) {
    this.cart = cart;
    this.cartContainerDom = document.querySelector(".js-cartProductContainer");
    this.cartEmptyDom = document.querySelector(".js-cartEmpty");
    this.cartTotalDom = document.querySelector(".js-cartTotal");
    this.cartQuantityDom = document.querySelector(".js-cartQuantity");
    this.renderCart();
  }

  renderCart() {
    const headerCartTitleDom = document.querySelector(".js-headerCartTitle");
    headerCartTitleDom.textContent = `Cart(${this.cart.totalCount()})`;
    if (this.checkIsEmpty()) {
      return;
    }
    this.showCartProducts();
    this.cartTotalDom.innerHTML = `
      <div class="cart__total__title">Total Price:</div>
      <div class="cart__total__price">${this.cart.totalPrice()}</div>
    `;
    this.cartQuantityDom.innerHTML = `
      <div class="cart__total__title">Product Quantity:</div>
      <div class="cart__total__quantity">${this.cart.totalQuantity()} products</div>
    `;
    this.dispatchQuantityButton();
  }

  dispatchQuantityButton() {
    const cartProductDoms =
      this.cartContainerDom.querySelectorAll(".js-cartProduct");
    cartProductDoms.forEach((cartProductDom) => {
      const quantityIncreaseButton = cartProductDom.querySelector(
        ".js-quantityIncreaseButton"
      );
      const quantityDecreaseButton = cartProductDom.querySelector(
        ".js-quantityDecreaseButton"
      );
      const productItem = document.querySelector(
        `.js-productItem[data-id="${cartProductDom.dataset.id}"]`
      );
      quantityIncreaseButton.addEventListener("click", () => {
        productItem
          .querySelector(".js-quantityIncreaseButton")
          .dispatchEvent(new Event("click"));
      });
      quantityDecreaseButton.addEventListener("click", () => {
        productItem
          .querySelector(".js-quantityDecreaseButton")
          .dispatchEvent(new Event("click"));
      });
    });
  }

  showCartProducts() {
    this.cartContainerDom.innerHTML = this.cart.products
      .map((product) => {
        return `<div class="cart__product js-cartProduct" data-id="${
          product.id
        }">
            <div class="cart__product-top-wrapper">
              <figure>
                <img src="${
                  product.img
                }" alt="Product Image" class="cart__product__image">
              </figure>
              <div class="cart__product__content">
                <div class="cart__product__content__title">${
                  product.title
                }</div>
                <div class="cart__product__content__desc">${product.desc}</div>
                <div class="product__quantity">
                  <button type="button" aria-label="Product Decrease" class="product__quantity__item product__quantity__item--decrease js-quantityButton js-quantityDecreaseButton">
                    <svg class="icon icon-minus">
                      <use xlink:href="#icon-minus"></use>
                    </svg>
                  </button>
                  <input type="number" class="product__quantity__item product__quantity__item--input js-quantityInput" max="7" value="${
                    product.quantity
                  }">
                  <button type="button" aria-label="Product Increase" class="product__quantity__item product__quantity__item--increase js-quantityButton js-quantityIncreaseButton">
                    <svg class="icon icon-plus">
                      <use xlink:href="#icon-plus"></use>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="cart__product__price js-cartProductPrice">${product.formatPrice()}</div>
          </div>`;
      })
      .join("");
  }

  checkIsEmpty() {
    if (this.cart.isEmpty()) {
      this.cartEmptyDom.style.display = "block";
      this.cartTotalDom.innerHTML = "";
      this.cartQuantityDom.innerHTML = "";
      this.cartContainerDom.innerHTML = "";
      return true;
    } else {
      this.cartEmptyDom.style.display = "none";
      return false;
    }
  }
}

const productsDOM = new ProductsDOM();

const cart = new Cart();

console.log(productsDOM);
