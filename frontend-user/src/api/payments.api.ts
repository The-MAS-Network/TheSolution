import {
  GetAllTipGroupsReq,
  GetLeaderboardRes,
} from "@/types/api/payments.types";
import { handleApiErrors } from "@/utilities/handleErrors";
import baseApi, { DEFAULT_API_DATA_SIZE } from "./base.api";

export const getLeaderboard = async ({
  cursor,
  duration,
}: GetAllTipGroupsReq) => {
  const response = await baseApi.get<GetLeaderboardRes>(
    `/payment/leaderboard?size=${DEFAULT_API_DATA_SIZE}&duration=${duration}${cursor ? `&cursor=${cursor}` : ""}`,
  );

  if (response.ok) {
    return response?.data;
  } else {
    handleApiErrors(response);
    return null;
  }
};
