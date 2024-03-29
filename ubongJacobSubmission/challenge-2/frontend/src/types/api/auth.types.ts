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

export interface UserData {
  id: string;
  lightningAddress: string;
  isVerified: boolean;
  nickName: string;
  imageURL: string | null;
  createdAt: string;
  updatedAt: string;
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

export interface CreateInvoiceParams {
  lightningAddress: string;
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
