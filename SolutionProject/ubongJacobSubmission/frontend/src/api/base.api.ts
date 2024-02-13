import { create } from "apisauce";
import { AuthStore, authStoreName } from "../stores/auth.store";
import { decryptData } from "@/utilities/encryption";

const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export const baseApi = create({ baseURL });

export const DEFAULT_API_DATA_SIZE: Readonly<number> = 50;

baseApi.addAsyncRequestTransform(async (request) => {
  const value = sessionStorage.getItem(authStoreName);

  if (value) {
    const userDetails: { state: AuthStore } = decryptData(value);
    const userToken = userDetails.state.loginResponse?.data.token;

    if (userToken) {
      if (request.headers) request.headers["x-auth-token"] = `${userToken}`;
    }
  }
});

export default baseApi;
