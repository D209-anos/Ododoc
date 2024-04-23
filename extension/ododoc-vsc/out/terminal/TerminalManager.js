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
exports.TerminalManager = void 0;
const vscode = __importStar(require("vscode"));
const OdodocTerminal_1 = require("./OdodocTerminal");
class TerminalManager {
    terminals = new Map();
    nextTerminalId = 0;
    createTerminal() {
        const terminalId = this.nextTerminalId++;
        const ododocTerminal = new OdodocTerminal_1.OdodocTerminal();
        const terminal = vscode.window.createTerminal({
            name: `ododoc Terminal`,
            pty: ododocTerminal,
        });
        this.terminals.set(terminalId, terminal);
        terminal.show();
        return terminal;
    }
    disposeTerminal(terminalId) {
        const terminal = this.terminals.get(terminalId);
        if (terminal) {
            terminal.dispose();
            this.terminals.delete(terminalId);
        }
    }
    disposeAllTerminals() {
        this.terminals.forEach((terminal) => terminal.dispose());
        this.terminals.clear();
    }
}
exports.TerminalManager = TerminalManager;
//# sourceMappingURL=TerminalManager.js.map