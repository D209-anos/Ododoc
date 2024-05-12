import * as vscode from "vscode";
import { OdodocTerminal } from "./OdodocTerminal";

export class TerminalManager {
  private terminals: Map<number, vscode.Terminal> = new Map();
  private nextTerminalId: number = 0;
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  public createTerminal(): vscode.Terminal {
    const terminalId = this.nextTerminalId++;
    const ododocTerminal = new OdodocTerminal(this.context);
    const terminal = vscode.window.createTerminal({
      name: `ododoc Terminal`,
      pty: ododocTerminal,
    });

    this.terminals.set(terminalId, terminal);
    terminal.show();
    return terminal;
  }

  public disposeTerminal(terminalId: number): void {
    const terminal = this.terminals.get(terminalId);
    if (terminal) {
      terminal.dispose();
      this.terminals.delete(terminalId);
    }
  }

  public disposeAllTerminals(): void {
    this.terminals.forEach((terminal) => terminal.dispose());
    this.terminals.clear();
  }
}
