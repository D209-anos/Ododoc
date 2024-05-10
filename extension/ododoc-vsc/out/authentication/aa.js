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
const vscode = __importStar(require("vscode"));
async function loginUser() {
    return new Promise((resolve, reject) => {
        // URI 핸들링 로직 구현
        const uriHandler = async (uri) => {
            const query = new URLSearchParams(uri.query);
            const accessToken = query.get("access_token");
            const refreshToken = query.get("refresh_token");
            if (accessToken && refreshToken) {
                resolve({ accessToken, refreshToken });
            }
            else {
                reject(new Error("Authentication failed"));
            }
        };
        // URI 핸들러 등록
        vscode.window.registerUriHandler({
            handleUri: uriHandler,
        });
        // 사용자를 인증 페이지로 리다이렉트
        const authUrl = `https://your-auth-server.com/login?redirect_uri=${encodeURIComponent("vscode://your.extension.id/callback")}`;
        vscode.env.openExternal(vscode.Uri.parse(authUrl));
    });
}
async function storeToken(context, accessToken, refreshToken) {
    await context.secrets.store("accessToken", accessToken);
    await context.secrets.store("refreshToken", refreshToken);
}
//# sourceMappingURL=aa.js.map