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
const AccountsItem_1 = __importDefault(require("./tree_items/AccountsItem"));
const AuthService_1 = require("../authentication/AuthService");
class OdodocTreeProvider {
    // 데이터 변경이 발생했을 때 TreeView를 새로 고침하도록 vscode에 알리는 데에 사용
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    constructor(context) {
        vscode.window.createTreeView("ododoc.main", {
            treeDataProvider: this,
        });
        context.subscriptions.push(vscode.authentication.onDidChangeSessions(() => {
            this.refresh();
        }));
    }
    refresh = () => {
        console.log("refresh");
        this._onDidChangeTreeData.fire();
    };
    // 각 노드를 어떻게 표시할 것인지 정의
    getTreeItem(element) {
        return element;
    }
    // 트리 뷰에 표시할 노드들
    async getChildren(element) {
        const loggedInSession = await (0, AuthService_1.getLoggedInSession)();
        if (loggedInSession !== undefined) {
            return [new AccountsItem_1.default(loggedInSession.account.label)];
        }
        return [];
    }
}
exports.default = OdodocTreeProvider;
//# sourceMappingURL=OdodocTreeProvider.js.map