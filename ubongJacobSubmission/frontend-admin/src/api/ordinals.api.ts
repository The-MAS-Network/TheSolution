import { CursorReq, GenericAPIResponse } from "@/types/api";
import {
  AddOrdinalReq,
  CreateOrdinalColletionRes,
  DeleteOrdinalReq,
  GetAllTipGroupsRes,
  GetAllTipsByGroupIdRes,
  GetOrdinalCollectionsReq,
  GetOrdinalCollectionsRes,
  SingleIdWithCursorReq,
  GetOrdinalsByOrdinalsCollectionIdRes,
  GetSingleOrdinalDataOrOrdinalWalletDataRes,
  GetTotalOrdinalsInACollectionRes,
  TipCommunity,
  TipSingleOrdinalUser,
  GetOrdinalsInCollectionByLightningAddressReq,
  GetOrdinalsInCollectionByLightningAddressRes,
  TipCommunityRes,
} from "@/types/api/ordinals.types";
import baseApi, { DEFAULT_API_DATA_SIZE } from "./base.api";
import { handleApiErrors } from "@/utilities/handleErrors";

export const getInactiveOrdinalsKey = "getInactiveOrdinalsKey";
export const getActiveOrdinalCollectionsKey = "getActiveOrdinalCollectionsKey";

export const getOrdinalCollections = async ({
  status,
  cursor,
}: GetOrdinalCollectionsReq) => {
  const response = await baseApi.get<
    GetOrdinalCollectionsRes,
    GenericAPIResponse
  >(
    `/ordinal-collections?status=${status}&size=${DEFAULT_API_DATA_SIZE}&cursor=${cursor}`,
  );

  if (response.ok) {
    return response?.data;
  } else {
    handleApiErrors(response);
    return null;
  }
};

export const getTotalOrdinalsInACollection = (id: string) =>
  baseApi.get<GetTotalOrdinalsInACollectionRes, GenericAPIResponse>(
    `/ordinal-collections/total-ordinals/${id}`,
  );

export const deleteOrdinalCollection = (id: string) =>
  baseApi.delete<GenericAPIResponse>(`/ordinal-collections/${id}`);

export const createOrdinalCollection = () =>
  baseApi.post<CreateOrdinalColletionRes, GenericAPIResponse>(
    "/ordinal-collections",
  );

export const toggleOrdinalCollectionStatus = (id: string) =>
  baseApi.patch<GenericAPIResponse>(`/ordinal-collections/${id}`);

export const getOrdinalsInCollectionByLightningAddress = async ({
  collectionId,
  lightningAddress,
}: GetOrdinalsInCollectionByLightningAddressReq) => {
  const response =
    await baseApi.get<GetOrdinalsInCollectionByLightningAddressRes>(
      `/ordinal-collections/lightning?collectionId=${collectionId}&address=${lightningAddress}`,
    );
  if (response?.ok && response?.data) return response?.data;
  else {
    handleApiErrors(response);
    return null;
  }
};

export const getSingleOrdinalDataKey = "getSingleOrdinalDataKey";
export const getSingleOrdinalDataOrOrdinalWalletData = (id: string) =>
  baseApi.get<GetSingleOrdinalDataOrOrdinalWalletDataRes, GenericAPIResponse>(
    `/ordinals/${id}/data`,
  );

export const getOrdinalsByOrdinalsCollectionIdKey =
  "getOrdinalsByOrdinalsCollectionIdKey";

export const getOrdinalsByOrdinalsCollectionId = async ({
  cursor,
  id,
}: SingleIdWithCursorReq) => {
  const response = await baseApi.get<
    GetOrdinalsByOrdinalsCollectionIdRes,
    GenericAPIResponse
  >(
    `/ordinals/${id}?size=${DEFAULT_API_DATA_SIZE}${cursor ? `&cursor=${cursor}` : ""}`,
  );

  if (response.ok && !!response?.data) {
    return response?.data;
  } else {
    handleApiErrors(response);
    return null;
  }
};

export const addOrdinal = (data: AddOrdinalReq) =>
  baseApi.post<GenericAPIResponse>("/ordinals", data);

export const deleteOrdinal = (data: DeleteOrdinalReq) =>
  baseApi.post<GenericAPIResponse>("/ordinals/delete", data);

export const generatePaymentOTP = (data: {
  purpose: "Tip user" | "Tip collection";
}) => baseApi.post<GenericAPIResponse>("/payment/generate-otp", data);

export const tipCommunity = (data: TipCommunity) =>
  baseApi.post<TipCommunityRes, GenericAPIResponse>(
    "/payment/tip-community",
    data,
  );

export const tipSingleOrdinalUser = (data: TipSingleOrdinalUser) =>
  baseApi.post<GenericAPIResponse>("/payment/tip-user", data);

export const getAllTipGroupsKey = "getAllTipGroupsKey";
export const getAllTipGroups = async ({ cursor }: CursorReq) => {
  const response = await baseApi.get<GetAllTipGroupsRes, GenericAPIResponse>(
    `/payment?size=${DEFAULT_API_DATA_SIZE}${!!cursor ? `cursor=${cursor}` : ""}`,
  );

  if (response.ok) {
    return response?.data;
  } else {
    handleApiErrors(response);
    return null;
  }
};

export const getOrdinalTipsByGroupId = async ({
  cursor,
  id,
  size = DEFAULT_API_DATA_SIZE,
}: SingleIdWithCursorReq) => {
  const response = await baseApi.get<
    GetAllTipsByGroupIdRes,
    GenericAPIResponse
  >(`/payment/${id}?size=${size}${!!cursor ? `cursor=${cursor}` : ""}`);

  if (response.ok) {
    return response?.data;
  } else {
    handleApiErrors(response);
    return null;
  }
};
