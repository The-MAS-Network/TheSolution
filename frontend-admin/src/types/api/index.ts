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

export interface NormalUserData {
  id: string;
  nickName: string;
  lightningAddress: string;
  imageURL: null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
