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
exports.LoginCommand = void 0;
const vscode = __importStar(require("vscode"));
async function LoginCommand(provider) {
    const redirectUri = "http://localhost:4321/callback";
    const socialLoginUrl = {
        kakao: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a23282fc18f2b445d559dfe93fa96e6b&redirect_uri=${encodeURIComponent(redirectUri)}/oauth2/authorization/kakao`,
        naver: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=DRnVNgGzq_x_6Q4apfhJ&redirect_uri=${encodeURIComponent(redirectUri)}/oauth2/authorization/naver`,
        google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=599323777848-68aq3cu9p98np6eml1m77mfc1ethpkrp.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(redirectUri)}/oauth2/authorization/google&scope=profile&response_type=code`,
    };
    const authUrl = socialLoginUrl[provider];
    await vscode.env.openExternal(vscode.Uri.parse(authUrl));
    try {
        const uri = await listenForAuthCallback();
        const query = new URLSearchParams(uri.query);
        const accessToken = query.get("access_token");
        const refreshToken = query.get("refresh_token");
        if (accessToken && refreshToken) {
            return { accessToken, refreshToken };
        }
        else {
            throw new Error("Authentication failed");
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(`Login Failed: ${error}`);
        throw error;
    }
}
exports.LoginCommand = LoginCommand;
async function listenForAuthCallback() {
    return new Promise((resolve, reject) => {
        // URI 핸들러 등록 로직
        const uriHandler = (uri) => {
            resolve(uri);
        };
        vscode.window.registerUriHandler({ handleUri: uriHandler });
    });
}
//# sourceMappingURL=LoginCommand.js.map