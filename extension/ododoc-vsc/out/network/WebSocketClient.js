"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const URL = "ws://localhost:18080/process/ws";
class WebSocketClient {
    socket;
    static instance;
    static getInstance() {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient();
        }
        return WebSocketClient.instance;
    }
    constructor() {
        this.socket = new ws_1.default(URL);
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
    sendMessage(message) {
        if (this.socket.readyState === ws_1.default.OPEN) {
            this.socket.send(message);
        }
        else {
            console.log("Connection not ready.");
        }
    }
}
exports.default = WebSocketClient;
//# sourceMappingURL=WebSocketClient.js.map