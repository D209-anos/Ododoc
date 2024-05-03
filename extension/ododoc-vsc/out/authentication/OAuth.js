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
exports.getAccessToken = exports.oAuthLogin = void 0;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const redirectUri = encodeURIComponent("https://k10d209.p.ssafy.io/api");
const oAuthLogin = async (provider) => {
    const socialLoginUrl = {
        kakao: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a23282fc18f2b445d559dfe93fa96e6b&redirect_uri=${redirectUri}`,
        naver: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=DRnVNgGzq_x_6Q4apfhJ&redirect_uri=${redirectUri}`,
        google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=599323777848-68aq3cu9p98np6eml1m77mfc1ethpkrp.apps.googleusercontent.com&redirect_uri=${redirectUri}&scope=profile&response_type=code`,
    };
    const authUrl = socialLoginUrl[provider];
    await vscode.env.openExternal(vscode.Uri.parse(authUrl));
};
exports.oAuthLogin = oAuthLogin;
const getAccessToken = async (code, provider) => {
    const tokenUrl = `https://k10d209.p.ssafy.io/api/oauth2/authorization/${provider}`;
    try {
        const response = await axios_1.default.post(tokenUrl, {
            code: code,
            redirectUri: redirectUri,
        });
        if (response.data) {
            console.log("Access Token:", response.data.accessToken);
            console.log("Refresh Token:", response.data.refreshToken);
            // secreatStorage에 저장 로직 추가
        }
    }
    catch (error) {
        console.error("access 토큰 발급에 실패했는디요??:", error);
    }
};
exports.getAccessToken = getAccessToken;
//# sourceMappingURL=OAuth.js.map