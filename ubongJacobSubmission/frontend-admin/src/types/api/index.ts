export interface GenericAPIResponse extends MetaData {
  message?: string;
  status: boolean;
}

export interface CursorReq {
  cursor: string | null;
}

export interface Cursor {
  afterCursor: string | null;
  beforeCursor: string | null;
}

export interface MetaData {
  metadata?: {
    cursor?: Cursor;
  };
}
