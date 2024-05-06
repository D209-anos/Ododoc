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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const uuid_1 = require("uuid");
const jwt = __importStar(require("jsonwebtoken"));
const LoginWebView_1 = __importDefault(require("./LoginWebView"));
const WebSocketClient_1 = __importDefault(require("../network/WebSocketClient"));
const AUTH_TYPE = "jwtProvider";
const AUTH_NAME = "Ododoc";
const SESSIONS_SECRET_KEY = `${AUTH_TYPE}.sessions`;
const JWT_SECRET_KEY = "ZIiY9erqS9zX2kmxODxuCYAfis2AAPthQpT1oPDhgE8c7WjI5JyrGzY2xI9bvMkb";
class JwtAuthenticationProvider {
    static instance;
    sessionChangeEmitter = new vscode.EventEmitter();
    context;
    token;
    provider;
    constructor(context) {
        this.context = context;
        vscode.authentication.registerAuthenticationProvider(AUTH_TYPE, AUTH_NAME, this, { supportsMultipleAccounts: false });
        context.subscriptions.push(vscode.window.registerUriHandler({ handleUri: this.handleLoginUri }));
    }
    static getInstance(context) {
        if (!JwtAuthenticationProvider.instance) {
            JwtAuthenticationProvider.instance = new JwtAuthenticationProvider(context);
        }
        return JwtAuthenticationProvider.instance;
    }
    get onDidChangeSessions() {
        return this.sessionChangeEmitter.event;
    }
    async createSession(scopes) {
        try {
            if (!this.token) {
                throw new Error("Token is missing.");
            }
            const secretKeyBuffer = Buffer.from(JWT_SECRET_KEY, "base64");
            const decoded = jwt.verify(this.token, secretKeyBuffer, {
                algorithms: ["HS256"],
            });
            const session = {
                id: (0, uuid_1.v4)(),
                accessToken: this.token,
                account: {
                    id: decoded.provider,
                    label: decoded.nickname,
                },
                scopes: [],
            };
            await this.context.secrets.store(SESSIONS_SECRET_KEY, JSON.stringify([session]));
            this.sessionChangeEmitter.fire({
                added: [session],
                removed: [],
                changed: [],
            });
            WebSocketClient_1.default.getInstance().connect();
            return session;
        }
        catch (error) {
            vscode.window.showErrorMessage(`로그인에 실패했습니다: ${error}`);
            throw error;
        }
    }
    async getSessions(scopes) {
        const sessions = await this.context.secrets.get(SESSIONS_SECRET_KEY);
        if (sessions) {
            return JSON.parse(sessions);
        }
        return [];
    }
    async removeSession(sessionId) {
        let sessions = await this.getSessions();
        if (sessions) {
            const sessionIdx = sessions.findIndex((s) => s.id === sessionId);
            const session = sessions[sessionIdx];
            sessions.splice(sessionIdx, 1);
            await this.context.secrets.store(SESSIONS_SECRET_KEY, JSON.stringify(sessions));
            if (session) {
                this.sessionChangeEmitter.fire({
                    added: [],
                    removed: [session],
                    changed: [],
                });
                WebSocketClient_1.default.getInstance().disconnect();
            }
        }
    }
    // arrow function으로 변경하면 this가 JwtAuthenticationProvider로 고정
    // 일반 함수였으면 this가 global일 것.
    handleLoginUri = async (uri) => {
        if (uri.path === "/callback") {
            const params = new URLSearchParams(uri.query);
            const token = params.get("token");
            const provider = params.get("provider");
            if (token && provider) {
                this.login(token, provider);
            }
            else {
                vscode.window.showErrorMessage("토큰을 받아오지 못했습니다");
                console.log("토큰을 받아오지 못했습니다");
            }
        }
    };
    login = async (token, provider) => {
        try {
            this.token = token;
            this.provider = provider;
            const session = await this.createSession([]);
            LoginWebView_1.default.getInstance(this.context).getSuccessContent(this.context.extensionUri);
            vscode.window.showInformationMessage(`${session.account.label}님 환영합니다!`);
            console.log("로그인 성공! => ", session);
        }
        catch (error) {
            vscode.window.showErrorMessage(`로그인에 실패했습니다... =>  ${error}`);
            console.log(`로그인에 실패했습니다... =>  ${error}`);
        }
    };
}
exports.default = JwtAuthenticationProvider;
//# sourceMappingURL=JwtAuthenticationProvider.js.map