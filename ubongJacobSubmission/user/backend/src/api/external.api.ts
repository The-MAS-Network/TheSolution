import { create } from "apisauce";
import getAppConfig from "../utilities/appConfig";

export const hiroSoBaseApi = create({
  baseURL: "https://api.hiro.so/ordinals/v1",
  headers: {
    "x-hiro-api-key": getAppConfig().hiro_so_api_key,
  },
});
export const bitcoinExplorerBaseAPI = create({
  baseURL: "https://bitcoinexplorer.org/api",
});
