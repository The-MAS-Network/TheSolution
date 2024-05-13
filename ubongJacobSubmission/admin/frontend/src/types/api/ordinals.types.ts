import { GenericAPIResponse } from ".";

export interface OrdinalCollection {
  id: string;
  numericId: number;
  isActive: boolean;
}

export interface GetOrdinalCollectionsReq {
  status: "active" | "inactive";
}

export interface GetOrdinalCollectionsRes extends GenericAPIResponse {
  data: OrdinalCollection[];
}
export interface GetTotalOrdinalsInACollectionRes extends GenericAPIResponse {
  data: number;
}

export interface CreateOrdinalColletionRes extends GenericAPIResponse {
  data: OrdinalCollection;
}

export interface SpecificInscriptionResponse {
  id: string;
  number: number;
  address: string;
  genesis_address: string;
  genesis_block_height: number;
  genesis_block_hash: string;
  genesis_tx_id: string;
  genesis_fee: string;
  genesis_timestamp: number;
  tx_id: string;
  location: string;
  output: string;
  value: string;
  offset: string;
  sat_ordinal: string;
  sat_rarity: string;
  sat_coinbase_height: number;
  mime_type: string;
  content_type: string;
  content_length: number;
  timestamp: number;
  curse_type: null | string; // Assuming it can be null or a string
  recursive: boolean;
  recursion_refs: null | any[]; // Assuming it can be null or an array of any type
}

export interface GetSingleOrdinalDataOrOrdinalWalletDataRes
  extends GenericAPIResponse {
  data: {
    limit: number;
    offset: null;
    total: number;
    results: SpecificInscriptionResponse[];
  };
}

export interface Ordinal {
  id: string;
  ordinalId: string;
  ordinalNumber: string;
  ordinalCollectionId: string;
  ordinalCollection: OrdinalCollection;
  contentType: string;
  mimeType: string;
  possibleOrdinalContent: string;
}

export interface GetOrdinalsByOrdinalsCollectionIdRes
  extends GenericAPIResponse {
  data: Ordinal[];
}

export interface AddOrdinalReq {
  ordinalId: string;
  ordinalNumber: string;
  mimeType: string;
  contentType: string;
  ordinalCollectionId: string;
  possibleOrdinalContent?: string;
}
