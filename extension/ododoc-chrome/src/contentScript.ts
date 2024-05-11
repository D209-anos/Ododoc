export {};

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
    data: { url, pageHTML }
  });
}

function collectPageText() {
    const url = window.location.href;
    if (!url.includes("https://www.google.com/search?")) {
      const pageHTML = document.documentElement.innerHTML;
      chrome.runtime.sendMessage({ action: "sendText", html: pageHTML });
    } else {
      const searchText = document.title;
      chrome.runtime.sendMessage({ action: "searchText", text: searchText });
    }
  }
  
  collectPageText();