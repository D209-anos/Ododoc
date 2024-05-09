import React, { useEffect, useRef } from 'react';

const URL = "ws://localhost:18080/process/ws";

const WebSocketClient: React.FC = () => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    socket.current = new WebSocket(URL);
    console.log("WebSocketClient created");

    socket.current.onopen = () => {
      console.log("Connection established");
      socket.current?.send("Hello Server!");
    };

    socket.current.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onclose = () => {
      console.log("Connection closed");
    };

    // Cleanup on component unmount
    return () => {
      socket.current?.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(message);
    } else {
      console.log("Connection not ready.");
    }
  };

  return (
    <div>
      <button onClick={() => sendMessage("Hi from React!")}>Send Message</button>
    </div>
  );
};

export default WebSocketClient;
