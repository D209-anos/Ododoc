import * as vscode from "vscode";
import { OdodocTerminal } from "./OdodocTerminal";

export class TerminalManager {
  private terminals: Map<number, vscode.Terminal> = new Map();
  private nextTerminalId: number = 0;
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;

    // 터미널 프로필 등록
    context.subscriptions.push(
      vscode.window.registerTerminalProfileProvider("ododoc-terminal", {
        provideTerminalProfile: () => {
          return new vscode.TerminalProfile({
            name: "Ododoc Terminal",
            pty: new OdodocTerminal(context),
          });
        },
      })
    );

    // 터미널 생성 커맨드 등록
    context.subscriptions.push(
      vscode.commands.registerCommand("ododoc.createTerminal", () => {
        const terminal = vscode.window.createTerminal({
          name: "Ododoc Terminal",
          pty: new OdodocTerminal(context),
        });
        terminal.show();
      })
    );
  }

  public createTerminal(): vscode.Terminal {
    const terminalId = this.nextTerminalId++;
    const ododocTerminal = new OdodocTerminal(this.context);
    const terminal = vscode.window.createTerminal({
      name: `Ododoc Terminal`,
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
