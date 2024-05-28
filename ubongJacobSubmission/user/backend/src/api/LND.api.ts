import { create } from "apisauce";
import getAppConfig from "../utilities/appConfig";
import getMacroonMetaData from "../utilities/lightning/getMacroonMetaData";

const baseURL = `https://${getAppConfig().lnd_baseURL}`;

export const baseApi = create({
  baseURL,
  headers: {
    "Grpc-Metadata-macaroon": getMacroonMetaData(),
  },
});

export default baseApi;
