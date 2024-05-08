import WebSocket from "ws";
import { MessageData } from "./MessageData";
import { getLoggedInSession } from "../authentication/AuthService";

const URL = "ws://localhost:18080/process/ws";

export default class WebSocketClient {
  private socket: WebSocket | null = null;
  private static instance: WebSocketClient;

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  private constructor() {}

  public async connect() {
    const socket = new WebSocket(URL);
    this.socket = socket;
    console.log("WebSocketClient created");

    socket.on("open", () => {
      console.log("Connection established");
      this.sendMessage("SIGNAL", "vsc에서 연결합니다.");
    });

    socket.on("message", (data) => {
      console.log("Message from server:", data);
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    socket.on("close", () => {
      console.log("Connection closed");
      this.socket = null;
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public async sendMessage(dataType: string, message: string) {
    const session = await getLoggedInSession();

    console.log(session);

    // 로그인은 되어 있는데 소켓 연결이 끊기면 재연결 시도
    if (session !== undefined && this.socket === null) {
      await this.connect();
      await this.retryConnection(); // WebSocket Open 될 때까지 기다려줌
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      if (session === undefined) {
        console.log("Session not found.");
        return;
      }

      const messageData: MessageData = {
        sourceApplication: "VSCODE",
        accessToken: session.accessToken,
        connectedFileId: 1,
        dataType: dataType,
        content: message,
        timestamp: new Date().toISOString(),
      };

      console.log("Sending message:", messageData);
      this.socket.send(JSON.stringify(messageData));
    } else {
      console.log("Connection not ready.");
    }
  }

  private async retryConnection() {
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        return; // 연결이 준비되면 함수 종료
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
      attempts++;
    }

    throw new Error("Connection timeout after " + maxAttempts + " attempts.");
  }
}
