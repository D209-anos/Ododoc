import { logout } from "./service/user";


let socket: WebSocket | null = null;
let start: boolean | false = false;
let visitedUrls: Set<string> = new Set();
let accessToken: string | null = null;
let socketReconnect: boolean = true;       // 웹소켓 재연결
let fileId: number = 0;

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.accessToken) {
    accessToken = changes.accessToken.newValue;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "start") {
    console.log("start 명령 백그라운드에서 받음")
    start = true;
    socketReconnect = true;

    if (!socket || socket.readyState === WebSocket.CLOSED) {
        connectWebSocket();
    }
    chrome.tabs.onUpdated.addListener(handleTabUpdate);
  } else if (message.command === "stop") {
    console.log("stop 명령 백그라운드에서 받음")
    socketReconnect = false
    visitedUrls.clear();
    // 웹소켓 연결 종료
    if (socket) {
        socket.close();
        socket = null;
    }
    chrome.tabs.onUpdated.removeListener(handleTabUpdate);
  } else if (message.command === 'fileSelected') {
    fileId = message.fileId;
    chrome.storage.local.set({ selectedFileId: fileId }); 
    console.log("Selected file ID: ", fileId);
  } else if (message.command === 'logout') {
    logout()
  }
});

function getAccessToken(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['accessToken'], (result) => {
      console.log("getAccessToken 실행")
      if (chrome.runtime.lastError) {
        console.error('Failed to retrieve access token:', chrome.runtime.lastError.message);
        resolve(null);
      } else {
        resolve(result.accessToken as string);
      }
    });
  });
}

async function connectWebSocket() {
  try {
    console.log("connectWebSocket 실행")

    if (!accessToken) {
      accessToken = await getAccessToken();
      if (!accessToken) {
        console.error("웹소켓 연결 중 액세스토큰 없음");
        return;
      }
    }

    if (socket !== null && socket.readyState !== WebSocket.CLOSED) {
      return; // 이미 열려있거나 연결 중인 경우 재연결 시도를 방지
    }

    socket = new WebSocket('wss://k10d209.p.ssafy.io/process/ws');
    // socket = new WebSocket('ws://localhost:18080/process/ws');

    socket.onopen = () => {
      console.log("웹소켓 onopen 실행");

      const messageData = {
        sourceApplication: "CHROME",
        accessToken: accessToken,
        connectedFileId: fileId,
        dataType: "SIGNAL",
        content: "웹 소켓 onopen",
        timestamp: new Date()
      };

      const messageJson = JSON.stringify(messageData);
      if (socket) {
        socket.send(messageJson);
      } else {
        console.error("WebSocket connection is not established.");
      }
    };

    socket.onerror = (error: Event) => {
      console.error("WebSocket Error: ", error);
    };

    socket.onclose = async (e) => {
      console.log("WebSocket 연결이 끊어졌습니다.", e);
      if (socketReconnect) {
        console.log("1초 후 재연결을 시도합니다.");
        setTimeout(() => {
          connectWebSocket();
        }, 1000);
      } else {
        console.log("재연결이 금지되어 있으므로 재연결을 시도하지 않습니다.");
      }
    };

  } catch (e) {
    console.error("WebSocket connection failed: ", e);
  }
}

async function handleTabUpdate(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
  console.log("handleTabUpdate 실행")

  if (!accessToken) {
      accessToken = await getAccessToken();
      if (!accessToken) {
        console.error("웹소켓 연결 중 액세스토큰 없음");
        return;
      }
    }
  if (start && tab.url && changeInfo.status === 'complete') {

    // 이전에 방문한 페이지면 함수를 종료
    if (visitedUrls.has(tab.url)) {
      console.log("이미 방문한 URL입니다: ", tab.url);
      return;
    }

    // 새로운 URL 방문 처리
    visitedUrls.add(tab.url);
    console.log("새로운 URL 방문: ", tab.url);

    chrome.scripting.executeScript({
      target: { tabId },
      func: getHtml,
    }, (results) => {
      if (results) {
        // const pageHtml = results[0].result;
        let message = '';

        if (tab.url && tab.url.startsWith('https://www.google.com/search')) {
            const urlParams = new URLSearchParams(new URL(tab.url).search);
            const searchQuery = urlParams.get('q') || 'Unknown Search'; // 검색어 추출
            message = searchQuery
            
            const messageData = {
              sourceApplication: "CHROME",
              accessToken: accessToken,
              connectedFileId: fileId,
              dataType: "KEYWORD",
              content: message,
              timestamp: new Date()
            };
            const messageJson = JSON.stringify(messageData); // 객체를 JSON 문자열로 변환
            console.log("소켓이 열려있나?", socket)
    
            if (socket) { // socket.current가 null이 아닐 때만 send 호출
              console.log("메세지 보냅니다~~")
              socket.send(messageJson); // JSON 문자열을 보냄
            } else {
              console.error("WebSocket connection is not established.");
            }
        } else if (tab.url && tab.url.startsWith('https://chatgpt.com/')) {
          console.log("챗gpt는 수집 안해요");
        } else if (tab.url) {
            const pageUrl = tab.url;
            console.log(pageUrl);
            if (pageUrl) {
                
              message = pageUrl;
            
              const messageData = {
                sourceApplication: "CHROME",
                accessToken: accessToken,
                connectedFileId: fileId,
                dataType: "SEARCH",
                content: message,
                timestamp: new Date()
              };
              const messageJson = JSON.stringify(messageData); // 객체를 JSON 문자열로 변환
              console.log("소켓이 열려있나?", socket)
      
              if (socket) { // socket.current가 null이 아닐 때만 send 호출
                console.log("url 보냅니다~~")
                socket.send(messageJson); // JSON 문자열을 보냄
              } else {
                console.error("WebSocket connection is not established.");
              }
            } else {
              console.log("pageUrl이 null인듯 하네요~~")
            }
        } else {
          console.log("tab.url이 null이다 이말이야~~")
        }
      } else {
        console.log("results가 없네요")
      }
    });
  } else {
    if (!start) {
      console.log("start가 false 임")
    } else if (changeInfo.status !== 'complete') {
      console.log("changeInfo가 complete가 아님")
    }
  }
}

function getHtml(): string {
  return document.documentElement.outerHTML;
}