import { InvoicePurpose } from "../entities/BtcPayServerPayments.entity";

export interface MetaData {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
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
