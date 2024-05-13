import Joi from "joi";
import { useForm } from "react-hook-form";

import AppInput from "@/components/forms/AppInput";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import {
  ChangePasswordPageState,
  ILocationParams,
  VerifyOTPPageState,
} from "@/types";
import { useVisitIntendedRoute } from "@/utilities/visitIntendedRoute";
import { joiResolver } from "@hookform/resolvers/joi";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "@/components/AppBackButton";
import { useEffect } from "react";
import { generateOTP, verifyOTP } from "@/api/user.api";
import { useMutation } from "@tanstack/react-query";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";

const pageValues = ["Enter", "OTP", "Enter the OTP sent to", "VERIFY"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

interface Schema {
  OTP: string;
}

const schema = Joi.object<Schema>({
  OTP: Joi.string().length(6),
});

const VerifyOTPPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const navigate = useNavigate();
  const verifyOTPPageState =
    useLocation() as ILocationParams<VerifyOTPPageState>;
  const { state } = verifyOTPPageState;
  const generateOTPAPI = useMutation({ mutationFn: generateOTP });
  const verifyOTPAPI = useMutation({ mutationFn: verifyOTP });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Schema>({
    resolver: joiResolver(schema),
  });

  useEffect(() => {
    if (state?.purpose === "Change Password") {
      generateOTPAPI.mutateAsync({
        purpose: "ON_BOARDING",
        email: state?.email,
      });
    }
  }, [state?.email]);

  const onSubmit = handleSubmit(async (data) => {
    const response = await verifyOTPAPI.mutateAsync({
      otp: data?.OTP,
      purpose:
        state?.purpose === "Change Password"
          ? "ON_BOARDING"
          : "FORGOT_PASSWORD",
    });
    if (response.ok) {
      appToast.Success(
        response.data?.message ?? "OTP verification Successful.",
      );
      navigate(routes.CHANGE_PASSWORD_PAGE, {
        replace: true,
        state: {
          token: response?.data?.data?.token,
          purpose: state.purpose,
          id: response?.data?.data?.id,
        } as ChangePasswordPageState,
      });
    } else handleApiErrors(response);
  });

  const isLoading = verifyOTPAPI?.isPending;

  // SHOULD BE LAST
  const { isEffectDone } = useVisitIntendedRoute({
    condition: !state?.email,
    otherParams: {
      customIntendedRoutes: [routes.LOGIN_PAGE],
      defaultRoute: routes.LOGIN_PAGE,
    },
  });

  if (!isEffectDone) {
    return <></>;
  }

  return (
    <div className="min-h-screen items-center  justify-center bg-appDarkBlue100 font-baloo2 md:flex">
      <main className="app-container flex min-h-screen flex-col  pt-24 text-white md:min-h-max md:pt-0 ">
        <AppBackButton />

        <h1 className="mt-8 text-4xl font-medium">
          {translatedValues.Enter} {"  "} <br className="md:hidden" />
          {translatedValues.OTP}
        </h1>
        <h2 className="mb-4 mt-5 text-base  font-medium">
          {translatedValues["Enter the OTP sent to"]} {"  "} {state?.email}
        </h2>
        <form className="flex flex-1 flex-col " onSubmit={onSubmit}>
          <AppInput
            id="OTP"
            autoComplete="one-time-code"
            placeholder={translatedValues.OTP}
            errorMessage={errors?.OTP?.message ?? null}
            disabled={isLoading}
            maxLength={6}
            ignoreCapitalLetterSpacing
            hookFormProps={{ ...register("OTP") }}
          />

          <div className="mt-auto  pb-11 pt-8">
            <button
              disabled={isLoading}
              type="submit"
              className="app-button-primary flex items-center justify-center gap-x-2"
            >
              <span>{translatedValues.VERIFY}</span>
              {isLoading && <SpinnerIcon className="animate-spin" />}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default VerifyOTPPage;
