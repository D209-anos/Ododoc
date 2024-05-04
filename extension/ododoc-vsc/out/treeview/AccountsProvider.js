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
class default_1 {
    context;
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    constructor(context) {
        this.context = context;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (this.isUserLoggedIn()) {
            // 사용자가 로그인했다면 실제 트리 아이템을 반환합니다.
            return Promise.resolve(this.getActualTreeItems());
        }
        else {
            // 로그인되지 않았다면 로그인 유도 메시지가 포함된 트리 아이템을 반환합니다.
            return Promise.resolve(this.getLoginPromptTreeItem());
        }
    }
    isUserLoggedIn() {
        // 로그인 상태 확인 로직
        // 예를 들어, this.context.globalState.get("isLoggedIn")으로 확인할 수 있습니다.
        return false;
    }
    getLoginPromptTreeItem() {
        const loginTreeItem = new vscode.TreeItem("Please log in to continue", vscode.TreeItemCollapsibleState.None);
        loginTreeItem.command = {
            command: "ododoc.login",
            title: "Login",
            arguments: [],
        };
        return [loginTreeItem];
    }
    getActualTreeItems() {
        const loginTreeItem = new vscode.TreeItem("hello hello?", vscode.TreeItemCollapsibleState.None);
        return [loginTreeItem];
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
}
exports.default = default_1;
//# sourceMappingURL=AccountsProvider.js.map