import { create } from "apisauce";
import getAppConfig from "../utilities/appConfig";

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
