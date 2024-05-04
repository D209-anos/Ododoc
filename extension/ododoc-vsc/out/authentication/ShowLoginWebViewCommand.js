"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowLoginWebViewCommand = void 0;
const vscode = __importStar(require("vscode"));
const LoginCommand_1 = require("./LoginCommand");
function ShowLoginWebViewCommand(context) {
    const panel = vscode.window.createWebviewPanel("loginWebview", "Login", vscode.ViewColumn.One, { enableScripts: true });
    panel.webview.html = getWebviewContent();
    panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === "login") {
            const { accessToken, refreshToken } = await (0, LoginCommand_1.loginUser)(message.provider);
            console.log(`Access Token: ${accessToken}, Refresh Token: ${refreshToken}`);
        }
    }, undefined, context.subscriptions);
}
exports.ShowLoginWebViewCommand = ShowLoginWebViewCommand;
function getWebviewContent() {
    const pathToHtml = vscode.Uri.file("./LoginPage.html");
    return `<!DOCTYPE html><html><body><iframe src="${pathToHtml}"></iframe></body></html>`;
}
//# sourceMappingURL=ShowLoginWebViewCommand.js.map