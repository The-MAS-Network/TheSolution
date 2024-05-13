import Joi, { Schema } from "joi";
import { Users } from "../entities/Users.entity";
import { LightningAddress } from "../controllers/user";
import { DualPaymentsParams, ValidateCreateInvoiceParams } from "../types";
import { InvoicePurpose } from "../entities/BtcPayServerPayments.entity";

export const LightningSchema = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: false,
  })
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
