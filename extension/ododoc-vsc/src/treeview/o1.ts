import * as vscode from "vscode";
import AccountsItem from "./tree_items/AccountsItem";
import { getLoggedInSession } from "../authentication/AuthService";
import axios from "axios";
import DirectoryItem from "./tree_items/DirectoryItem";

export default class OdodocTreeProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  // 데이터 변경이 발생했을 때 TreeView를 새로 고침하도록 vscode에 알리는 데에 사용
  private _onDidChangeTreeData: vscode.EventEmitter<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  > = new vscode.EventEmitter<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  >();
  onDidChangeTreeData: vscode.Event<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  > = this._onDidChangeTreeData.event;

  private context: vscode.ExtensionContext;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    vscode.window.createTreeView("ododoc.main", {
      treeDataProvider: this,
    });
    context.subscriptions.push(
      vscode.authentication.onDidChangeSessions(() => {
        this.refresh();
      })
    );
  }

  refresh = (): void => {
    console.log("refresh");
    this._onDidChangeTreeData.fire();
  };

  // 각 노드를 어떻게 표시할 것인지 정의
  getTreeItem(
    element: vscode.TreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  // 트리 뷰에 표시할 노드들
  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    const loggedInSession = await getLoggedInSession();
    if (loggedInSession !== undefined) {
      const accountsItem = new AccountsItem(loggedInSession.account.label);
      const directoryItems = await this.getDirectoryItems(
        loggedInSession.accessToken
      );
      return [accountsItem, ...directoryItems];
    }
    return [];
  }

  // 디렉토리 TreeItem에 표시할 노드들 불러오기
  private async getDirectoryItems(token: string): Promise<vscode.TreeItem[]> {
    // const directory = await this.loadDirectory(token);
    const directory: Directory = {
      id: 1,
      name: "아노쓰님의 정리공간",
      type: "FOLDER",
      children: [
        {
          id: 2,
          name: "폴더명",
          type: "FOLDER",
          children: [
            {
              id: 3,
              name: "2024-05-03",
              type: "FILE",
              children: [],
            },
          ],
        },
        {
          id: 4,
          name: "2024-05-03",
          type: "FILE",
          children: [],
        },
      ],
    };
    console.log("directory: ", directory);
    if (!directory) {
      return [];
    }

    if (!directory.children) {
      return [
        new DirectoryItem(
          "empty",
          "Empty directory",
          vscode.TreeItemCollapsibleState.None,
          "FILE",
          this.context,
          directory.id
        ),
      ];
    }

    return directory.children.map(
      (item) =>
        new DirectoryItem(
          item.id.toString(),
          item.name,
          item.type === "FOLDER"
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None,
          item.type,
          this.context,
          item.id
        )
    );
  }

  // directory 데이터 불러오기
  private async loadDirectory(token: string): Promise<Directory | null> {
    try {
      const rootId = await this.context.secrets.get("rootId");
      if (!rootId) {
        throw new Error("Root ID is not set in secrets.");
      }
      const response = await axios.get<Response>(
        `https://k10d209.p.ssafy.io/api/directory/${rootId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const directory = response.data.data;
      return directory;
    } catch (error) {
      console.error("Failed to load directory:", error);
      return null;
    }
  }
}

// 타입 정의
interface Response {
  status: number;
  data: any;
}

interface Directory {
  id: number;
  name: string;
  type: "FOLDER" | "FILE";
  children: Directory[];
}
