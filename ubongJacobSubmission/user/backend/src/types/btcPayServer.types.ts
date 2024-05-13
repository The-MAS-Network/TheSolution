interface Checkout {
  speedPolicy: string;
  paymentMethods: string[];
  defaultPaymentMethod: string;
  expirationMinutes: number;
  monitoringMinutes: number;
  paymentTolerance: number;
  redirectURL: string | null;
  redirectAutomatically: boolean;
  requiresRefundEmail: boolean | null;
  defaultLanguage: string | null;
  checkoutType: string | null;
  lazyPaymentMethods: string[] | null;
}

interface Receipt {
  enabled: boolean | null;
  showQR: boolean | null;
  showPayments: boolean | null;
}

export interface CreateNewInvoiceRes {
  id: string;
  storeId: string;
  amount: string;
  checkoutLink: string;
  status: string;
  additionalStatus: string;
  monitoringExpiration: number;
  expirationTime: number;
  createdTime: number;
  availableStatusesForManualMarking: string[];
  archived: boolean;
  type: string;
  currency: string;
  metadata: Record<string, any>;
  checkout: Checkout;
  receipt: Receipt;
}

interface PaymentData {
  activated: boolean;
  destination: string;
  paymentLink: string;
  rate: string;
  paymentMethodPaid: string;
  totalPaid: string;
  due: string;
  amount: string;
  networkFee: string;
  payments: any[]; // Assuming payments can be any type of array
  paymentMethod: string;
  cryptoCode: string;
  additionalData: {
    paymentHash: string;
  };
}

export type GetPaymentMethodDetailsRes = PaymentData[];

export interface CreatePayoutRes {
  date: number;
  id: string;
  pullPaymentId: string | null;
  destination: string;
  paymentMethod: string;
  cryptoCode: string;
  amount: string;
  paymentMethodAmount: string;
  state: string;
  revision: number;
  paymentProof: string | null;
  metadata: Record<string, any>;
}

export interface CreatePayoutErrorRes {
  path: string;
  message: string;
}

export interface CreateOnChainWalletAddressErrorRes {
  code: string;
  message: string;
}

export interface CreateOnChainWalletAddressRes {
  address: string;
  keyPath: string;
  paymentLink: string;
}
