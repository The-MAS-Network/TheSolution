import bcrypt from "bcrypt";
import { Request, Response } from "express";

import dataSource from "../../db/data-source";
import { AdminOTPS } from "../../entities/admin/AdminOTPs.entity";
import { Admins } from "../../entities/admin/Admins.entity";
import {
  generateAdminAuthToken,
  generateSecondaryAuthToken,
  getAuthUser,
} from "../../middlewares/auth";
import { message } from "../../middlewares/utility";
import {
  ChangePasswordReq,
  CreateOTPReq,
  VerifyOTPReq,
} from "../../types/admin";
import { generateOTP, omitValuesFromObj, validateOTP } from "../../utilities";
import {
  validateAdminLoginReq,
  validateChangePasswordReq,
  validateCreateOTPReq,
  validateResetPasswordReq,
  validateVerifyOTPReq,
} from "../../utilities/schemaValidators";
import { sendOTPEmail } from "../../utilities/sendEmail";

export const login = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateAdminLoginReq(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }
  const { email: initialEmail, password } = req.body as Admins;
  const email = initialEmail?.toLowerCase()?.trim();

  const adminRepository = dataSource.getRepository(Admins);

  const admin = await adminRepository.findOne({
    where: { email },
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
      token: generateAdminAuthToken({ id: data.email }),
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

  const adminRepository = dataSource.getRepository(Admins);

  const admin = await adminRepository.findOne({
    where: { email },
  });

  if (!admin)
    return res.status(400).send(message(false, "Invalid email address."));

  const otp = generateOTP();

  const adminOTPRepository = dataSource.getRepository(AdminOTPS);

  const newAdminOTP = new AdminOTPS();

  newAdminOTP.email = email;
  newAdminOTP.otp = otp;
  newAdminOTP.purpose = purpose;

  await adminOTPRepository.save(newAdminOTP);

  const subject =
    purpose === "ON_BOARDING" ? "Onboarding Verification" : "Forgot Password.";

  const title =
    purpose === "ON_BOARDING"
      ? "Hello Administrator! Help us verify it's you.😉 "
      : "Hello Administrator! Seems you lost your password 😟.";

  await sendOTPEmail({ email, otp, subject, title });

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

  const adminOTPRepository = dataSource.getRepository(AdminOTPS);

  const result = await adminOTPRepository.find({
    order: { createdAt: "DESC" },
    take: 1,
  });

  const firstOTP = result?.[0];

  const otpError = validateOTP({ dbOTP: firstOTP, OTP: otp, purpose });
  if (otpError) return res.status(400).send(message(false, otpError));

  return res.status(200).send(
    message(true, "OTP verified successfully.", {
      id: firstOTP?.id,
      token: generateSecondaryAuthToken({ id: firstOTP?.email }),
    })
  );
};

export const changePassword = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateChangePasswordReq(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }

  const user = getAuthUser(req, res);

  const { id: OTPID, oldPassword, password } = req.body as ChangePasswordReq;

  const adminOTPsRepository = dataSource.getRepository(AdminOTPS);
  const OTP = await adminOTPsRepository.findOneBy({
    id: OTPID,
  });

  if (!OTP) return res.status(400).send(message(false, "No Otp found."));

  if (!!OTP.isUsed) return res.status(400).send(message(false, "Invalid OTP."));

  const adminsRepository = dataSource.getRepository(Admins);
  const admin = await adminsRepository.findOneBy({
    email: user?.id,
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

  admin.password = hashedPassword;
  admin.isVerified = true;
  const adminRes = await adminsRepository.save(admin);

  const adminOTPRepository = dataSource.getRepository(AdminOTPS);
  OTP.isUsed = true;
  await adminOTPRepository.save(OTP);

  const data = formatUserData(adminRes);

  return res
    .status(200)
    .send(message(true, "Password changed successfully.", data));
};

export const resetPassword = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateResetPasswordReq(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }

  const user = getAuthUser(req, res);

  const { id: OTPID, password } = req.body as ChangePasswordReq;

  const adminOTPRepository = dataSource.getRepository(AdminOTPS);

  const OTP = await adminOTPRepository.findOneBy({
    id: OTPID,
  });

  if (!OTP) return res.status(400).send(message(false, "No Otp found."));

  if (!!OTP.isUsed) return res.status(400).send(message(false, "Invalid OTP."));

  const admisRepository = dataSource.getRepository(Admins);

  const admin = await admisRepository.findOneBy({ email: user?.id });

  if (!admin)
    return res
      .status(404)
      .send(
        message(false, "Administrator with the given email does not exist.")
      );

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  admin.password = hashedPassword;

  await admisRepository.save(admin);

  OTP.isUsed = true;
  await adminOTPRepository.save(OTP);

  return res.status(200).send(message(true, "Password reset success."));
};

// UTILITIES START

const formatUserData = (admin: Admins) =>
  omitValuesFromObj(admin, ["password"]);
