import { GenericAPIResponse } from "@/types/api";
import {
  AddOrdinalReq,
  CreateOrdinalColletionRes,
  GetOrdinalCollectionsReq,
  GetOrdinalCollectionsRes,
  GetOrdinalsByOrdinalsCollectionIdRes,
  GetSingleOrdinalDataOrOrdinalWalletDataRes,
  GetTotalOrdinalsInACollectionRes,
} from "@/types/api/ordinals.types";
import baseApi from "./base.api";

export const getInactiveOrdinalsKey = "getInactiveOrdinalsKey";
export const getActiveOrdinalCollectionsKey = "getActiveOrdinalCollectionsKey";
export const getOrdinalCollections = ({ status }: GetOrdinalCollectionsReq) =>
  baseApi.get<GetOrdinalCollectionsRes, GenericAPIResponse>(
    `/ordinal-collections?status=${status}`,
  );

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

export const getSingleOrdinalDataKey = "getSingleOrdinalDataKey";
export const getSingleOrdinalDataOrOrdinalWalletData = (id: string) =>
  baseApi.get<GetSingleOrdinalDataOrOrdinalWalletDataRes, GenericAPIResponse>(
    `/ordinals/${id}/data`,
  );

export const getOrdinalsByOrdinalsCollectionIdKey =
  "getOrdinalsByOrdinalsCollectionIdKey";
export const getOrdinalsByOrdinalsCollectionId = (id: string) =>
  baseApi.get<GetOrdinalsByOrdinalsCollectionIdRes, GenericAPIResponse>(
    `/ordinals/${id}`,
  );

export const addOrdinal = (data: AddOrdinalReq) =>
  baseApi.post<GenericAPIResponse>("/ordinals", data);

export const deleteOrdinal = (id: string) =>
  baseApi.delete<GenericAPIResponse>(`/ordinals/${id}`);
