import Joi, { Schema } from "joi";
import { ICreateAdmin } from "../drizzle/schema";
import { ChangePasswordReq, CreateOTPReq, VerifyOTPReq } from "../types/auth";
import enums from "../drizzle/enums";
import { SingleDataByIdReq } from "../types";
import { CreateOrdinalReq, GetCollectionsReq } from "../types/ordinals";

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
};

export function validateLoginReq(value: ICreateAdmin) {
  const data: Partial<Record<keyof ICreateAdmin, Schema>> = {
    email: joiSchemas.email,
    password: Joi.string().min(5).max(200).label("Password").required(),
  };

  const schema = Joi.object<ICreateAdmin>(data);
  return schema.validate(value);
}

export function validateCreateOTPReq(value: ICreateAdmin) {
  const data: Partial<Record<keyof CreateOTPReq, Schema>> = {
    email: joiSchemas.email,
    purpose: joiSchemas.purpose,
  };

  const schema = Joi.object<ICreateAdmin>(data);
  return schema.validate(value);
}

export function validateVerifyOTPReq(value: VerifyOTPReq) {
  const data: Partial<Record<keyof VerifyOTPReq, Schema>> = {
    otp: Joi.string().length(6).required(),
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

  const schema = Joi.object<ChangePasswordReq>(data);
  return schema.validate(value);
}

export function validateCreateOrdinal(value: CreateOrdinalReq) {
  const data: Partial<Record<keyof CreateOrdinalReq, Schema>> = {
    ordinalCollectionId: Joi.string().min(2).max(50).required(),
    ordinalId: Joi.string().min(2).max(150).required(),
    ordinalNumber: Joi.string().required().min(2).max(50),
    contentType: Joi.string().min(2).max(255).required(),
    mimeType: Joi.string().min(2).max(255).required(),
    possibleOrdinalContent: Joi.string().optional().allow("").min(1).max(2000),
  };

  const schema = Joi.object<CreateOrdinalReq>(data);
  return schema.validate(value);
}

export function validateGetCollectionsReq(value: GetCollectionsReq) {
  const data: Partial<Record<keyof GetCollectionsReq, Schema>> = {
    status: Joi.string().required().valid("active", "inactive"),
  };

  const schema = Joi.object<GetCollectionsReq>(data);
  return schema.validate(value);
}
