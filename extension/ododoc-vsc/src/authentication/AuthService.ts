import * as vscode from "vscode";

export async function getLoggedInSession(): Promise<
  vscode.AuthenticationSession | undefined
> {
  const session = await vscode.authentication.getSession("jwtProvider", [], {
    createIfNone: false,
  });
  console.log("logged in session?? ", session);

  return session;
}
