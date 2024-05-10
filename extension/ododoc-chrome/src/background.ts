import { sendWebSocketMessage } from "./components/textCollect/chromeMessage";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendPageData') {
    sendWebSocketMessage(message.data);
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