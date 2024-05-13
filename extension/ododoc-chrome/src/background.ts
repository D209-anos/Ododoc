let socket: WebSocket | null = null;
let start: boolean | false = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "start") {
    console.log("start 명령 백그라운드에서 받음")
    start = true;

    if (!socket || socket.readyState === WebSocket.CLOSED) {
        connectWebSocket();
    }
    chrome.tabs.onUpdated.addListener(handleTabUpdate);
  } else if (message.command === "stop") {
    console.log("stop 명령 백그라운드에서 받음")
    start = false;

      // 웹소켓 연결 종료
    if (socket) {
        socket.close();
        socket = null;
    }
    chrome.tabs.onUpdated.removeListener(handleTabUpdate);
  }
});

function getAccessToken(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['accessToken'], (result) => {
      console.log(result)
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
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error("Access token is not available.");
      return;
    }

    if (socket !== null && socket.readyState !== WebSocket.CLOSED) {
      return; // 이미 열려있거나 연결 중인 경우 재연결 시도를 방지
    }

    socket = new WebSocket('ws://localhost:18080/process/ws');

    socket.onopen = () => {
      console.log("WebSocket connection established");

      const messageData = {
        sourceApplication: "Chrome",
        accessToken: accessToken,
        connectedFileId: 1,
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
      console.log("WebSocket 연결 끊김. 1초 후 재연결 합니다.", e);
      setTimeout(function() {
        connectWebSocket();
      }, 1000);
    };

  } catch (e) {
    console.error("WebSocket connection failed: ", e);
  }
}

function handleTabUpdate(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
  const accessToken = getAccessToken();
  console.log("tabId :", tabId, " , changeInfo :", changeInfo, " , tab : ", tab)
  console.log(start);
  if (start && changeInfo.url) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: getHtml,
    }, (results) => {
      if (results[0]) {
        const pageHtml = results[0].result;
        console.log(pageHtml)
        let message = '';

        if (tab.url && tab.url.startsWith('https://www.google.com/search')) {
            const urlParams = new URLSearchParams(new URL(tab.url).search);
            const searchQuery = urlParams.get('q') || 'Unknown Search'; // 검색어 추출
            message = JSON.stringify({
                query: searchQuery
            });
        } else {
            message = JSON.stringify({
                url: tab.url,
                html: pageHtml
            });
        }

        const messageData = {
            sourceApplication: "Chrome",
            accessToken: accessToken,
            connectedFileId: 1,
            dataType: "SIGNAL",
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
      }
    });
  }
}

function getHtml(): string {
  return document.documentElement.outerHTML;
}