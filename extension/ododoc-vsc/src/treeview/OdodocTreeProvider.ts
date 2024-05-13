import * as vscode from "vscode";
import AccountsItem from "./tree-items/AccountsItem";
import { getLoggedInSession } from "../authentication/AuthService";
import axios from "axios";
import DirectoryItem from "./tree-items/DirectoryItem";

export default class OdodocTreeProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  > = new vscode.EventEmitter<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  >();
  public readonly onDidChangeTreeData: vscode.Event<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  > = this._onDidChangeTreeData.event;

  private static instance: OdodocTreeProvider;
  private context: vscode.ExtensionContext;
  private directoryCache: Directory | null = null; // 전체 디렉토리 구조를 저장하는 캐시
  private connectedFileItem: DirectoryItem | null = null; // 연결할 파일

  public static getInstance(
    context: vscode.ExtensionContext
  ): OdodocTreeProvider {
    if (!this.instance) {
      this.instance = new OdodocTreeProvider(context);
    }
    return this.instance;
  }
  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
    // TreeView를 생성하고 확장 기능에 등록
    const treeView = vscode.window.createTreeView("ododoc.main", {
      treeDataProvider: this,
      showCollapseAll: true,
    });
    context.subscriptions.push(treeView);

    context.subscriptions.push(
      // 트리 아이템이 선택될 때 이벤트 처리
      treeView.onDidChangeSelection((e) => this.onDidChangeSelection(e))
    );

    context.subscriptions.push(
      // 인증 세션이 변경될 때 TreeView를 새로 고침
      vscode.authentication.onDidChangeSessions(() => {
        this.refresh();
      })
    );

    // 새로고침 커맨드 등록
    context.subscriptions.push(
      vscode.commands.registerCommand("ododoc.refreshTreeView", () => {
        this.refresh();
      })
    );
  }

  // TreeView를 새로 고침
  public refresh = (): void => {
    this.directoryCache = null; // 캐시를 초기화
    this._onDidChangeTreeData.fire(); // 이벤트 발생
  };

  // 각 TreeItem을 어떻게 표시할 것인지 정의
  public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  // 트리 뷰에 표시할 노드들을 가져옴
  public async getChildren(
    element?: vscode.TreeItem
  ): Promise<vscode.TreeItem[]> {
    const loggedInSession = await getLoggedInSession();
    if (loggedInSession) {
      this.directoryCache = await this.loadDirectory(
        loggedInSession.accessToken
      );
      if (this.directoryCache) {
        // 비어있으면 없다 반환
        if (element instanceof AccountsItem) {
          // 계정 하위의 디렉토리 항목을 반환
          return this.getDirectoryItemsFromCache(null); // Root items
        } else if (element instanceof DirectoryItem) {
          // 특정 디렉토리의 하위 요소를 반환
          return this.getDirectoryItemsFromCache(element.itemId);
        } else {
          // 최상위 계정 항목을 반환
          const accountsItem = new AccountsItem(
            this.directoryCache.name,
            vscode.TreeItemCollapsibleState.Expanded
          );
          return [accountsItem];
        }
      }
    }
    return [];
  }

  // 캐시에서 디렉토리 아이템을 가져옴
  private getDirectoryItemsFromCache(parentId: number | null): DirectoryItem[] {
    if (!this.directoryCache) {
      return [];
    }

    // 주어진 parentId에 해당하는 자식 요소를 찾음
    const findChildren = (
      directory: Directory,
      parentId: number | null
    ): Directory[] => {
      if (parentId === null) {
        return directory.children ?? [];
      }

      const stack = [directory];
      while (stack.length > 0) {
        const current = stack.pop()!;
        if (current.id === parentId) {
          return current.children ?? [];
        }
        if (current.children) {
          stack.push(...current.children);
        }
      }
      return [];
    };

    const children = findChildren(this.directoryCache, parentId);

    // 자식 요소를 DirectoryItem 객체로 변환하여 반환
    return children.map(
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

  // API를 통해 전체 디렉토리 데이터를 불러옴
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

      return response.data.data;
    } catch (error) {
      console.error("Failed to load directory:", error);
      return null;
    }
  }

  private async onDidChangeSelection(
    event: vscode.TreeViewSelectionChangeEvent<vscode.TreeItem>
  ) {
    const selectedItem = event.selection[0];
    if (selectedItem instanceof DirectoryItem && selectedItem.type === "FILE") {
      const confirm = await vscode.window.showInformationMessage(
        `연동하시겠습니까?`,
        { modal: false },
        "확인",
        "취소"
      );

      if (confirm === "확인") {
        if (this.connectedFileItem) {
          this.connectedFileItem.setSelected(false);
          this._onDidChangeTreeData.fire(this.connectedFileItem);
        }
        selectedItem.setSelected(true);
        this.connectedFileItem = selectedItem;
        this._onDidChangeTreeData.fire(selectedItem);

        this.context.secrets.store(
          "connectedFileId",
          selectedItem.id.toString()
        );
      }
    }
  }
}

// API 응답 타입 정의
interface Response {
  status: number;
  data: any;
}

// 디렉토리 구조 타입 정의
interface Directory {
  id: number;
  name: string;
  type: "FOLDER" | "FILE";
  children?: Directory[];
}
