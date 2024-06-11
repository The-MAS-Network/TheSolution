import { OTPPurpose } from "../../utilities/enums";

export interface VerifyOTPReq {
  otp: string;
  purpose: string;
}

export type OtpReqType =
  | OTPPurpose.FORGOT_PASSWORD
  | OTPPurpose.ON_BOARDING
  | OTPPurpose.TIP_COLLECTION
  | OTPPurpose.TIP_USER;
export interface CreateOTPReq {
  email: string;
  purpose: OtpReqType;
}

export interface ChangePasswordReq {
  id: string;
  password: string;
  oldPassword: string;
}
