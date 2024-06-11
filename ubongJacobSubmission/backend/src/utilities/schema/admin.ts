import Joi, { Schema } from "joi";
import { LightningSchema, joiSchemas } from "../schemaValidators";
import { Currencies, OTPPurpose } from "../enums";

export interface TipUserSchema {
  lightningAddress: string;
  otp: string;
  amount: number;
  collectionId: string;
  currency: string;
}

export function validateTipUser(param: TipUserSchema) {
  const data: Partial<Record<keyof TipUserSchema, Schema>> = {
    lightningAddress: LightningSchema,
    otp: joiSchemas.OTP,
    amount: Joi.number().min(1).max(1_000_000).required(),
    collectionId: joiSchemas.id(),
    currency: Joi.string().valid(Currencies?.SATS, Currencies.USD).required(),
  };

  const schema = Joi.object<TipUserSchema>(data);
  return schema.validate(param);
}

export interface TipCollectionSchema {
  otp: string;
  totalAmount: number;
  collectionId: string;
  currency: string;
}

export function validateTipCollection(param: TipCollectionSchema) {
  const data: Partial<Record<keyof TipCollectionSchema, Schema>> = {
    otp: joiSchemas.OTP,
    totalAmount: Joi.number().min(1).max(1_000_000).required(),
    collectionId: joiSchemas.id(),
    currency: Joi.string()
      .valid(Currencies.BTC, Currencies?.SATS, Currencies.USD)
      .required(),
  };

  const schema = Joi.object<TipCollectionSchema>(data);
  return schema.validate(param);
}
export interface GenerateTipOTPReq {
  purpose: OTPPurpose.TIP_COLLECTION | OTPPurpose.TIP_USER;
}

export function validateGenerateTipOTP(value: GenerateTipOTPReq) {
  const data: Partial<Record<keyof GenerateTipOTPReq, Schema>> = {
    purpose: Joi.string()
      .valid(OTPPurpose.TIP_COLLECTION, OTPPurpose.TIP_USER)
      .required(),
  };

  const schema = Joi.object<GenerateTipOTPReq>(data);
  return schema.validate(value);
}
