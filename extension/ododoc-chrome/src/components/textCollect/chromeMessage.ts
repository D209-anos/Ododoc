export const sendChromeMessage = (action: string, data?: any) => {
    chrome.runtime.sendMessage({ action, ...data });
};

// 웹소켓
let socket: WebSocket | null = null;

export const setupWebSocket = () => {
  socket = new WebSocket('wss://localhost:18080/process');

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  return socket;
};

export const sendWebSocketMessage = (data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.log('WebSocket is not connected, trying to reconnect...');
      socket = setupWebSocket();
    }
  };
