import { create } from "apisauce";
import {
  authenticatedLndGrpc,
  createInvoice,
  getInvoice,
  getPayment,
  pay,
} from "lightning";
import { getISOTimeInHours } from "..";
import { PaymentStatus } from "../../entities/ordinal/OrdinalTips.entity";
import { message } from "../../middlewares/utility";
import { APP_NAME } from "../../startup/config";
import { GenericAPIResponse } from "../../types";
import {
  GenInvoiceURLResponse,
  GetLNURLDetails,
  HandleLNURLPaymentProps,
} from "../../types/lnd";
import getAppConfig from "../appConfig";
import { handleApiErrors } from "../handleErrors";

export const LndInstance = authenticatedLndGrpc({
  macaroon: getAppConfig().app_macroon_hex,
  socket: `${getAppConfig()?.lnd_baseURL}:${getAppConfig()?.app_grpc_port}`,
});

export async function handleLNURLPayment({
  address,
  amountInSat,
}: HandleLNURLPaymentProps): Promise<GenericAPIResponse> {
  const splitDomain = address?.split("@");
  if (splitDomain?.length !== 2) {
    return message(false, "Invalid lightning address");
  }

  const userName = splitDomain[0];
  const domain = splitDomain[1];
  const amount = amountInSat * 1000; // The amount required by the endpoint is in MSat so we need to convert sats to MSat by multiplying by 1000

  const baseAPI = create({ baseURL: `https://${domain}` });
  const response = await baseAPI.get<GetLNURLDetails, any>(
    `/.well-known/lnurlp/${userName}`
  );

  if (response?.ok && response?.data) {
    const resData = response?.data;
    if (amount > resData?.maxSendable) {
      return message(
        false,
        `Sats Amount to big for this address, maximum amount is ${
          resData?.maxSendable / 1000
        }`
      );
    }
    if (amount < resData?.minSendable) {
      return message(
        false,
        `Sats Amount to small for this address, maximum amount is ${
          resData?.minSendable / 1000
        }`
      );
    }

    const genInvoiceURL = `${resData?.callback}?amount=${amount}`;
    const genInvoiceURLBaseAPI = create({ baseURL: "" });
    const genInvoiceURLResponse = await genInvoiceURLBaseAPI.get<
      GenInvoiceURLResponse,
      any
    >(genInvoiceURL);

    if (genInvoiceURLResponse?.ok && genInvoiceURLResponse?.data) {
      // save invoice to db with lightning address

      const details = await pay({
        lnd: LndInstance.lnd,
        request: genInvoiceURLResponse?.data?.pr,
      });
      if (!details) return message(true, PaymentStatus.FAILED, details);
      if (details?.is_confirmed) {
        return message(true, PaymentStatus.SUCCESS, details);
      } else {
        return message(true, PaymentStatus.PENDING, details);
      }
    } else {
      return message(
        false,
        `Error generating payment request from ${domain}`,
        JSON.stringify(handleApiErrors(response))
      );
    }
  } else {
    return message(
      false,
      "Error retrieving lightning address details",
      JSON.stringify(handleApiErrors(response))
    );
  }
}

export const getLightningPayment = ({ id }: { id: string }) =>
  getPayment({ id, lnd: LndInstance.lnd });

export const createLightningInvoice = (tokens: number) =>
  createInvoice({
    lnd: LndInstance.lnd,
    description: APP_NAME + " invoice",
    tokens,

    expires_at: getISOTimeInHours(),
  });

export const getLightningInvoice = ({ id }: { id: string }) =>
  getInvoice({ id, lnd: LndInstance.lnd });
