import WebSocket from "ws";

export class WebSocketClient {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket("ws://localhost:8080/ws");

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
