import * as vscode from "vscode";
import WebSocket, { MessageEvent } from "ws";
import { MessageData } from "./types";
import { getLoggedInSession } from "../authentication/AuthService";
import FileWatcher from "../source-code-management/FileWatcher";

const URL = "ws://localhost:18080/process/ws";

export default class WebSocketClient {
  private socket: WebSocket | null = null;
  private static instance: WebSocketClient;
  private context: vscode.ExtensionContext;

  public static getInstance(context: vscode.ExtensionContext): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient(context);
    }
    return WebSocketClient.instance;
  }

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  public async connect() {
    const socket = new WebSocket(URL);
    this.socket = socket;
    console.log("WebSocketClient created");

    socket.onopen = () => {
      console.log("Connection established");
      this.sendMessage("SIGNAL", "vsc에서 연결합니다.");
    };

    socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data.toString());

      switch (message.dataType) {
        case "SOURCECODE":
          console.log("Source code request from server:", message);
          this.sendSourcecode(message);
          break;
        default:
          console.log("Message from server:", message);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("Connection closed");
      this.socket = null;
    };
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

      const connectedFileId = await this.context.secrets.get("connectedFileId");
      if (connectedFileId === undefined) {
        console.log("Root ID not found.");
        return;
      }

      const messageData: MessageData = {
        sourceApplication: "VSCODE",
        accessToken: session.accessToken,
        connectedFileId: parseInt(connectedFileId),
        dataType: dataType,
        content: {
          details: message,
          modifiedFiles: [],
          errorFile: null,
        },
        timestamp: new Date().toISOString(),
      };

      console.log("Sending message:", messageData);
      this.socket.send(JSON.stringify(messageData));
    } else {
      console.log("Connection not ready.");
    }
  }

  private async sendSourcecode(data: any) {
    try {
      const session = await getLoggedInSession();
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

        const connectedFileId = await this.context.secrets.get(
          "connectedFileId"
        );
        if (connectedFileId === undefined) {
          console.log("Root ID not found.");
          return;
        }

        const modifiedFiles = await FileWatcher.getInstance(
          this.context
        ).getModifiedFiles();

        if (modifiedFiles.length === 0) {
          return;
        }

        const messageData: MessageData = {
          sourceApplication: "VSCODE",
          accessToken: session.accessToken,
          connectedFileId: parseInt(connectedFileId),
          dataType: "SOURCECODE",
          content: {
            details: "",
            modifiedFiles: modifiedFiles,
            errorFile: null,
          },
          timestamp: new Date().toISOString(),
        };

        console.log("Sending sourcecode:", messageData);
        this.socket.send(JSON.stringify(messageData));
      }
    } catch (error) {
      console.log("Error while sending source code:", error);
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
