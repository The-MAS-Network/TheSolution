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

export interface InscriptionErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}

export interface OrdinalsResponse {
  limit: number;
  offset: null;
  total: number;
  results: SpecificInscriptionResponse[];
}
