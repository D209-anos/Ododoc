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
const OAuth_1 = require("./OAuth");
class LoginWebView {
    static instance;
    panel;
    constructor(context) {
        console.log(context, "만들었어~`");
        context.subscriptions.push(vscode.commands.registerCommand("ododoc.showLoginWebView", () => this.showLoginWebViewCommand(context)));
    }
    static getInstance(context) {
        if (!LoginWebView.instance) {
            console.log(context, "만들게~`");
            LoginWebView.instance = new LoginWebView(context);
        }
        return LoginWebView.instance;
    }
    showLoginWebViewCommand(context) {
        this.panel = vscode.window.createWebviewPanel("loginWebview", "Ododoc Login", vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(context.extensionPath)],
        });
        this.getWebviewContent(this.panel.webview, context.extensionUri);
        this.panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === "login") {
                await (0, OAuth_1.oAuthLogin)(message.provider);
            }
        }, undefined, context.subscriptions);
    }
    getWebviewContent(webview, extensionUri) {
        const OdodocLogoUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "images", "ododocLogo.png"));
        const kakaoLogoUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "images", "kakaoLogo.png"));
        const naverLogoUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "images", "naverLogo.png"));
        const googleLogoUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "images", "googleLogo.png"));
        if (!this.panel) {
            return;
        }
        this.panel.webview.html = `
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
      .ododoc-logo {
        width: 300px;
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
      .social-logo {
        width: 100px;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Login</h1>
        <img class="ododoc-logo" src="${OdodocLogoUri}" alt="Ododoc Logo" />
        <div class="login-btn-container">
          <button id="login-naver" class="login-btn">
            <img class="social-logo" src="${naverLogoUri}" alt="Naver">
          </button>
          <button id="login-google" class="login-btn">
            <img class="social-logo" src="${googleLogoUri}" alt="Google">
          </button>
          <button id="login-kakao" class="login-btn">
            <img class="social-logo" src="${kakaoLogoUri}" alt="Kakao">
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
    }
    getSuccessContent() {
        if (!this.panel) {
            return;
        }
        this.panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Successful</title>
      </head>
      <body>
        <h1>로그인에 성공했습니다!</h1>
        <p>코딩해라</p>
      </body>
      </html>
    `;
    }
}
exports.default = LoginWebView;
//# sourceMappingURL=LoginWebView.js.map