import { ICreateOrdinals } from "../drizzle/schema";

export interface CreateOrdinalReq extends ICreateOrdinals {
  ordinalId: string;
  ordinalNumber: string;
  ordinalCollectionId: string;
}

export interface GetCollectionsReq {
  status: string;
}
