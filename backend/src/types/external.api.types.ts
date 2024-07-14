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

export interface BTC_com_GetAddressTransactionRespone {
  data: {
    list: null;
    page: 1;
    page_total: 0;
    pagesize: 10;
    total_count: 0;
  };
  err_code: 0;
  err_no: 0;
  message: "success";
  status: "success";
}

interface BTC_COM_Transaction {
  tx_hash: string;
  tx_output_n: number;
  tx_output_n2: number;
  value: number;
  confirmations: number;
}

interface BTC_com_Data {
  list: BTC_COM_Transaction[];
  page: number;
  page_total: number;
  pagesize: number;
  total_count: number;
}

export interface BTC_com_WalletDataResponse {
  data: BTC_com_Data;
  err_code: number;
  err_no: number;
  message: string;
  status: string;
}

interface BTC_COM_TransactionInput {
  prev_addresses: string[];
  prev_position: number;
  prev_tx_hash: string;
  prev_type: string;
  prev_value: number;
  sequence: number;
}

interface BTC_COM_TransactionOnput {
  addresses: string[];
  value: number;
  type: string;
  spent_by_tx: string;
  spent_by_tx_position: number;
}

interface BTC_COM_BlockData {
  block_height: number;
  block_hash: string;
  block_time: number;
  created_at: number;
  confirmations: number;
  fee: number;
  hash: string;
  inputs_count: number;
  inputs_value: number;
  is_coinbase: boolean;
  is_double_spend: boolean;
  is_sw_tx: boolean;
  lock_time: number;
  outputs_count: number;
  outputs_value: number;
  sigops: number;
  size: number;
  version: number;
  vsize: number;
  weight: number;
  witness_hash: string;
  inputs: BTC_COM_TransactionInput[];
  outputs: BTC_COM_TransactionOnput[];
}

export interface BTC_COM_SINGLE_TRANSACTION {
  data: BTC_COM_BlockData;
  err_code: number;
  err_no: number;
  message: string;
  status: string;
}
