import * as vscode from "vscode";
import { oAuthLogin } from "./Login";

export function showLoginWebViewCommand(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "loginWebview",
    "Ododoc Login",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(context.extensionPath)],
    }
  );

  panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

  panel.webview.onDidReceiveMessage(
    async (message) => {
      if (message.command === "login") {
        const { accessToken, refreshToken } = await oAuthLogin(
          message.provider
        );
        console.log(
          `Access Token: ${accessToken}, Refresh Token: ${refreshToken}`
        );
      }
    },
    undefined,
    context.subscriptions
  );
}

const getWebviewContent = (
  webview: vscode.Webview,
  extensionUri: vscode.Uri
) => {
  const kakaoLogoUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "images", "kakaoLogo.png")
  );
  const naverLogoUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "images", "naverLogo.png")
  );
  const googleLogoUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "images", "googleLogo.png")
  );

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
