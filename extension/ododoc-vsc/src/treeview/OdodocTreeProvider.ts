import * as vscode from "vscode";
import { AccountsItem } from "./tree_items/AccountsItem";

export default class OdodocTreeProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  private secretStorage: vscode.SecretStorage;

  // 데이터 변경이 발생했을 때 TreeView를 새로 고침하도록 vscode에 알리는 데에 사용
  onDidChangeTreeData?: vscode.Event<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  >;

  constructor(context: vscode.ExtensionContext) {
    this.secretStorage = context.secrets;
    this.onDidChangeTreeData = new vscode.EventEmitter<
      void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
    >().event;
  }

  // 각 노드를 어떻게 표시할 것인지 정의
  getTreeItem(
    element: vscode.TreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  // 트리 뷰에 표시할 노드들
  getChildren(
    element?: vscode.TreeItem
  ): vscode.ProviderResult<vscode.TreeItem[]> {
    if (this.isLogin()) {
      return [AccountsItem];
    }
    return [];
  }

  isLogin(): boolean {
    const token = this.secretStorage.get("authToken");
    console.log(token);
    // return token !== undefined && token !== null;
    return false;
  }
}
