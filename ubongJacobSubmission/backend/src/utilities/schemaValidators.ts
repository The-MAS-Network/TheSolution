import Joi, { Schema } from "joi";
import { Users } from "../entities/Users.entity";
import { LightningAddress } from "../controllers/user";
import {
  DualPaymentsParams,
  JoiID,
  ValidateCreateInvoiceParams,
} from "../types";
import { InvoicePurpose } from "../entities/BtcPayServerPayments.entity";

import { ChangePasswordReq, CreateOTPReq, VerifyOTPReq } from "../types/admin";
import { SingleDataByIdReq } from "../types";
import {
  CreateOrdinalReq,
  DeleteOrdinalReq,
  GetCollectionsReq,
} from "../types/ordinals";
import enums, { LeaderboardDurations } from "./enums";
import { Admins } from "../entities/admin/Admins.entity";
import { LeaderboardReq } from "../types/payment.types";

export const LightningSchema = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: false,
  })
  .required()
  .min(3)
  .max(250)
  .label("Lightning Address")
  .messages({
    "string.email": "Invalid lightning address.",
  });

export function validateLoginReq(user: Users) {
  const data: Partial<Record<keyof Users, Schema>> = {
    lightningAddress: LightningSchema,
    password: Joi.string().min(5).max(200).label("Password").required(),
  };

  const schema = Joi.object<Users>(data);
  return schema.validate(user);
}

export function validateUser(user: Users, isRequired = false) {
  const patchData: Partial<Record<keyof Users, Schema>> = {
    lightningAddress: LightningSchema,
    nickName: Joi.string().min(3).max(200).label("Nick name"),
    password: Joi.string().min(5).max(200).label("Password"),
  };

  if (isRequired) {
    for (const key in patchData) {
      // @ts-ignore
      patchData[key] = patchData[key].required();
    }
  }

  const schema = Joi.object<Users>(patchData);
  return schema.validate(user);
}

export function validateUserLightningAddress(
  lightningAddress: LightningAddress
) {
  const patchData: Partial<Record<keyof Users, Schema>> = {
    lightningAddress: LightningSchema,
  };

  const schema = Joi.object<LightningAddress>(patchData);
  return schema.validate(lightningAddress);
}

export function validateProfileEdit(user: Users) {
  const patchData: Partial<Record<keyof Users, Schema>> = {
    nickName: Joi.string().min(3).max(200).label("Nick name").optional(),
    imageURL: Joi.string().min(3).max(9900).label("Image URL").optional(),
  };

  const schema = Joi.object<Users>(patchData);
  return schema.validate(user);
}
export function validateDeleteAccount(user: Partial<Users>) {
  const data: Partial<Record<keyof Users, Schema>> = {
    password: joiSchemas.password,
  };

  const schema = Joi.object<Users>(data);
  return schema.validate(user);
}

export interface PasswordParam {
  password: string;
}

export function validateChangePassword(data: PasswordParam) {
  const initialData: Record<keyof PasswordParam, Schema> = {
    password: Joi.string().min(5).max(200).label("Password").required(),
  };

  const schema = Joi.object<PasswordParam>(initialData);
  return schema.validate(data);
}

export function validateDualAmounts(value: DualPaymentsParams) {
  const data: Record<keyof DualPaymentsParams, Schema> = {
    firstAmount: Joi.number().label("First amount").required(),
    secondAmount: Joi.number().label("Second amount").required(),
    id: Joi.string().min(3).max(255).label("Id").required(),
    lightningAddress: LightningSchema,
    purpose: Joi.string()
      .allow(InvoicePurpose.FORGOT_PASSWORD, InvoicePurpose.VERIFY_ACCOUNT)
      .required(),
  };

  const schema = Joi.object<DualPaymentsParams>(data);
  return schema.validate(value);
}

export function validateCreateInvoice(data: ValidateCreateInvoiceParams) {
  const patchData: Partial<Record<keyof ValidateCreateInvoiceParams, Schema>> =
    {
      lightningAddress: LightningSchema,
      purpose: Joi.string()
        .allow(InvoicePurpose.FORGOT_PASSWORD, InvoicePurpose.VERIFY_ACCOUNT)
        .required(),
    };

  const schema = Joi.object<ValidateCreateInvoiceParams>(patchData);
  return schema.validate(data);
}

type IDParams = { id: string };
interface IDProps {
  data: IDParams;
  minLength?: number;
  maxLength?: number;
}

export function validateId(data: IDProps) {
  const patchData: Partial<Record<keyof IDParams, Schema>> = {
    id: Joi.string()
      .min(data?.minLength ?? 2)
      .max(data?.maxLength ?? 30)
      .required(),
  };

  const schema = Joi.object<IDParams>(patchData);
  return schema.validate(data?.data);
}

export interface ValidateCreateOnchainAddressReq {
  walletAddress: string;
}

export function validateCreateOnchainAddressReq(
  value: ValidateCreateOnchainAddressReq
) {
  const data: Partial<Record<keyof ValidateCreateOnchainAddressReq, Schema>> = {
    walletAddress: Joi.string()
      .min(5)
      .max(200)
      .label("Wallet Address")
      .required(),
  };

  const schema = Joi.object<ValidateCreateOnchainAddressReq>(data);
  return schema.validate(value);
}

