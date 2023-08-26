/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/checkout/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("prestashop");
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prestashop__WEBPACK_IMPORTED_MODULE_1__);
/**
 * 2007-2017 PrestaShop
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to http://www.prestashop.com for more information.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2017 PrestaShop SA
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */


function setUpCheckout() {
  jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.checkout.termsLink)).on("click", (event) => {
    event.preventDefault();
    let url = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.target).attr("href");
    if (url) {
      url += "?content_only=1";
      jquery__WEBPACK_IMPORTED_MODULE_0___default().get(url, (content) => {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.modal)).find((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.modalContent)).html(jquery__WEBPACK_IMPORTED_MODULE_0___default()(content).find(".page-cms").contents());
      }).fail((resp) => {
        prestashop__WEBPACK_IMPORTED_MODULE_1___default().emit("handleError", { eventType: "clickTerms", resp });
      });
    }
    jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.modal)).modal("show");
  });
  jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.checkout.giftCheckbox)).on("click", () => {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#gift").slideToggle();
  });
}
jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).ready(() => {
  if (jquery__WEBPACK_IMPORTED_MODULE_0___default()("body#checkout").length === 1) {
    setUpCheckout();
  }
  prestashop__WEBPACK_IMPORTED_MODULE_1___default().on("updatedDeliveryForm", (params) => {
    if (typeof params.deliveryOption === "undefined" || params.deliveryOption.length === 0) {
      return;
    }
    jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.checkout.carrierExtraContent)).hide();
    params.deliveryOption.next((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.checkout.carrierExtraContent)).slideDown();
  });
  prestashop__WEBPACK_IMPORTED_MODULE_1___default().on("changedCheckoutStep", (params) => {
    if (typeof params.event.currentTarget !== "undefined") {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(".collapse", params.event.currentTarget).not(".show").not(".collapse .collapse").collapse("show");
    }
  });
});
jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on("change", '.checkout-option input[type="radio"]', (event) => {
  const $target = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget);
  const $block = $target.closest(".checkout-option");
  const $relatedBlocks = $block.parent();
  $relatedBlocks.find(".checkout-option").removeClass("selected");
  $block.addClass("selected");
});
jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on("click", ".js-checkout-step-header", (event) => {
  const stepIdentifier = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget).data("identifier");
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(`#${stepIdentifier}`).addClass("-current");
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(`#content-${stepIdentifier}`).collapse("show").scrollTop();
});


/***/ }),

/***/ "jquery":
/***/ ((module) => {

module.exports = jQuery;

/***/ }),

/***/ "prestashop":
/***/ ((module) => {

module.exports = prestashop;

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
/* harmony import */ var _js_checkout_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./js/checkout/index.js");


})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=checkout.js.map