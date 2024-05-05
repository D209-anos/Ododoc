import WebSocket from "ws";

const URL = "ws://localhost:18080/process/ws";

export default class WebSocketClient {
  private socket: WebSocket;
  private static instance: WebSocketClient;

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  private constructor() {
    this.socket = new WebSocket(URL);

    console.log("WebSocketClient created");

    this.socket.on("open", () => {
      console.log("Connection established");
      this.socket.send("Hello Server!");
    });

    this.socket.on("message", (data) => {
      console.log("Message from server:", data);
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    this.socket.on("close", () => {
      console.log("Connection closed");
    });
  }

  sendMessage(message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.log("Connection not ready.");
    }
  }
}
