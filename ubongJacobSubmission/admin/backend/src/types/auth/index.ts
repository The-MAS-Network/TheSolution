export interface VerifyOTPReq {
  otp: string;
  purpose: string;
}

export interface CreateOTPReq {
  email: string;
  purpose: "FORGOT_PASSWORD" | "ON_BOARDING";
}

export interface ChangePasswordReq {
  id: string;
  password: string;
  oldPassword: string;
}
