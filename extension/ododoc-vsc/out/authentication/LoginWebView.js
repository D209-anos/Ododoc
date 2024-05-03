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
exports.showLoginWebViewCommand = void 0;
const vscode = __importStar(require("vscode"));
const Login_1 = require("./Login");
function showLoginWebViewCommand(context) {
    const panel = vscode.window.createWebviewPanel("loginWebview", "Ododoc Login", vscode.ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(context.extensionPath)],
    });
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
    panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === "login") {
            const { accessToken, refreshToken } = await (0, Login_1.oAuthLogin)(message.provider);
            console.log(`Access Token: ${accessToken}, Refresh Token: ${refreshToken}`);
        }
    }, undefined, context.subscriptions);
}
exports.showLoginWebViewCommand = showLoginWebViewCommand;
const getWebviewContent = (webview, extensionUri) => {
    const kakaoLogoUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "images", "kakaoLogo.png"));
    const naverLogoUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "images", "naverLogo.png"));
    const googleLogoUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "images", "googleLogo.png"));
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'none'; 
      img-src ${webview.cspSource} 'self'; 
      script-src 'nonce-XYZ';
      style-src 'self' 'unsafe-inline';
    ">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login</title>
    <style>
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .login-btn-container {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
    }
    .login-btn {
      background-color: transparent;
      cursor: pointer;
      border: none;
    }
    .logo {
      width: 100px;
    }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Login</h1>
      <div class="login-btn-container">
        <button id="login-naver" class="login-btn">
          <img class="logo" src="${naverLogoUri}" alt="Naver">
        </button>
        <button id="login-google" class="login-btn">
          <img class="logo" src="${googleLogoUri}" alt="Google">
        </button>
        <button id="login-kakao" class="login-btn">
          <img class="logo" src="${kakaoLogoUri}" alt="Kakao">
        </button>
      </div>
    </div>
    <script nonce="XYZ">
      const vscode = acquireVsCodeApi();
      document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('login-kakao').addEventListener('click', function() {
          login('kakao');
        });
        document.getElementById('login-naver').addEventListener('click', function() {
          login('naver');
        });
        document.getElementById('login-google').addEventListener('click', function() {
          login('google');
        });
      });
      function login(provider) {
        vscode.postMessage({ command: "login", provider });
      }
    </script>
  </body>
  </html>
  `;
};
//# sourceMappingURL=LoginWebView.js.map