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
const vscode = __importStar(require("vscode"));
const Login_1 = require("./Login");
class default_1 {
    _extensionUri;
}
exports.default = default_1;
function showLoginWebViewCommand(context) {
    const panel = vscode.window.createWebviewPanel("loginWebview", "Login", vscode.ViewColumn.One, {
        enableScripts: true,
    });
    panel.webview.html = getWebviewContent();
    panel.webview.onDidReceiveMessage(async (message) => {
        console.log(message);
        if (message.command === "login") {
            const { accessToken, refreshToken } = await (0, Login_1.oAuthLogin)(message.provider);
            console.log(`Access Token: ${accessToken}, Refresh Token: ${refreshToken}`);
        }
    }, undefined, context.subscriptions);
}
function getWebviewContent() {
    // Local path to css styles
    const styleResetPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css');
    const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css');
    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(styleResetPath);
    const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'none';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login</title>
    </head>
    <body>
      <button onclick="login('kakao')">
        <img src="kakaoLogo.png" alt="Kakao">
      </button>
      <button onclick="login('naver')">
        <img src="naverLogo.png" alt="Naver">
      </button>
      <button onclick="login('google')">
        <img src="googleLogo.png" alt="Google">
      </button>
      <script>
        const vscode = acquireVsCodeApi();
        function login(provider) {
          vscode.postMessage({ command: "login", provider });
        }
      </script>
    </body>
    </html>
    
    `;
}
//# sourceMappingURL=LoginPanel.js.map