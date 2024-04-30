import * as vscode from "vscode";
import { TerminalManager } from "./terminal/TerminalManager";
import OdodocTreeProvider from "./treeview/OdodocTreeProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log('"ododoc" 활성화.');
  vscode.window.showInformationMessage('"ododoc" 활성화! 코딩에만 집중하세요!');

  // extension view 생성
  const ododocTreeProvider = new OdodocTreeProvider();
  vscode.window.createTreeView("ododoc", {
    treeDataProvider: ododocTreeProvider,
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
