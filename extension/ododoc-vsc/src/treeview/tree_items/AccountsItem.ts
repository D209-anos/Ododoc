import * as vscode from "vscode";

export default class implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<undefined> =
    new vscode.EventEmitter<undefined>();
  public onDidChangeTreeData: vscode.Event<undefined> =
    this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (this.isUserLoggedIn()) {
      // 사용자가 로그인했다면 실제 트리 아이템을 반환합니다.
      return Promise.resolve(this.getActualTreeItems());
    } else {
      // 로그인되지 않았다면 로그인 유도 메시지가 포함된 트리 아이템을 반환합니다.
      return Promise.resolve(this.getLoginPromptTreeItem());
    }
  }

  private isUserLoggedIn(): boolean {
    // 로그인 상태 확인 로직
    // 예를 들어, this.context.globalState.get("isLoggedIn")으로 확인할 수 있습니다.
    return false;
  }

  private getLoginPromptTreeItem(): vscode.TreeItem[] {
    const loginTreeItem = new vscode.TreeItem(
      "Please log in to continue",
      vscode.TreeItemCollapsibleState.None
    );
    loginTreeItem.command = {
      command: "ododoc.login",
      title: "Login",
      arguments: [],
    };
    return [loginTreeItem];
  }

  private getActualTreeItems(): vscode.TreeItem[] {
    const loginTreeItem = new vscode.TreeItem(
      "hello hello?",
      vscode.TreeItemCollapsibleState.None
    );
    return [loginTreeItem];
  }

  public refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}
