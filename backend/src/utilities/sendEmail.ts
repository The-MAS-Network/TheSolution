import { Resend } from "resend";
import { OTPEmail } from "../emails/otpEmail";
import getAppConfig from "./appConfig";

const { resend_api_key } = getAppConfig();

export const Mailer = new Resend(resend_api_key);

interface SendEmailProps {
  email: string;
  otp: string;
  title: string;
  subject: string;
}

export const sendOTPEmail = async (props: SendEmailProps) => {
  const { resend_email_domain } = getAppConfig();
  const { email, otp, subject, title } = props;

  await Mailer?.emails?.send({
    from: resend_email_domain,

    to: [email],
    subject,
    html: OTPEmail({ otp, preview: title, title }),
  });
};

interface SendAppErrorEmailProps {
  subject: string;
  message: string;
}

export const sendAppErrorMail = async (props: SendAppErrorEmailProps) => {
  const { message, subject } = props;

  const { app_admin_email: email, resend_email_domain } = getAppConfig();

  await Mailer?.emails?.send({
    from: resend_email_domain,

    to: [email],
    subject,
    text: message,
  });
};
