export interface ChangeDetail {
  line: number;
  added: string;
  removed: string;
}

export interface IDEContent {
  details: string;
  modifiedFiles: ModifiedFile[];
}

export interface ModifiedFile {
  fileName: string;
  sourceCode: string;
}
