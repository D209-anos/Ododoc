"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdodocTerminal = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
class OdodocTerminal {
    writeEmitter = new vscode.EventEmitter();
    onDidWrite = this.writeEmitter.event;
    ptyProcess;
    folderPath;
    inputCommand = "";
    cursorPosition = 0;
    constructor() {
        this.ptyProcess = null;
        this.folderPath = vscode.workspace.workspaceFolders
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : null;
        this.initializeTerminal();
    }
    initializeTerminal() {
        this.ptyProcess = (0, child_process_1.spawn)("cmd", [], { shell: true }); // Or 'bash.exe' on Mac
        // handle output
        this.ptyProcess.stdout.on("data", (data) => {
            this.writeEmitter.fire(data.toString());
        });
        // handle error
        this.ptyProcess.stderr.on("data", (data) => {
            this.writeEmitter.fire(data.toString());
        });
    }
    open(initialDimensions) {
        this.writeEmitter.fire("\x1b[32mododoc terminal is active.\r\n\n");
        this.writeEmitter.fire(`\x1b[33m${this.folderPath} \r\n`);
        this.writeEmitter.fire("\x1b[0m> ");
    }
    close() {
        // Handle closing the terminal
        this.ptyProcess.kill();
    }
    handleInput(data) {
        // arrow key control
        if (data.startsWith("\x1b[")) {
            switch (data.slice(2) // Check for arrow key codes after the escape sequence
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
    processCommand() {
        console.log(this.inputCommand);
        this.inputCommand = "";
    }
    refreshInputDisplay() {
        this.writeEmitter.fire(`\x1b[2K\x1b[G> ${this.inputCommand}\x1b[${this.cursorPosition + 3}G` // 라인 클리어 후 커서 처음으로 이동 후 명령어 입력 후 커서 위치 조정
        );
    }
}
exports.OdodocTerminal = OdodocTerminal;
//# sourceMappingURL=OdodocTerminal.js.map