"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const AuthService_1 = require("../authentication/AuthService");
const URL = "ws://localhost:18080/process/ws";
class WebSocketClient {
    socket = null;
    static instance;
    static getInstance() {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient();
        }
        return WebSocketClient.instance;
    }
    constructor() { }
    connect() {
        const socket = new ws_1.default(URL);
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
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
    async sendMessage(dataType, message) {
        if (this.socket && this.socket.readyState === ws_1.default.OPEN) {
            const session = await (0, AuthService_1.getLoggedInSession)();
            if (session === undefined) {
                console.log("Session not found.");
                return;
            }
            const messageData = {
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
        }
        else {
            console.log("Connection not ready.");
        }
    }
}
exports.default = WebSocketClient;
//# sourceMappingURL=WebSocketClient.js.map