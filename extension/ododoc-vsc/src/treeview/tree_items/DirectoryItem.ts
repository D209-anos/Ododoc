import * as vscode from "vscode";
import * as path from "path";

export default class DirectoryItem extends vscode.TreeItem {
  constructor(
    public readonly id: string, // vscode.TreeItem의 id는 string이어야 함.
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly type: "FOLDER" | "FILE" | "NONE",
    private readonly context: vscode.ExtensionContext,
    public readonly itemId: number
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.contextValue = type.toLowerCase();

    if (this.type === "FOLDER") {
      this.iconPath = {
        light: this.getIconPath("folderIcon.svg"),
        dark: this.getIconPath("folderIcon.svg"),
      };
    } else if (this.type === "FILE") {
      this.iconPath = {
        light: this.getIconPath("fileIcon.svg"),
        dark: this.getIconPath("fileIcon.svg"),
      };
    }
  }

  private getIconPath(fileName: string): vscode.Uri {
    return vscode.Uri.file(
      path.join(this.context.extensionPath, "images", fileName)
    );
  }
}