export const joiSchemas = {
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: false,
    })
    .min(3)
    .max(250)
    .required(),

  purpose: Joi.string()
    .valid(enums.onboarding, enums.forgotPassword)
    .required(),

  password: Joi.string().min(6).max(255).required(),

  strictPassword: Joi.string()
    .min(8)
    .max(255)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, and one number.",
      "any.required": "Password is required.",
    }),

  OTP: Joi.string().length(6).required(),

  id: (value?: JoiID) =>
    Joi.string()
      .required()
      .min(value?.min ?? 2)
      .max(value?.max ?? 50),
};

export function validateAdminLoginReq(value: Admins) {
  const data: Partial<Record<keyof Admins, Schema>> = {
    email: joiSchemas.email,
    password: Joi.string().min(5).max(200).label("Password").required(),
  };

  const schema = Joi.object<Admins>(data);
  return schema.validate(value);
}

export function validateCreateOTPReq(value: Admins) {
  const data: Partial<Record<keyof CreateOTPReq, Schema>> = {
    email: joiSchemas.email,
    purpose: joiSchemas.purpose,
  };

  const schema = Joi.object<Admins>(data);
  return schema.validate(value);
}

export function validateVerifyOTPReq(value: VerifyOTPReq) {
  const data: Partial<Record<keyof VerifyOTPReq, Schema>> = {
    otp: joiSchemas.OTP,
    purpose: joiSchemas.purpose,
  };

  const schema = Joi.object<VerifyOTPReq>(data);
  return schema.validate(value);
}

export function validateChangePasswordReq(value: ChangePasswordReq) {
  const data: Partial<Record<keyof ChangePasswordReq, Schema>> = {
    password: joiSchemas.strictPassword.label("New password"),
    id: Joi.string().min(5).max(255).required(),
    oldPassword: joiSchemas.password,
  };

  const schema = Joi.object<ChangePasswordReq>(data);
  return schema.validate(value);
}

export function validateResetPasswordReq(value: ChangePasswordReq) {
  const data: Partial<Record<keyof ChangePasswordReq, Schema>> = {
    password: joiSchemas.strictPassword,
    id: Joi.string().min(5).max(255).required(),
  };

  const schema = Joi.object<ChangePasswordReq>(data);
  return schema.validate(value);
}

export function validateSingleDataByIdReq(
  value: SingleDataByIdReq,
  maxNumber = 50,
  minNumber = 2
) {
  const data: Partial<Record<keyof SingleDataByIdReq, Schema>> = {
    id: Joi.string().min(minNumber).max(maxNumber).required(),
  };

  const schema = Joi.object<SingleDataByIdReq>(data);
  return schema.validate(value);
}

export function validateCreateOrdinal(value: CreateOrdinalReq) {
  const data: Partial<Record<keyof CreateOrdinalReq, Schema>> = {
    ordinalCollectionId: Joi.string().min(2).max(50).required(),
    ordinalId: Joi.string().min(2).max(150).required(),
    contentType: Joi.string().min(2).max(255).required(),
    mimeType: Joi.string().min(2).max(255).required(),
    possibleOrdinalContent: Joi.string().optional().allow("").min(1).max(2000),
  };

  const schema = Joi.object<CreateOrdinalReq>(data);
  return schema.validate(value);
}

export function validateDeleteOrdinalReq(value: DeleteOrdinalReq) {
  const data: Partial<Record<keyof DeleteOrdinalReq, Schema>> = {
    ordinalId: Joi.string().min(2).max(50).required(),
    ordinalCollectionId: Joi.string().min(2).max(50).required(),
  };

  const schema = Joi.object<DeleteOrdinalReq>(data);
  return schema.validate(value);
}

export function validateGetCollectionsReq(value: GetCollectionsReq) {
  const data: Partial<Record<keyof GetCollectionsReq, Schema>> = {
    status: Joi.string().required().valid("active", "inactive"),
  };

  const schema = Joi.object<GetCollectionsReq>(data);
  return schema.validate(value);
}

export function validateGetLeaderboardReq(value: LeaderboardReq) {
  const data: Partial<Record<keyof LeaderboardReq, Schema>> = {
    duration: Joi.string()
      .required()
      .valid(LeaderboardDurations.ALL_TIME, LeaderboardDurations.WEEKLY),
  };

  const schema = Joi.object<LeaderboardReq>(data);
  return schema.validate(value);
}

interface GetOrdinalInCollectionByLightningAddressReq {
  lightningAddress?: string;
  collectionId?: string;
}

export function getOrdinalInCollectionByLightningAddressReq(
  value: GetOrdinalInCollectionByLightningAddressReq
) {
  const data: Partial<
    Record<keyof GetOrdinalInCollectionByLightningAddressReq, Schema>
  > = {
    lightningAddress: LightningSchema,
    collectionId: joiSchemas.id().label("Collection Id"),
  };

  const schema = Joi.object<GetOrdinalInCollectionByLightningAddressReq>(data);
  return schema.validate(value);
}
