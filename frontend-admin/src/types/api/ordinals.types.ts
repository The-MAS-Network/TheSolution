import { CursorReq, GenericAPIResponse, NormalUserData } from ".";

export interface OrdinalCollection {
  id: string;
  numericId: number;
  isActive: boolean;
}

export interface GetOrdinalCollectionsReq extends CursorReq {
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
  contentType: string;
  mimeType: string;
  possibleOrdinalContent: string;
  isAdmin: boolean;
  id: string;
  ordinalId: string;
  user?: NormalUserData | null;
}

export interface GetOrdinalsByOrdinalsCollectionIdRes
  extends GenericAPIResponse {
  data: {
    ordinalsCollection: OrdinalCollection;
    ordinals: Ordinal[];
  };
}

export interface AddOrdinalReq {
  ordinalId: string;
  mimeType: string;
  contentType: string;
  ordinalCollectionId: string;
  possibleOrdinalContent?: string;
}

export interface DeleteOrdinalReq {
  ordinalId: string;
  ordinalCollectionId: string;
}

export interface TipSingleOrdinalUser {
  otp: string;
  collectionId: string;
  amount: number;
  lightningAddress: string;
  currency: CurrencyType;
}
export interface TipCommunity {
  otp: string;
  collectionId: string;
  totalAmount: number;
  currency: CurrencyType;
}

export interface TipCommunityRes extends GenericAPIResponse {
  data: TipGroup;
}

export type CurrencyType = "BTC" | "USD" | "SATS";

export interface TipGroup {
  id: string;
  totalTip: number;
  type: "single_tip" | "group_tip";
  createdAt: string;
  updatedAt: string;
  singleTip: OrdinalTip;
  ordinalCollection: OrdinalCollection;
  totalSent: number;
}

export interface OrdinalTip {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  lightningAddress: string;
  status: string;
  imageURL: string | null;
  error: null;
  createdAt: string;
  updatedAt: string;
}
export interface GetAllTipGroupsRes extends GenericAPIResponse {
  data: TipGroup[];
}

export interface GetAllTipsByGroupIdData {
  ordinalTipsGroup: TipGroup;
  ordinalTips: OrdinalTip[];
}

export interface GetAllTipsByGroupIdRes extends GenericAPIResponse {
  data: GetAllTipsByGroupIdData;
}

export interface SingleIdWithCursorReq extends CursorReq {
  id: string;
  size?: number;
}

export interface GetOrdinalsInCollectionByLightningAddressReq {
  collectionId: string;
  lightningAddress: string;
}

export interface GetOrdinalsInCollectionByLightningAddressRes {
  data: Ordinal[];
}
