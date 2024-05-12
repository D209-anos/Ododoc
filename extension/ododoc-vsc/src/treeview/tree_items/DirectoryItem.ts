import * as vscode from "vscode";
import * as path from "path";

export default class DirectoryItem extends vscode.TreeItem {
  private selected: boolean = false;

  constructor(
    public readonly id: string, // vscode.TreeItem의 id는 string이어야 함.
    public label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly type: "FOLDER" | "FILE" | "NONE",
    private readonly context: vscode.ExtensionContext,
    public readonly itemId: number
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.contextValue = type.toLowerCase();

    this.updateIcon();
  }

  private getIconPath(fileName: string): vscode.Uri {
    return vscode.Uri.file(
      path.join(this.context.extensionPath, "images", fileName)
    );
  }

  private updateIcon() {
    if (this.type === "FOLDER") {
      this.iconPath = {
        light: this.getIconPath("folderIcon.svg"),
        dark: this.getIconPath("folderIcon.svg"),
      };
    } else if (this.type === "FILE") {
      this.iconPath = {
        light: this.getIconPath(
          this.selected ? "selectedFileIcon.svg" : "fileIcon.svg"
        ),
        dark: this.getIconPath(
          this.selected ? "selectedFileIcon.svg" : "fileIcon.svg"
        ),
      };
    }
  }

  public setSelected(selected: boolean) {
    this.selected = selected;
    this.updateIcon();
  }
}
