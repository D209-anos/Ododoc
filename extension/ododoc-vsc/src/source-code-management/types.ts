export interface ChangeDetail {
  line: number;
  added: string;
  removed: string;
}

export interface IDEContent {
  details: string;
  modifiedFiles: ModifiedFile[];
  errorFile: ErrorFile | null;
}

export interface ModifiedFile {
  fileName: string;
  sourceCode: string;
}

export interface ErrorFile {
  fileName: string;
  sourceCode: string;
  line: number;
}
