import * as vscode from "vscode";
import AccountsItem from "./tree_items/AccountsItem";
import { getLoggedInSession } from "../authentication/AuthService";

export default class OdodocTreeProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  // 데이터 변경이 발생했을 때 TreeView를 새로 고침하도록 vscode에 알리는 데에 사용
  private _onDidChangeTreeData: vscode.EventEmitter<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  > = new vscode.EventEmitter<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  >();
  onDidChangeTreeData: vscode.Event<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  > = this._onDidChangeTreeData.event;

  constructor(context: vscode.ExtensionContext) {
    vscode.window.createTreeView("ododoc.main", {
      treeDataProvider: this,
    });
    context.subscriptions.push(
      vscode.authentication.onDidChangeSessions(() => {
        this.refresh();
      })
    );
  }

  refresh = (): void => {
    console.log("refresh");
    this._onDidChangeTreeData.fire();
  };

  // 각 노드를 어떻게 표시할 것인지 정의
  getTreeItem(
    element: vscode.TreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  // 트리 뷰에 표시할 노드들
  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    const loggedInSession = await getLoggedInSession();
    if (loggedInSession !== undefined) {
      return [new AccountsItem(loggedInSession.account.label)];
    }
    return [];
  }
}
