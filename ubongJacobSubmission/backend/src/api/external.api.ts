import { create } from "apisauce";
import getAppConfig from "../utilities/appConfig";
import {
  GetOrdinalError,
  GetOrdinalsFromWalletAddress,
  GetOrdinalsFromWalletAddressProps,
} from "../types/ordinals.types";

export const hiroSoBaseApi = create({
  baseURL: "https://api.hiro.so/ordinals/v1",
  headers: {
    "x-hiro-api-key": getAppConfig().hiro_so_api_key,
  },
});

export const getOrdinalsFromWallet = (
  props: GetOrdinalsFromWalletAddressProps
) => {
  const { address, limit = 50, offset } = props;

  return hiroSoBaseApi.get<GetOrdinalsFromWalletAddress, GetOrdinalError>(
    `/inscriptions?limit=${limit}&offset=${offset}&address=${address?.trim()}`
  );
};

export const bitcoinExplorerBaseAPI = create({
  baseURL: "https://bitcoinexplorer.org/api",
});

export const ordiscanBaseApi = create({
  baseURL: "https://ordiscan.com",
});
