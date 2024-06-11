import { create } from "apisauce";
import getAppConfig from "../utilities/appConfig";
import {
  CreatePayoutErrorRes,
  CreatePayoutRes,
} from "../types/btcPayServer.types";
import { convertValueToSats } from "../utilities";

export const btcServerBaseAPI = create({
  baseURL: getAppConfig().btcPayServer_baseURL,
  headers: {
    Authorization: `token ${getAppConfig().btcPayServer_ApiKey}`,
    // Authorization: `token e42651392c349f6c78065ad3fc44609d7d845b37`,
    // Authorization: `Basic ${btoa(
    //   "ubongjacob14@gmail.com:RejcA0GiNENaifV45LZH"
    // )}`,
  },
});

export default btcServerBaseAPI;

interface SendSatsProps {
  address: string;
  amount: number;
  storeId: string;
}

export const sendSats = ({ address, amount, storeId }: SendSatsProps) =>
  btcServerBaseAPI.post<CreatePayoutRes, CreatePayoutErrorRes[]>(
    `/api/v1/stores/${storeId}/payouts`,
    {
      destination: address,
      amount: convertValueToSats(amount),
      paymentMethod: "BTC-LightningLike",
      approved: true,
    }
  );
