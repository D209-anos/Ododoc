import * as vscode from "vscode";
import { spawn } from "child_process";

export class OdodocTerminal implements vscode.Pseudoterminal {
  private writeEmitter = new vscode.EventEmitter<string>();
  onDidWrite: vscode.Event<string> = this.writeEmitter.event;
  private ptyProcess: any;
  private folderPath: string | null;
  private inputCommand = "";

  constructor() {
    this.folderPath = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : null;
    this.initializeTerminal();
  }

  initializeTerminal() {
    this.ptyProcess = spawn("cmd", [], { shell: true }); // Or 'cmd.exe' on Windows
    this.ptyProcess.stdout.on("data", (data: Buffer) => {
      // Explicitly specify the type of 'data' as 'Buffer'
      this.writeEmitter.fire(data.toString());
    });
    this.ptyProcess.stderr.on("data", (data: Buffer) => {
      // Explicitly specify the type of 'data' as 'Buffer'
      this.writeEmitter.fire(data.toString());
    });
  }

  open(initialDimensions: vscode.TerminalDimensions | undefined): void {
    this.writeEmitter.fire("\x1b[32mododoc terminal is active.\r\n\n");
    this.writeEmitter.fire(`\x1b[33m${this.folderPath} \r\n`);
    this.writeEmitter.fire("\x1b[0m> ");
  }

  close(): void {
    // Handle closing the terminal
    this.ptyProcess.kill();
  }

  handleInput(data: string): void {
    switch (data.charCodeAt(0)) {
      case 13: // Enter key
        this.processCommand();
        this.writeEmitter.fire("\r\n\n");
        this.writeEmitter.fire(`\x1b[33m${this.folderPath} \r\n`);
        this.writeEmitter.fire("\x1b[0m> ");
        break;
      case 127: // Backspace key
        this.inputCommand = this.inputCommand.slice(0, -1);
        break;
      default:
        this.inputCommand += data;
        this.writeEmitter.fire(data);
    }
    this.ptyProcess.stdin.write(data);
    this.writeEmitter.fire(data);
  }

  processCommand(): void {
    this.inputCommand = ""; // 커맨드 처리 후 입력 버퍼 초기화
  }
}
