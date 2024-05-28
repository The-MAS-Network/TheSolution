import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { message } from "../middlewares/utility";
import {
  calculateTimeDifferenceInSeconds,
  generateOTP,
  omitValuesFromObj,
} from "../utilities";
import getAppConfig from "../utilities/appConfig";

import bcrypt from "bcrypt";
import { db } from "../drizzle/db";
import { AdminTable, ICreateAdmin, OtpTable } from "../drizzle/schema";
// import { getAuthUser } from "../middlewares/auth";
import { eq } from "drizzle-orm";
import { OTPEmail } from "../emails/otpEmail";
import { getSecondaryAuthUser } from "../middlewares/auth";
import { ChangePasswordReq, CreateOTPReq, VerifyOTPReq } from "../types/auth";
import {
  validateChangePasswordReq,
  validateCreateOTPReq,
  validateLoginReq,
  validateResetPasswordReq,
  validateVerifyOTPReq,
} from "../utilities/schemaValidators";
import { Mailer } from "../utilities/sendEmail";

export const login = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateLoginReq(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }
  const { email: initialEmail, password } = req.body as ICreateAdmin;
  const email = initialEmail?.toLowerCase();
  // CHECK IF USER EXISTS ALREADY
  const admin = await db.query.AdminTable.findFirst({
    where: (admin, { eq }) => eq(admin.email, email),
    columns: { password: true, email: true, isVerified: true },
  });

  if (!admin)
    return res
      .status(400)
      .send(message(false, "Invalid email address or password."));

  // VALIDATE PASSWORD
  const validPassword = await bcrypt.compare(password, admin.password);

  if (!validPassword)
    return res
      .status(400)
      .send(message(false, "Invalid email address or password."));

  const data = formatUserData(admin);

  return res.status(201).send(
    message(true, "Login success", {
      ...data,
      token: generateAuthToken({ email: data.email }),
    })
  );
};

export const generateOtp = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateCreateOTPReq(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }
  const { email: initialEmail, purpose } = req.body as CreateOTPReq;
  const email = initialEmail?.toLowerCase();
  // CHECK IF USER EXISTS ALREADY
  const admin = await db.query.AdminTable.findFirst({
    where: (admin, { eq }) => eq(admin.email, email),
  });

  if (!admin)
    return res.status(400).send(message(false, "Invalid email address."));

  const otp = generateOTP();

  await db.insert(OtpTable).values({
    email,
    otp,
    purpose,
  });

  const { resend_email_domain } = getAppConfig();

  const subject =
    purpose === "ON_BOARDING" ? "Onboarding Verification" : "Forgot Password.";

  const title =
    purpose === "ON_BOARDING"
      ? "Hello Administrator! Help us verify it's you.😉 "
      : "Hello Administrator! Seems you lost your password 😟.";

  await Mailer?.emails?.send({
    from: resend_email_domain,

    to: [email],
    subject,
    html: OTPEmail({ otp, preview: title, title }),
  });

  // VALIDATE PASSWORD

  return res.status(200).send(message(true, "OTP sent to " + admin?.email));
};

export const verifyOTP = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateVerifyOTPReq(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }
  const { otp, purpose } = req.body as VerifyOTPReq;

  const firstOTP = await db.query.OtpTable.findFirst({
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });

  if (!firstOTP) return res.status(400).send(message(false, "No Otp found."));

  if (!!firstOTP.isUsed)
    return res.status(400).send(message(false, "Invalid OTP."));

  if (firstOTP.purpose !== purpose)
    return res.status(400).send(message(false, "Invalid OTP."));

  if (firstOTP.otp?.toLowerCase() !== otp?.toLowerCase())
    return res.status(400).send(message(false, "Invalid OTP."));

  // TODO
  if (calculateTimeDifferenceInSeconds(firstOTP?.createdAt).minutes > 10)
    return res.status(400).send(message(false, "Expired OTP."));

  return res.status(200).send(
    message(true, "OTP verified successfully.", {
      id: firstOTP?.id,
      token: generateSecondaryAuthToken({ email: firstOTP?.email }),
    })
  );
};

export const changePassword = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateChangePasswordReq(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }

  const user = getSecondaryAuthUser(req, res);

  const { id: OTPID, oldPassword, password } = req.body as ChangePasswordReq;

  const OTP = await db.query.OtpTable.findFirst({
    where: ({ id }, { eq }) => eq(id, OTPID),
  });

  if (!OTP) return res.status(400).send(message(false, "No Otp found."));

  if (!!OTP.isUsed) return res.status(400).send(message(false, "Invalid OTP."));

  const admin = await db.query.AdminTable.findFirst({
    where: (admin, { eq }) => eq(admin.email, user.email),
    columns: { password: true, email: true, isVerified: true },
  });

  if (!admin)
    return res
      .status(404)
      .send(
        message(false, "Administrator with the given email does not exist.")
      );

  // VALIDATE PASSWORD
  const validPassword = await bcrypt.compare(oldPassword, admin?.password);

  if (!validPassword)
    return res.status(400).send(message(false, "Invalid old password."));

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await db
    .update(AdminTable)
    .set({ password: hashedPassword, isVerified: true })
    .where(eq(AdminTable.email, user.email));

  const data = formatUserData(admin);
  const newData: Partial<ICreateAdmin> = { ...data, isVerified: true };

  return res
    .status(200)
    .send(message(true, "Password changed successfully.", newData));
};

export const resetPassword = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateResetPasswordReq(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }

  const user = getSecondaryAuthUser(req, res);

  const { id: OTPID, password } = req.body as ChangePasswordReq;

  const OTP = await db.query.OtpTable.findFirst({
    where: ({ id }, { eq }) => eq(id, OTPID),
  });

  if (!OTP) return res.status(400).send(message(false, "No Otp found."));

  if (!!OTP.isUsed) return res.status(400).send(message(false, "Invalid OTP."));

  const admin = await db.query.AdminTable.findFirst({
    where: (admin, { eq }) => eq(admin.email, user.email),
    columns: { password: true, email: true, isVerified: true },
  });

  if (!admin)
    return res
      .status(404)
      .send(
        message(false, "Administrator with the given email does not exist.")
      );

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await db
    .update(AdminTable)
    .set({ password: hashedPassword })
    .where(eq(AdminTable.email, user.email));

  return res.status(200).send(message(true, "Password reset success."));
};

// UTILITIES START

export interface LightningAddress {
  lightningAddress: string;
}

export function generateAuthToken({ email }: UserToken): string {
  return jwt.sign({ email }, getAppConfig().app_jwtPrivateKey);
}

export function generateSecondaryAuthToken({ email }: UserToken): string {
  return jwt.sign({ email }, getAppConfig().app_secondary_jwtPrivateKey);
}

const formatUserData = (admin: ICreateAdmin) =>
  omitValuesFromObj(admin, ["password"]);

interface UserToken {
  email: string;
}
