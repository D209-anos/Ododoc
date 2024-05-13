import * as vscode from "vscode";
import { v4 as uuid } from "uuid";
import * as jwt from "jsonwebtoken";
import LoginWebView from "./LoginWebView";
import WebSocketClient from "../network/WebSocketClient";
import FileWatcher from "../source-code-management/FileWatcher";

const AUTH_TYPE = "jwtProvider";
const AUTH_NAME = "Ododoc";
const SESSIONS_SECRET_KEY = `${AUTH_TYPE}.sessions`;
const JWT_SECRET_KEY =
  "ZIiY9erqS9zX2kmxODxuCYAfis2AAPthQpT1oPDhgE8c7WjI5JyrGzY2xI9bvMkb";
export default class JwtAuthenticationProvider
  implements vscode.AuthenticationProvider
{
  private static instance: JwtAuthenticationProvider;
  private sessionChangeEmitter =
    new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();
  private context: vscode.ExtensionContext;
  private token: string | undefined;
  private provider: string | undefined;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
    vscode.authentication.registerAuthenticationProvider(
      AUTH_TYPE,
      AUTH_NAME,
      this,
      { supportsMultipleAccounts: false }
    );
    context.subscriptions.push(
      vscode.window.registerUriHandler({ handleUri: this.handleLoginUri })
    );
  }

  public static getInstance(
    context: vscode.ExtensionContext
  ): JwtAuthenticationProvider {
    if (!JwtAuthenticationProvider.instance) {
      JwtAuthenticationProvider.instance = new JwtAuthenticationProvider(
        context
      );
    }
    return JwtAuthenticationProvider.instance;
  }

  get onDidChangeSessions(): vscode.Event<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent> {
    return this.sessionChangeEmitter.event;
  }

  public async createSession(
    scopes: string[]
  ): Promise<vscode.AuthenticationSession> {
    try {
      if (!this.token) {
        throw new Error("Token is missing.");
      }

      const secretKeyBuffer = Buffer.from(JWT_SECRET_KEY, "base64");
      const decoded = jwt.verify(this.token, secretKeyBuffer, {
        algorithms: ["HS256"],
      }) as any;

      const session: vscode.AuthenticationSession = {
        id: uuid(),
        accessToken: this.token,
        account: {
          id: decoded.provider,
          label: decoded.nickname,
        },
        scopes: [],
      };

      await this.context.secrets.store(
        SESSIONS_SECRET_KEY,
        JSON.stringify([session])
      );

      this.sessionChangeEmitter.fire({
        added: [session],
        removed: [],
        changed: [],
      });

      WebSocketClient.getInstance(this.context).connect();
      FileWatcher.getInstance(this.context).activate();

      return session;
    } catch (error) {
      vscode.window.showErrorMessage(`로그인에 실패했습니다: ${error}`);
      throw error;
    }
  }

  public async getSessions(
    scopes?: string[]
  ): Promise<vscode.AuthenticationSession[]> {
    const sessions = await this.context.secrets.get(SESSIONS_SECRET_KEY);
    if (sessions) {
      return JSON.parse(sessions);
    }
    return [];
  }

  public async removeSession(sessionId: string): Promise<void> {
    let sessions = await this.getSessions();
    if (sessions) {
      const sessionIdx = sessions.findIndex((s) => s.id === sessionId);
      const session = sessions[sessionIdx];
      sessions.splice(sessionIdx, 1);

      await this.context.secrets.store(
        SESSIONS_SECRET_KEY,
        JSON.stringify(sessions)
      );

      if (session) {
        this.sessionChangeEmitter.fire({
          added: [],
          removed: [session],
          changed: [],
        });

        WebSocketClient.getInstance(this.context).disconnect();
        FileWatcher.getInstance(this.context).deactivate();
      }
    }
  }

  // arrow function으로 변경하면 this가 JwtAuthenticationProvider로 고정
  // 일반 함수였으면 this가 global일 것.
  public handleLoginUri = async (uri: vscode.Uri) => {
    if (uri.path === "/callback") {
      const params = new URLSearchParams(uri.query);
      const token = params.get("token");
      const provider = params.get("provider");
      const rootId = params.get("rootId");

      if (token && provider && rootId) {
        this.login(token, provider, rootId);
      } else {
        vscode.window.showErrorMessage("토큰을 받아오지 못했습니다");
        console.log("토큰을 받아오지 못했습니다");
      }
    }
  };

  private login = async (token: string, provider: string, rootId: string) => {
    try {
      this.token = token;
      this.provider = provider;
      const session = await this.createSession([]);
      this.context.secrets.store("rootId", rootId);
      LoginWebView.getInstance(this.context).getSuccessContent(
        this.context.extensionUri
      );
      vscode.window.showInformationMessage(
        `${session.account.label}님 환영합니다!`
      );
      console.log("로그인 성공! => ", session);
    } catch (error) {
      vscode.window.showErrorMessage(`로그인에 실패했습니다... =>  ${error}`);
      console.log(`로그인에 실패했습니다... =>  ${error}`);
    }
  };
}
