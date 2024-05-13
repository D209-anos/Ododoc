import * as vscode from "vscode";
import { diffLines } from "diff";
import WebSocketClient from "../network/WebSocketClient";

export default class FileWatcher {
  private static instance: FileWatcher;
  private watcher: vscode.FileSystemWatcher;
  private fileContents: Map<string, string>;
  private isActive: boolean;

  public static getInstance(context: vscode.ExtensionContext): FileWatcher {
    if (!FileWatcher.instance) {
      FileWatcher.instance = new FileWatcher(context);
    }
    return FileWatcher.instance;
  }

  private constructor(private context: vscode.ExtensionContext) {
    this.watcher = vscode.workspace.createFileSystemWatcher(
      "**/*",
      false,
      false,
      false
    );
    this.fileContents = new Map<string, string>();
    this.isActive = false;

    this.watcher.onDidChange(this.onFileChange, this);
    this.watcher.onDidCreate(this.onFileCreate, this);
    this.watcher.onDidDelete(this.onFileDelete, this);

    context.subscriptions.push(this.watcher);
  }

  private async initialize() {
    if (!this.isActive) {
      return;
    }
    this.fileContents.clear();
    const rootUri = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (!rootUri) {
      console.error("No workspace folder found");
      return;
    }

    const files = await this.getFiles(rootUri);

    for (const file of files) {
      const content = await this.readFileContent(file);
      if (content !== undefined) {
        this.fileContents.set(file.fsPath, content);
      }
    }

    console.log("FileWatcher initialized with all files.");
  }

  private async onFileChange(uri: vscode.Uri) {
    if (!this.isActive) {
      return;
    }
    console.log(`File changed: ${uri.fsPath}`);
    const newContent = await this.readFileContent(uri);
    const oldContent = this.fileContents.get(uri.fsPath) || "";
    this.fileContents.set(uri.fsPath, newContent || "");
    const changes = this.getChanges(oldContent, newContent || "");
    this.sendFileEvent("change", uri.fsPath, changes);
  }

  private async onFileCreate(uri: vscode.Uri) {
    if (!this.isActive) {
      return;
    }
    console.log(`File created: ${uri.fsPath}`);
    this.fileContents.set(uri.fsPath, "");
  }

  private onFileDelete(uri: vscode.Uri) {
    if (!this.isActive) {
      return;
    }
    console.log(`File deleted: ${uri.fsPath}`);
    this.fileContents.delete(uri.fsPath);
  }

  private async readFileContent(uri: vscode.Uri): Promise<string | undefined> {
    try {
      const bytes = await vscode.workspace.fs.readFile(uri);
      return new TextDecoder("utf-8").decode(bytes);
    } catch (error) {
      console.error(`Failed to read file: ${uri.fsPath}`, error);
      return undefined;
    }
  }

  private getChanges(oldContent: string, newContent: string): ChangeDetail[] {
    const changes = diffLines(oldContent, newContent);
    const changeDetails: ChangeDetail[] = [];
    let lineNumber = 0;

    changes.forEach((change) => {
      if (change.added || change.removed) {
        const lines = change.value.split("\n").length - 1;
        if (change.added) {
          changeDetails.push({
            line: lineNumber,
            added: change.value,
            removed: "",
          });
        } else if (change.removed) {
          changeDetails.push({
            line: lineNumber,
            added: "",
            removed: change.value,
          });
        }
        lineNumber += lines;
      } else {
        lineNumber += change.count || 0;
      }
    });

    return changeDetails;
  }

  private sendFileEvent(
    event: string,
    filePath: string,
    content: string | ChangeDetail[]
  ) {
    const webSocketClient = WebSocketClient.getInstance(this.context);
    // 루트디렉토리까지 포함한 파일명만 전송
    const fileName = filePath.split(
      vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || ""
    )[1];
    webSocketClient.sendMessage(
      "SOURCECODE",
      JSON.stringify({ event, fileName, content })
    );
  }

  private async getFiles(dir: vscode.Uri): Promise<vscode.Uri[]> {
    const files: vscode.Uri[] = [];
    const entries = await vscode.workspace.fs.readDirectory(dir);

    for (const [name, type] of entries) {
      const entryUri = vscode.Uri.joinPath(dir, name);
      if (type === vscode.FileType.File) {
        files.push(entryUri);
      } else if (type === vscode.FileType.Directory) {
        files.push(...(await this.getFiles(entryUri)));
      }
    }

    return files;
  }

  public activate() {
    this.isActive = true;
    console.log("FileWatcher activated");
    // 초기화 시 전체 파일 인덱싱
    this.initialize();
  }

  public deactivate() {
    this.isActive = false;
    console.log("FileWatcher deactivated");
  }
}

interface ChangeDetail {
  line: number;
  added: string;
  removed: string;
}
