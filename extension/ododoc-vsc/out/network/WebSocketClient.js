"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClient = void 0;
const ws_1 = __importDefault(require("ws"));
class WebSocketClient {
    socket;
    constructor() {
        this.socket = new ws_1.default("ws://localhost:8080/ws");
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
exports.WebSocketClient = WebSocketClient;
//# sourceMappingURL=WebSocketClient.js.map