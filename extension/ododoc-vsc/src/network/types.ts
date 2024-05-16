import { IDEContent } from "../source-code-management/types";

export interface MessageData {
  sourceApplication: string;
  accessToken: string;
  connectedFileId: number;
  dataType: string;
  content: IDEContent;
  timestamp: string;
}
