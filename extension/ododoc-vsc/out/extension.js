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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const TerminalManager_1 = require("./terminal/TerminalManager");
const OdodocTreeProvider_1 = __importDefault(require("./treeview/OdodocTreeProvider"));
const LoginWebView_1 = __importDefault(require("./authentication/LoginWebView"));
const JwtAuthenticationProvider_1 = __importDefault(require("./authentication/JwtAuthenticationProvider"));
function activate(context) {
    console.log('"ododoc" 활성화.');
    vscode.window.showInformationMessage('"ododoc" 활성화! 코딩에만 집중하세요!');
    // webview 등록
    // new LoginWebView(context); => 이렇게 하면 안됨, 싱글톤 제어가 안됨  spring처럼 생각하면 안됨
    LoginWebView_1.default.getInstance(context);
    // authentication provider 등록
    JwtAuthenticationProvider_1.default.getInstance(context);
    // extension view 생성
    const ododocTreeProvider = new OdodocTreeProvider_1.default(context);
    vscode.window.createTreeView("ododoc.main", {
        treeDataProvider: ododocTreeProvider,
    });
    // 터미널 생성
    const terminalManager = new TerminalManager_1.TerminalManager();
    let ododocTerminal = terminalManager.createTerminal();
    ododocTerminal.show();
}
exports.activate = activate;
function deactivate() {
    console.log('"odododc" 비활성화.');
    vscode.window.showInformationMessage('"odododc" 비활성화됨');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map