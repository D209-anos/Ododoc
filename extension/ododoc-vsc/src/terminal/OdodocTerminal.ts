import * as vscode from "vscode";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

export class OdodocTerminal implements vscode.Pseudoterminal {
  private writeEmitter = new vscode.EventEmitter<string>();
  onDidWrite: vscode.Event<string> = this.writeEmitter.event;
  private ptyProcess: ChildProcessWithoutNullStreams;
  private folderPath: string | null;
  private inputCommand = "";
  private cursorPosition = 0;

  constructor() {
    this.ptyProcess = null as any;
    this.folderPath = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : null;
    this.initializeTerminal();
  }

  initializeTerminal() {
    this.ptyProcess = spawn("cmd", [], { shell: true }); // Or 'bash.exe' on Mac

    // handle output
    this.ptyProcess.stdout.on("data", (data: Buffer) => {
      this.writeEmitter.fire(data.toString());
    });

    // handle error
    this.ptyProcess.stderr.on("data", (data: Buffer) => {
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
    // arrow key control
    if (data.startsWith("\x1b[")) {
      switch (
        data.slice(2) // Check for arrow key codes after the escape sequence
      ) {
        case "A": // Up arrow
          return;
        case "B": // Down arrow
          return;
        case "C": // Right arrow
          if (this.cursorPosition < this.inputCommand.length) {
            this.cursorPosition += 1;
            this.writeEmitter.fire("\x1b[C"); // Move cursor right
          }
          return;
        case "D": // Left arrow
          if (this.cursorPosition > 0) {
            this.cursorPosition -= 1;
            this.writeEmitter.fire("\x1b[D"); // Move cursor left
          }
          return;
      }
    }

    switch (data.charCodeAt(0)) {
      case 13: // Enter key
        this.processCommand();
        this.cursorPosition = 0;
        this.writeEmitter.fire("\r\n\n");
        this.writeEmitter.fire(`\x1b[33m${this.folderPath} \r\n`);
        this.writeEmitter.fire("\x1b[0m> ");
        break;
      case 127: // Backspace key
        if (this.cursorPosition > 0) {
          this.inputCommand =
            this.inputCommand.slice(0, this.cursorPosition - 1) +
            this.inputCommand.slice(this.cursorPosition);
          this.cursorPosition -= 1;
          this.refreshInputDisplay();
        }
        break;
      default:
        this.inputCommand =
          this.inputCommand.slice(0, this.cursorPosition) +
          data +
          this.inputCommand.slice(this.cursorPosition);
        this.cursorPosition += 1;
        this.refreshInputDisplay();
    }
  }

  processCommand(): void {
    console.log(this.inputCommand);
    this.inputCommand = "";
  }

  refreshInputDisplay(): void {
    this.writeEmitter.fire(
      `\x1b[2K\x1b[G> ${this.inputCommand}\x1b[${this.cursorPosition + 3}G` // 라인 클리어 후 커서 처음으로 이동 후 명령어 입력 후 커서 위치 조정
    );
  }
}
