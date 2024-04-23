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
    constructor() {
        this.folderPath = vscode.workspace.workspaceFolders
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : null;
        this.initializeTerminal();
    }
    initializeTerminal() {
        this.ptyProcess = (0, child_process_1.spawn)("cmd", [], { shell: true }); // Or 'cmd.exe' on Windows
        this.ptyProcess.stdout.on("data", (data) => {
            // Explicitly specify the type of 'data' as 'Buffer'
            this.writeEmitter.fire(data.toString());
        });
        this.ptyProcess.stderr.on("data", (data) => {
            // Explicitly specify the type of 'data' as 'Buffer'
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
    processCommand() {
        this.inputCommand = ""; // 커맨드 처리 후 입력 버퍼 초기화
    }
}
exports.OdodocTerminal = OdodocTerminal;
//# sourceMappingURL=OdodocTerminal.js.map