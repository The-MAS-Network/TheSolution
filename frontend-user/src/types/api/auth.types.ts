import { GenericAPIResponse } from ".";

export interface LoginRequest {
  lightningAddress: string;
  password: string;
}

export interface RegisterRequest {
  lightningAddress: string;
  password: string;
  nickName: string;
}

export interface NickNameRequest {
  nickname: string;
}

export interface OrdinalWalletData {
  id: string;
  onChainWallet: string;
  address: string;
  isVerified: false;
  isBroadcasted: false;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  id: string;
  nickName: string;
  lightningAddress: string;
  imageURL: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  ordinalWallet: OrdinalWalletData | null;
}

interface LoginData extends UserData {
  token: string;
}

export interface LoginResponse extends GenericAPIResponse {
  data: LoginData;
}

export interface RegisterResponse extends GenericAPIResponse {
  data: UserData;
}

export interface ForgotPasswordRequest {
  lightningAddress: string;
}

export interface CreateInvoiceRes extends GenericAPIResponse {
  data: {
    destination: string;
  };
}
export interface VerifyInvoiceRes extends GenericAPIResponse {
  data: {
    invoiceId: string;
  };
}

export type CreateInvoicePurpose = "forgot_password" | "verify_account";

export interface CreateInvoiceParams {
  lightningAddress: string;
  purpose: CreateInvoicePurpose;
}

export interface VerifyInvoiceParams {
  destination: string;
  lightningAddress: string;
}

export interface VerifyDualAmountParams {
  firstAmount: number;
  secondAmount: number;
  id: string;
  lightningAddress: string;
  purpose: CreateInvoicePurpose;
}

export interface VerifyDualAmountRes extends GenericAPIResponse {
  data: {
    token: string;
  };
}
export interface VerifyDualAmountError extends GenericAPIResponse {
  data?: {
    trialCount?: number;
  };
}

export interface GetMaxTrialRes extends GenericAPIResponse {
  data: number;
}

export interface ChangePasswordParams {
  password: string;
  token: string;
}

export interface VerifyOrdinalTransactionRes extends GenericAPIResponse {
  data: OrdinalWalletData;
}
