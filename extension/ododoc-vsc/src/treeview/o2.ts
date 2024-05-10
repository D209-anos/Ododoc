import * as vscode from "vscode";
import AccountsItem from "./tree_items/AccountsItem";
import { getLoggedInSession } from "../authentication/AuthService";
import axios from "axios";
import DirectoryItem from "./tree_items/DirectoryItem";

export default class OdodocTreeProvider
  implements vscode.TreeDataProvider<DirectoryItem>
{
  // TreeView를 새로 고침할 수 있도록 하는 이벤트 발생기
  private _onDidChangeTreeData: vscode.EventEmitter<
    DirectoryItem | undefined | void
  > = new vscode.EventEmitter<DirectoryItem | undefined | void>();
  public readonly onDidChangeTreeData: vscode.Event<
    DirectoryItem | undefined | void
  > = this._onDidChangeTreeData.event;

  private context: vscode.ExtensionContext;
  private directoryCache: Directory | null = null; // 전체 디렉토리 구조를 저장하는 캐시

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    // TreeView를 생성하고 확장 기능에 등록
    vscode.window.createTreeView("ododoc.main", {
      treeDataProvider: this,
      showCollapseAll: true,
    });
    context.subscriptions.push(
      // 인증 세션이 변경될 때 TreeView를 새로 고침
      vscode.authentication.onDidChangeSessions(() => {
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
  public getTreeItem(element: DirectoryItem): vscode.TreeItem {
    return element;
  }

  // 트리 뷰에 표시할 노드들을 가져옴
  public async getChildren(element?: DirectoryItem): Promise<DirectoryItem[]> {
    const loggedInSession = await getLoggedInSession();
    if (loggedInSession) {
      if (!this.directoryCache) {
        // 전체 디렉토리 구조를 한 번만 로드
        this.directoryCache = await this.loadDirectory(
          loggedInSession.accessToken
        );
      }
      if (this.directoryCache) {
        if (element) {
          // 특정 디렉토리의 하위 요소를 반환
          return this.getDirectoryItemsFromCache(element.itemId);
        } else {
          // 루트 요소를 반환
          return this.getDirectoryItemsFromCache(null);
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
