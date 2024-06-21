import { CursorReq, GenericAPIResponse } from ".";

export interface GetLeaderboardRes extends GenericAPIResponse {
  data: {
    id: string;
    amount: number;
    lightningAddress: string;
    imageURL: string | null;
    createdAt: string;
  }[];
}

export interface GetAllTipGroupsReq extends CursorReq {
  duration: "WEEKLY" | "ALL_TIME";
}
