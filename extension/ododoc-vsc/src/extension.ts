import * as vscode from "vscode";
import { TerminalManager } from "./terminal/TerminalManager";
import AccountsProvider from "./treeview/AccountsProvider";
import DocumentsProvider from "./treeview/DocumentsProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log('"ododoc" 활성화.');
  vscode.window.showInformationMessage('"ododoc" 활성화! 코딩에만 집중하세요!');

  // extension view 생성
  const accountsProvider = new AccountsProvider();
  vscode.window.createTreeView("accounts", {
    treeDataProvider: accountsProvider,
  });

  const documentsProvider = new DocumentsProvider();
  vscode.window.createTreeView("directory", {
    treeDataProvider: documentsProvider,
  });

  // 터미널 생성
  const terminalManager = new TerminalManager();

  let ododocTerminal = terminalManager.createTerminal();
  ododocTerminal.show();
}

export function deactivate() {
  console.log('"odododc" 비활성화.');
  vscode.window.showInformationMessage('"odododc" 비활성화됨');
}
