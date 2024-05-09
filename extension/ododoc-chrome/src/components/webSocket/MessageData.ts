import { SenderState } from "./SenderState";

export interface MessageData {
  senderState: SenderState;
  connectedFileId: number;
  dataType: string;
  contents: string;
  timestamp: Date;
}
