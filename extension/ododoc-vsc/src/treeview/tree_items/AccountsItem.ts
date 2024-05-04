import * as vscode from "vscode";

export default class AccountsItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.iconPath = new vscode.ThemeIcon("account");
    this.contextValue = "account";
  }
}
