import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export default class implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    if (!element) {
      return [this.getPathItem(".")];
    } else {
      return this.getFiles(element.resourceUri?.fsPath ?? "");
    }
  }

  private getPathItem(dirPath: string): vscode.TreeItem {
    const isDirectory = fs.lstatSync(dirPath).isDirectory();
    const collapsibleState = isDirectory
      ? vscode.TreeItemCollapsibleState.Collapsed
      : vscode.TreeItemCollapsibleState.None;
    const item = new vscode.TreeItem(path.basename(dirPath), collapsibleState);
    item.resourceUri = vscode.Uri.file(dirPath);
    return item;
  }

  private getFiles(dirPath: string): vscode.TreeItem[] {
    const files = fs.readdirSync(dirPath);
    return files.map((file) => this.getPathItem(path.join(dirPath, file)));
  }
}
