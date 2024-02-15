import CryptoJS from "crypto-js";
import getAppConfig from "./appConfig";

export const encryptData = (data: any): string => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    getAppConfig().app_cryptoJsKey
  ).toString();

  return encryptedData;
};

const decryptData = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, getAppConfig().app_cryptoJsKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export const compareEncryptedData = (
  unVerifiedData: string,
  encryptedData: string
) => {
  return decryptData(encryptedData) === unVerifiedData;
};
