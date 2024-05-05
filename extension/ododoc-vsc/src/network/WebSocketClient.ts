import * as vscode from "vscode";
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

  public connect() {
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
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const session = await getLoggedInSession();

      if (session === undefined) {
        console.log("Session not found.");
        return;
      }

      const messageData: MessageData = {
        senderState: {
          sourceApplication: "VSCODE",
          accessToken: session.accessToken,
        },
        connectedFileId: 1,
        dataType: dataType,
        contents: message,
        timestamp: new Date(),
      };

      this.socket.send(JSON.stringify(messageData));
    } else {
      console.log("Connection not ready.");
    }
  }
}
