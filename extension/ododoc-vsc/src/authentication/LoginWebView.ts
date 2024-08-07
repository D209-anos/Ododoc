import * as vscode from "vscode";
import { oAuthLogin } from "./OAuth";

export default class LoginWebView {
  private static instance: LoginWebView;
  private panel: vscode.WebviewPanel | undefined;

  private constructor(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.commands.registerCommand("ododoc.showLoginWebView", () =>
        this.showLoginWebViewCommand(context)
      )
    );
  }

  public static getInstance(context: vscode.ExtensionContext): LoginWebView {
    if (!LoginWebView.instance) {
      LoginWebView.instance = new LoginWebView(context);
    }
    return LoginWebView.instance;
  }

  private showLoginWebViewCommand(context: vscode.ExtensionContext) {
    this.panel = vscode.window.createWebviewPanel(
      "loginWebview",
      "Ododoc Login",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(context.extensionPath)],
      }
    );
    this.getWebviewContent(this.panel.webview, context.extensionUri);

    this.panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === "login") {
          await oAuthLogin(message.provider);
        }
      },
      undefined,
      context.subscriptions
    );
  }

  private getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const ododocLogoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "images", "ododocLogo.png")
    );
    const kakaoLogoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "images", "kakaoLogo.png")
    );
    const naverLogoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "images", "naverLogo.png")
    );
    const googleLogoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "images", "googleLogo.png")
    );

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
        <img class="ododoc-logo" src="${ododocLogoUri}" alt="Ododoc Logo" />
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

  public getSuccessContent(extensionUri: vscode.Uri) {
    if (!this.panel) {
      return;
    }
    const ododocLogoGifUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "images", "ododocLogo.gif")
    );

    this.panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Successful</title>
        <style>
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #ffffff;
        }

        .success-h1 {
          color: #000000;
        }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Login Success</h1>
          <img class="ododoc-logo" src="${ododocLogoGifUri}" alt="Ododoc Logo" />
        </div>
      </body>
      </html>
    `;
  }
}
