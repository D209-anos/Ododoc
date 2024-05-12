import * as vscode from "vscode";
import { TerminalManager } from "./terminal/TerminalManager";
import OdodocTreeProvider from "./treeview/OdodocTreeProvider";
import LoginWebView from "./authentication/LoginWebView";
import JwtAuthenticationProvider from "./authentication/JwtAuthenticationProvider";
import { getLoggedInSession } from "./authentication/AuthService";
import WebSocketClient from "./network/WebSocketClient";

export function activate(context: vscode.ExtensionContext) {
  console.log('"ododoc" 활성화.');
  vscode.window.showInformationMessage('"ododoc" 활성화! 코딩에만 집중하세요!');

  // webview 등록
  // new LoginWebView(context); => 이렇게 하면 안됨, 싱글톤 제어가 안됨  spring처럼 생각하면 안됨
  LoginWebView.getInstance(context);

  // authentication provider 등록
  JwtAuthenticationProvider.getInstance(context);

  // extension view 생성
  new OdodocTreeProvider(context);

  if (getLoggedInSession() !== undefined) {
    WebSocketClient.getInstance(context).connect();
  }

  // 터미널 생성
  const terminalManager = new TerminalManager(context);
  let ododocTerminal = terminalManager.createTerminal();
  ododocTerminal.show();
}

export function deactivate() {
  console.log('"odododc" 비활성화.');
  vscode.window.showInformationMessage('"odododc" 비활성화됨');
}
