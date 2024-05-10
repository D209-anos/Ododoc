/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/textCollect/chromeMessage.ts":
/*!*****************************************************!*\
  !*** ./src/components/textCollect/chromeMessage.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sendChromeMessage: () => (/* binding */ sendChromeMessage),
/* harmony export */   sendWebSocketMessage: () => (/* binding */ sendWebSocketMessage),
/* harmony export */   setupWebSocket: () => (/* binding */ setupWebSocket)
/* harmony export */ });
const sendChromeMessage = (action, data) => {
  chrome.runtime.sendMessage({
    action,
    ...data
  });
};

// 웹소켓
let socket = null;
const setupWebSocket = () => {
  socket = new WebSocket('wss://localhost:18080/process');
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };
  socket.onerror = error => {
    console.error('WebSocket error:', error);
  };
  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };
  return socket;
};
const sendWebSocketMessage = data => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.log('WebSocket is not connected, trying to reconnect...');
    socket = setupWebSocket();
  }
};

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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_textCollect_chromeMessage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/textCollect/chromeMessage */ "./src/components/textCollect/chromeMessage.ts");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendPageData') {
    (0,_components_textCollect_chromeMessage__WEBPACK_IMPORTED_MODULE_0__.sendWebSocketMessage)(message.data);
  }
});

// chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
//     chrome.windows.create({
//       url: chrome.runtime.getURL("window.html"),
//       type: "popup",
//       width: 400,
//       height: 600
//     });
//   });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   switch (message.action) {
//     case 'startTracking':
//       collectStart = true;
//       break;
//     case 'stopTracking':
//       collectStart = false;
//       break;
//     case 'sendText':
//       console.log('Received text:', message.html);
//       break;
//     case 'searchText':
//       console.log('Search text:', message.text);
//       break;
//     default:
//       console.error('Unknown action:', message.action);
//   }
// });
})();

/******/ })()
;
//# sourceMappingURL=background.js.map