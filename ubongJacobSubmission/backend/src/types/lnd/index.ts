export interface GetLNURLDetails {
  callback: number;
  metadata: string;
  maxSendable: number;
  minSendable: number;
  status: string;
  tag: string;
  commentAllowed: number;
  allowsNostr: boolean;
  nostrPubkey: string;
}

export interface GenInvoiceURLResponse {
  routes: [];
  pr: string;
}

export interface HandleLNURLPaymentProps {
  address: string;
  amountInSat: number;
}
