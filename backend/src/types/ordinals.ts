import { Ordinals } from "../entities/ordinal/Ordinals.entity";

export interface DeleteOrdinalReq {
  ordinalId: string;
  ordinalCollectionId: string;
}
export type CreateOrdinalReq = DeleteOrdinalReq & Ordinals;

export interface GetCollectionsReq {
  status: string;
}
