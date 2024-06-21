import { create } from "apisauce";
import { GeminiRes, KucoinRes, OKXRes } from "../types/api/btcPrice.types";

const baseApi = create({
  baseURL: "",
});

const baseURLS = {
  kucoin: "https://api.kucoin.com/api/v1/market/stats?symbol=BTC-USDT",
  okx: "https://www.okx.com/api/v5/market/ticker?instId=BTC-USD-SWAP",
  gemini: "https://api.gemini.com/v2/ticker/btcusd",
};

interface BtcResponse {
  value: string;
  source: string;
}

export const getBTCPriceFromKucoin = async () => {
  const response = await baseApi.get<KucoinRes, any>(baseURLS?.kucoin);
  if (response?.ok && !!response?.data && !!response?.data?.data?.buy) {
    return Number(response?.data?.data?.buy).toFixed(2);
  }
  return null;
};

export const getBTCPriceFromOKX = async () => {
  const response = await baseApi.get<OKXRes, any>(baseURLS.okx);
  if (response?.ok && !!response?.data && !!response?.data?.data?.[0].bidPx) {
    return Number(response?.data?.data?.[0].bidPx).toFixed(2);
  }
  return null;
};

export const getBTCPriceFromGemini = async () => {
  const response = await baseApi.get<GeminiRes, any>(baseURLS?.gemini);

  if (response?.ok && response?.data?.bid) {
    return Number(response?.data?.bid).toFixed(2);
  }
  return null;
};

let currentIndex = 0;
let retry = 0;

// @ts-ignore
export const getBTCPrice = async (): Promise<BtcResponse | undefined> => {
  if (retry > 5) {
    retry = 0;
    return;
  }

  if (currentIndex == 0) {
    const price = await getBTCPriceFromKucoin();
    currentIndex = 1;
    if (!price) {
      retry = retry + 1;
      getBTCPrice();
    } else {
      if (retry > 0) retry = 0;
      return {
        value: price,
        source: baseURLS?.kucoin,
      };
    }
  }

  if (currentIndex == 1) {
    const price = await getBTCPriceFromGemini();
    currentIndex = 2;
    if (!price) {
      retry = retry + 1;
      getBTCPrice();
    } else {
      if (retry > 0) retry = 0;
      return {
        value: price,
        source: baseURLS?.gemini,
      };
    }
  }

  const price = await getBTCPriceFromOKX();

  currentIndex = 0;
  if (!price) {
    retry = retry + 1;
    getBTCPrice();
  } else {
    if (retry > 0) retry = 0;
    return {
      value: price,
      source: baseURLS?.okx,
    };
  }
};
