import { GenericAPIResponse } from ".";

export interface LoginRequest {
  email: string;
  password: string;
}
export interface GenerateOTPRequest {
  email: string;
  purpose: "FORGOT_PASSWORD" | "ON_BOARDING";
}
export interface VerifyOTPRequest {
  otp: string;
  purpose: "FORGOT_PASSWORD" | "ON_BOARDING";
}

export interface VerifyOTPResponse extends GenericAPIResponse {
  data: { token: string; id: string };
}

export interface ResetPasswordReq {
  id: string;
  password: string;
  token: string;
}

export interface ChangePasswordReq extends ResetPasswordReq {
  oldPassword: string;
}

// export interface RegisterRequest {
//   lightningAddress: string;
//   password: string;
//   nickName: string;
// }

// export interface NickNameRequest {
//   nickname: string;
// }

export interface UserData {
  email: string;
  isVerified: boolean;
}

interface LoginData extends UserData {
  token: string;
}

export interface LoginResponse extends GenericAPIResponse {
  data: LoginData;
}

// export interface RegisterResponse extends GenericAPIResponse {
//   data: UserData;
// }

// export interface ForgotPasswordRequest {
//   lightningAddress: string;
// }

// export interface CreateInvoiceRes extends GenericAPIResponse {
//   data: {
//     destination: string;
//   };
// }
// export interface VerifyInvoiceRes extends GenericAPIResponse {
//   data: {
//     invoiceId: string;
//   };
// }

// export interface CreateInvoiceParams {
//   lightningAddress: string;
// }

// export interface VerifyInvoiceParams {
//   destination: string;
//   lightningAddress: string;
// }

// export interface VerifyDualAmountParams {
//   firstAmount: number;
//   secondAmount: number;
//   id: string;
//   lightningAddress: string;
// }

// export interface VerifyDualAmountRes extends GenericAPIResponse {
//   data: {
//     token: string;
//   };
// }
// export interface VerifyDualAmountError extends GenericAPIResponse {
//   data?: {
//     trialCount?: number;
//   };
// }

// export interface GetMaxTrialRes extends GenericAPIResponse {
//   data: number;
// }

// export interface ChangePasswordParams {
//   password: string;
//   token: string;
// }
