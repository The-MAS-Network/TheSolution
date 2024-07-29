import { Icon } from "@iconify/react";

import ChangeLanguageButton from "@/components/ChangeLanguageButton";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { authStore } from "@/stores/auth.store";
import { CreateInvoiceParams } from "@/types/api/auth.types";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import { useGetProfile } from "@/hooks/useGetRequests";
import VerificationCountDown from "./VerificationCountDown";
import { EmojioneV1LightningMood } from "@/components/icons";

const pageValues = [
  "Lightning Address",
  "Nickname",
  "LOG OUT",
  "Verified",
  "VERIFY ACCOUNT NOW",
  "Language",
  "DELETE ACCOUNT",
  "left to verify your account  before it get’s deleted",
  "hours",
  "minutes",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const ProfileDetails = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const { loginResponse, logout } = useStore(authStore);
  const navigate = useNavigate();

  useGetProfile();

  const isVerified = loginResponse?.data?.isVerified;

  const handleVerification = () => {
    navigate(routes.RESET_PASSWORD_INSTRUCTIONS_PAGE, {
      state: {
        lightningAddress: loginResponse?.data?.lightningAddress,
        purpose: "verify_account",
      } as CreateInvoiceParams,
    });
  };

  return (
    <>
      {/* <p className="pb-1 pt-5 text-left text-sm font-bold text-appGray400 sm:text-center sm:text-base">
        {translatedValues.Nickname}
      </p> */}
      <p className="pb-1 pt-5 text-left text-base font-bold text-white sm:text-center md:text-lg lg:text-xl">
        {loginResponse?.data?.nickName}
      </p>

      <div className="mt-5 w-full max-w-[24.188rem] sm:mx-auto">
        <h4 className="mb-1 text-sm font-bold text-appGray400 sm:text-base">
          {translatedValues["Lightning Address"]}
        </h4>

        <span className="flex items-center">
          <EmojioneV1LightningMood className="text-xl sm:text-2xl" />
          <p className="flex-1 px-2">{loginResponse?.data?.lightningAddress}</p>
          {!!isVerified && (
            <span className="flex items-center gap-x-1 rounded-full bg-appGreen200 px-3 py-1">
              <Icon
                className="text-base text-appGreen100 sm:text-lg"
                icon="solar:verified-check-bold-duotone"
              />
              <span className="text-sm font-medium">
                {translatedValues.Verified}
              </span>
            </span>
          )}
        </span>

        {!isVerified && (
          <div className="flex flex-col pb-4 pt-2">
            {!!loginResponse?.data?.createdAt && (
              <VerificationCountDown date={loginResponse?.data.createdAt} />
            )}
            <button
              onClick={handleVerification}
              className="mx-auto mt-5 rounded-xl bg-appBlue400 px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-110 active:scale-90"
            >
              {translatedValues["VERIFY ACCOUNT NOW"]}
            </button>
          </div>
        )}

        <h5 className="mb-2 mt-5 text-sm font-bold text-white sm:text-base">
          {translatedValues.Language}
        </h5>
        <ChangeLanguageButton className="mt-0 bg-appDarkBlue300" />

        <Link
          to={routes.DELETE_ACCOUNT_PAGE}
          className="mt-7 flex w-full items-center justify-between rounded-xl bg-white px-3 py-4 text-sm font-bold text-red-500 transition-all duration-300 hover:scale-105 hover:text-red-600 active:scale-95 sm:text-base"
        >
          <span>{translatedValues["DELETE ACCOUNT"]}</span>
          <Icon className="text-xl sm:text-2xl" icon="uiw:user-delete" />
        </Link>
      </div>

      <div className="flex flex-1 items-end justify-center py-2 sm:items-center">
        <button
          onClick={() => logout()}
          className="flex  items-center gap-x-3 py-3 text-base font-semibold transition-all duration-300 hover:text-appYellow100 md:text-lg lg:text-xl"
          type="button"
        >
          <span>{translatedValues["LOG OUT"]}</span>
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
