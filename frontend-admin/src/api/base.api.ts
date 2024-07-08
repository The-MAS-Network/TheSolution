import { create } from "apisauce";
import { AuthStore, authStoreName } from "../stores/auth.store";
import { decryptData } from "@/utilities/encryption";
import { appToast } from "@/utilities/appToast";
import routes from "@/navigation/routes";

const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL + "/admin";

export const baseApi = create({ baseURL });
export const baseApiWithoutToken = create({ baseURL });

export const ordinalBaseApi = create({
  baseURL: "https://ordiscan.com/content",
});

export const backendTokenName = "x-auth-token";
export const DEFAULT_API_DATA_SIZE: Readonly<number> = 50;

baseApi.addAsyncRequestTransform(async (request) => {
  const value = sessionStorage.getItem(authStoreName);

  if (value) {
    const userDetails: { state: AuthStore } = decryptData(value);
    const userToken = userDetails.state.loginResponse?.data.token;

    if (!!userToken) {
      if (request.headers) request.headers[backendTokenName] = `${userToken}`;
    }
  }
});

baseApi.addAsyncResponseTransform(async (response) => {
  if (response.status === 401) {
    appToast.Warning("Session Expired.");
    window.location.replace(routes.LOGIN_PAGE);
  }
});

export default baseApi;
