import { Repository } from "typeorm";
import { OrdinalWallets } from "../entities/ordinal/OrdinalWallets.entity";
import { CreateOrdinalReq } from "./ordinals";

export interface InscriptionData {
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
  curse_type: string | null;
  recursive: boolean;
  recursion_refs: any | null;
}

export interface GetOrdinalsFromWalletAddress {
  limit: number;
  offset: number;
  total: number;
  results: InscriptionData[];
}

export interface GetOrdinalsFromWalletAddressProps {
  limit?: number;
  offset: number;
  address: string;
}

export interface GetOrdinalError {
  statusCode: number;
  error: string;
  message: string;
}

interface Bech32Data {
  data: string;
  version: number;
}

interface ValidateAddress {
  isvalid: boolean;
  address: string;
  scriptPubKey: string;
  isscript: boolean;
  iswitness: boolean;
  witness_version: number;
  witness_program: string;
}

interface TxHistory {
  txCount: number;
  txids: string[];
  blockHeightsByTxid: { [txid: string]: number };
  balanceSat: number;
  request: {
    limit: number;
    offset: number;
    sort: string;
  };
}

export interface GetBlockExplorerWalletDataRes {
  bech32: Bech32Data;
  encoding: string;
  validateaddress: ValidateAddress;
  electrumScripthash: string;
  txHistory: TxHistory;
}

interface ScriptSig {
  asm: string;
  hex: string;
  address: string;
  type: string;
}

interface Vin {
  txid: string;
  vout: number;
  scriptSig: ScriptSig;
  txinwitness: string[];
  sequence: number;
  value: number;
}

interface ScriptPubKey {
  asm: string;
  desc: string;
  hex: string;
  address: string;
  type: string;
}

interface Vout {
  value: number;
  n: number;
  scriptPubKey: ScriptPubKey;
}

interface Fee {
  amount: number;
  unit: string;
}

export interface GetBlockExplorerTransactionDetailsRes {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  hex: string;
  blockhash: string;
  confirmations: number;
  time: number;
  blocktime: number;
  fee: Fee;
}

export interface ConfirmBothWalletsProps {
  wallet: OrdinalWallets;
  ordinalWalletsRepository: Repository<OrdinalWallets>;
  transactionID: string;
}

export interface SaveOrdinalInDbProps extends Partial<CreateOrdinalReq> {
  isAdmin: boolean;
}

export interface SaveOrdinalByUserInDb {
  lightningAddress: string;
  contentType: string;
  mimeType: string;
  ordinalId: string;
  possibleOrdinalContent?: string;
}
