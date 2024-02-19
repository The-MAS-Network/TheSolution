import { Icon } from "@iconify/react";
import { useState } from "react";

import ChangeLanguageButton from "@/components/ChangeLanguageButton";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { authStore } from "@/stores/auth.store";
import { useStore } from "zustand";
import { useNavigate } from "react-router-dom";
import routes from "@/navigation/routes";

interface ITranslate {
  nickName: string;
  lightningAddress: string;
  daysLeftWarning: string;
  logout: string;
  verifyAccountNow: string;
  verified: string;
  language: string;
  deleteAccount: string;
}

const values: ITranslate = {
  daysLeftWarning:
    "30 days left to verify your account  before it get’s deleted",
  lightningAddress: "Lightning Address",
  nickName: "Nickname",
  logout: "Log out",
  verified: "Verified",
  verifyAccountNow: "Verify Account Now",
  language: "Language",
  deleteAccount: "Delete Account",
};

const ProfileDetails = (): JSX.Element => {
  const [isVerified, setIsVerified] = useState(false);
  const [numOfClick, setNumberOfClick] = useState(1);

  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });
  const { loginResponse, logout } = useStore(authStore);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(routes.LOGIN_PAGE, { replace: true });
  };

  return (
    <>
      <p className="pb-1 pt-5 text-left text-sm font-bold text-appGray400 sm:text-center sm:text-base">
        {translatedValues.nickName}
      </p>
      <p className="text-left text-base font-bold text-white sm:text-center md:text-lg lg:text-xl">
        {loginResponse?.data?.nickName}
      </p>

      <div className="mt-5 w-full max-w-[24.188rem] sm:mx-auto">
        <h4 className="mb-1 text-sm font-bold text-appGray400 sm:text-base">
          {translatedValues.lightningAddress}
        </h4>

        <span className="flex items-center">
          <Icon
            className="text-xl sm:text-2xl"
            icon="emojione-v1:lightning-mood"
          />
          <p className="flex-1 px-2">{loginResponse?.data?.lightningAddress}</p>
          {isVerified && (
            <span className="flex items-center gap-x-1 rounded-full bg-appGreen200 px-3 py-1">
              <Icon
                className="text-base text-appGreen100 sm:text-lg"
                icon="solar:verified-check-bold-duotone"
              />
              <span className="text-sm font-medium">
                {translatedValues.verified}
              </span>
            </span>
          )}
        </span>

        {!isVerified && (
          <div className="flex flex-col pb-4 pt-2">
            <span className="flex max-w-max items-center gap-x-1 rounded-full bg-appYellow200 px-2 py-1 text-xs font-medium">
              <Icon icon="octicon:unverified-16" className="text-sm" />
              <p>{translatedValues.daysLeftWarning}</p>
            </span>
            <button
              onClick={() => setIsVerified(() => true)}
              className="mx-auto mt-5 rounded-full bg-appBlue400 px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-110 active:scale-90"
            >
              {translatedValues.verifyAccountNow}
            </button>
          </div>
        )}

        <h5 className="mb-2 mt-5 text-sm font-bold text-white sm:text-base">
          {values.language}
        </h5>
        <ChangeLanguageButton className="mt-0 bg-appDarkBlue300" />

        <button
          onClick={() => setNumberOfClick((num) => num + 1)}
          className="mt-7 flex w-full items-center justify-between rounded-xl border border-appRed100 px-3 py-4 text-sm font-medium text-appRed100 transition-all duration-300 hover:scale-105 hover:border-red-500 hover:text-red-500 active:scale-95 sm:text-base"
          type="button"
        >
          {numOfClick < 10 ? (
            <span>{translatedValues.deleteAccount}</span>
          ) : (
            <span>bocaj gnobu yb depoleved</span>
          )}
          <Icon className="text-2xl" icon="uiw:user-delete" />
        </button>
      </div>

      <div className="flex flex-1 items-end justify-center py-5 sm:items-center">
        <button
          onClick={handleLogout}
          className="flex  items-center gap-x-3 py-3 text-base font-semibold transition-all duration-300 hover:text-appYellow100 md:text-lg lg:text-xl"
          type="button"
        >
          <span>{translatedValues.logout}</span>
          <Icon
            className="text-lg md:text-xl lg:text-2xl"
            icon="line-md:log-out"
          />
        </button>
      </div>
    </>
  );
};

export default ProfileDetails;
