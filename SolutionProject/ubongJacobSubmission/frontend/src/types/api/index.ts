export interface GenericAPIResponse {
  message?: string;
  status: boolean;
}

export interface MetaData {
  metadata: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
}
