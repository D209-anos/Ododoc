import * as vscode from "vscode";
import { spawn, ChildProcessWithoutNullStreams, exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

export class OdodocTerminal implements vscode.Pseudoterminal {
  private writeEmitter = new vscode.EventEmitter<string>();
  onDidWrite: vscode.Event<string> = this.writeEmitter.event;
  private ptyProcess: ChildProcessWithoutNullStreams;
  private folderPath: string | null;
  private inputCommand = "";
  private cursorPosition = 0;
  private subprocesses: ChildProcessWithoutNullStreams[] = [];

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
    if (this.ptyProcess) {
      this.ptyProcess.kill("SIGINT"); // SIGINT 신호를 보내 실행되고 있는 프로세스 종료
    }
    this.subprocesses.forEach((subproc) => subproc.kill()); // 터미널 프로세스 종료 시 모든 subprocess 종료
    this.subprocesses = [];
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
        this.writeEmitter.fire("\r\n");
        this.processCommand();
        this.cursorPosition = 0;

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
    const inputParts = this.inputCommand.trim().split(" ");
    const cmd = inputParts[0];
    const args = inputParts.slice(1);

    switch (cmd.toLowerCase()) {
      case "ls":
        this.listDirectory();
        break;
      case "cd":
        this.changeDirectory(args.join(" "));
        break;
      default:
        this.executeSubprocess(cmd, args);
        break;
    }

    this.inputCommand = "";
  }

  listDirectory() {
    fs.readdir(
      this.folderPath || ".",
      { withFileTypes: true },
      (err, files) => {
        if (err) {
          this.writeEmitter.fire(
            `Error reading directory: ${err.message}\r\n\n`
          );
        } else {
          const output = files
            .map((dirent) =>
              dirent.isDirectory() ? `${dirent.name}/` : dirent.name
            )
            .join("   ");
          this.writeEmitter.fire(output + "\r\n\n");
        }
        this.writeEmitter.fire(`\x1b[33m${this.folderPath}\r\n\x1b[0m> `);
      }
    );
  }

  changeDirectory(targetPath: string) {
    const newPath = path.resolve(this.folderPath || ".", targetPath);
    fs.access(newPath, fs.constants.R_OK, (err) => {
      if (err) {
        this.writeEmitter.fire(
          `cd: ${targetPath}: no such file or directory\r\n\n`
        );
      } else {
        this.folderPath = newPath;
        this.writeEmitter.fire("\r\n");
      }
      this.writeEmitter.fire(`\x1b[33m${this.folderPath}\r\n\x1b[0m> `);
    });
  }

  executeSubprocess(command: string, args: string[]) {
    if (this.ptyProcess) {
      const subprocess = spawn(command, args, {
        cwd: this.folderPath || process.cwd(),
        shell: true, // cmd or bash
      });

      subprocess.stdout.on("data", (data) => {
        const formattedData = data.toString().replace(/\n/g, "\r\n"); // all CRLF => \r\n
        this.writeEmitter.fire(formattedData);
      });

      subprocess.stderr.on("data", (data) => {
        const formattedData = data.toString().replace(/\n/g, "\r\n");
        this.writeEmitter.fire(formattedData);
      });

      subprocess.on("close", (code) => {
        // this.writeEmitter.fire(`\r\nProcess exited with code ${code}`);
        this.writeEmitter.fire("\r\n");
        this.writeEmitter.fire(`\x1b[33m${this.folderPath} \r\n`);
        this.writeEmitter.fire("\x1b[0m> ");
      });
    }
  }

  refreshInputDisplay(): void {
    this.writeEmitter.fire(
      `\x1b[2K\x1b[G> ${this.inputCommand}\x1b[${this.cursorPosition + 3}G` // 라인 클리어 후 커서 처음으로 이동 후 명령어 입력 후 커서 위치 조정
    );
  }
}
