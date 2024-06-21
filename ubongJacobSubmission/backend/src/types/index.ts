import { Cursor } from "typeorm-cursor-pagination";
import { InvoicePurpose } from "../entities/BtcPayServerPayments.entity";

export interface MetaData {
  cursor?: Cursor;
}
export interface GenericAPIResponse {
  message: string;
  status: boolean;
  data?: [] | {};
  metadata?: MetaData;
}

export interface DualPaymentsParams {
  firstAmount: number;
  secondAmount: number;
  id: string;
  lightningAddress: string;
  purpose: InvoicePurpose.FORGOT_PASSWORD | InvoicePurpose.VERIFY_ACCOUNT;
}

export interface ValidateCreateInvoiceParams {
  lightningAddress: string;
  purpose: InvoicePurpose.FORGOT_PASSWORD | InvoicePurpose.VERIFY_ACCOUNT;
}

export interface SingleDataByIdReq {
  id: string;
}

export interface JoiID {
  min?: number;
  max?: number;
}
