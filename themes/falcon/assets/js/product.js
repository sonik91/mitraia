/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/product/components/ProductGallery.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
class ProductGallery {
  constructor({
    thumbsSliderSelector = ".js-product-thumbs",
    mainSliderSelector = ".js-product-main-images",
    modalSliderSelector = ".js-modal-gallery",
    galleryModalSelector = ".js-product-images-modal"
  } = {}) {
    this.thumbsSliderSelector = thumbsSliderSelector;
    this.mainSliderSelector = mainSliderSelector;
    this.modalSliderSelector = modalSliderSelector;
    this.galleryModalSelector = galleryModalSelector;
    this.mainSliderSwiperInstance = null;
    this.modalSliderSwiperInstance = null;
  }
  init() {
    this.mainSliderSwiperInstance = null;
    this.modalSliderSwiperInstance = null;
    this.initProductImageSlider();
    this.initModalGallerySlider();
  }
  initProductImageSlider() {
    return __async(this, null, function* () {
      const thumbsElem = document.querySelector(this.thumbsSliderSelector);
      const galleryTopElem = document.querySelector(this.mainSliderSelector);
      if (!thumbsElem && !galleryTopElem) {
        return;
      }
      const galleryThumbs = new prestashop.SwiperSlider(thumbsElem, {
        breakpoints: {
          320: {
            slidesPerView: 3
          },
          576: {
            slidesPerView: 4
          }
        },
        watchSlidesVisibility: true,
        watchSlidesProgress: true
      });
      const galleryThumbsInstance = yield galleryThumbs.initSlider();
      const mainSlider = new prestashop.SwiperSlider(galleryTopElem, {
        spaceBetween: 10,
        navigation: {
          nextEl: galleryTopElem.querySelector(".swiper-button-next"),
          prevEl: galleryTopElem.querySelector(".swiper-button-prev")
        },
        thumbs: {
          swiper: galleryThumbsInstance
        }
      });
      const mainSliderInstance = yield mainSlider.initSlider();
      this.mainSliderSwiperInstance = mainSliderInstance;
    });
  }
  initModalGallerySlider() {
    const gallerySliderElem = document.querySelector(this.modalSliderSelector);
    if (!gallerySliderElem) {
      return;
    }
    const handleModalOpen = () => __async(this, null, function* () {
      if (this.modalSliderSwiperInstance) {
        gallerySliderElem.style.opacity = 0;
        setTimeout(() => {
          this.modalSliderSwiperInstance.update();
          this.modalSliderSwiperInstance.slideTo(this.mainSliderSwiperInstance ? this.mainSliderSwiperInstance.activeIndex : 0, 0);
          gallerySliderElem.style.opacity = 1;
        }, 200);
      } else {
        const modalSlider = new prestashop.SwiperSlider(gallerySliderElem, {
          slidesPerView: 1,
          spaceBetween: 10,
          initialSlide: this.mainSliderSwiperInstance ? this.mainSliderSwiperInstance.activeIndex : 0,
          navigation: {
            nextEl: gallerySliderElem.querySelector(".swiper-button-next"),
            prevEl: gallerySliderElem.querySelector(".swiper-button-prev")
          }
        });
        const modalSliderInstance = yield modalSlider.initSlider();
        this.modalSliderSwiperInstance = modalSliderInstance;
      }
    });
    $(this.galleryModalSelector).on("show.bs.modal", handleModalOpen);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductGallery);


/***/ }),

/***/ "./js/product/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _js_product_components_ProductGallery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./js/product/components/ProductGallery.js");


function activateFirstProductTab() {
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(".product-tabs .nav .nav-item:first-child a").tab("show");
}
function handleProductDetailsToggle() {
  const $link = jquery__WEBPACK_IMPORTED_MODULE_0___default()('[href="#product-details"]');
  const $tab = jquery__WEBPACK_IMPORTED_MODULE_0___default()($link.attr("href"));
  if ($tab.length && $link.length && $link.hasClass("active")) {
    $tab.addClass("show active");
  }
}
jquery__WEBPACK_IMPORTED_MODULE_0___default()(() => {
  activateFirstProductTab();
  const gallery = new _js_product_components_ProductGallery__WEBPACK_IMPORTED_MODULE_1__["default"]();
  gallery.init();
  prestashop.on("updatedProductCombination", (event) => {
    gallery.init();
    const { product_add_to_cart: productAddToCart } = event;
    if (productAddToCart) {
      const node = document.createElement("div");
      node.innerHTML = productAddToCart;
      const html = node.querySelector(".js-product-actions-buttons");
      if (html) {
        const productActionsElement = document.querySelector(".js-product-actions-buttons");
        productActionsElement.replaceWith(html);
      }
    }
  });
  prestashop.on("updatedProduct", () => {
    handleProductDetailsToggle();
  });
});


/***/ }),

/***/ "jquery":
/***/ ((module) => {

module.exports = jQuery;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_product_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./js/product/index.js");


})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=product.js.map