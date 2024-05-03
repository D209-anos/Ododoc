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
const OAuth_1 = require("./OAuth");
function showLoginWebViewCommand(context) {
    const panel = vscode.window.createWebviewPanel("loginWebview", "Ododoc Login", vscode.ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(context.extensionPath)],
    });
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
    panel.webview.onDidReceiveMessage(async (message) => {
        console.log(message);
        if (message.command === "login") {
            const redirectUri = encodeURIComponent("https://k10d209.p.ssafy.io/oauth");
            const socialLoginUrl = {
                kakao: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a23282fc18f2b445d559dfe93fa96e6b&redirect_uri=${redirectUri}`,
                naver: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=DRnVNgGzq_x_6Q4apfhJ&redirect_uri=${redirectUri}`,
                google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=599323777848-68aq3cu9p98np6eml1m77mfc1ethpkrp.apps.googleusercontent.com&redirect_uri=${redirectUri}&scope=profile&response_type=code`,
            };
            console.log(socialLoginUrl[message.provider]);
            console.log("Attempting to open URL:", socialLoginUrl[message.provider]);
            await vscode.env.openExternal(vscode.Uri.parse(socialLoginUrl[message.provider]));
            console.log("URL opened");
            console.log("login", message.provider);
            try {
                await (0, OAuth_1.oAuthLogin)(message.provider);
                panel.webview.html = getSuccessContent();
                vscode.window.showErrorMessage("로그인에 성공했습니다.");
            }
            catch (error) {
                vscode.window.showErrorMessage("로그인에 실패했습니다.: " + error.message);
            }
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
const getSuccessContent = () => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Successful</title>
    </head>
    <body>
      <h1>Welcome!</h1>
      <p>You have successfully logged in. You can close this tab.</p>
    </body>
    </html>
  `;
};
//# sourceMappingURL=LoginWebView.js.map