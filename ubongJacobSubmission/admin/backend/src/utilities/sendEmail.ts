import { Resend } from "resend";
import getAppConfig from "./appConfig";

const { resend_api_key } = getAppConfig();

export const Mailer = new Resend(resend_api_key);
