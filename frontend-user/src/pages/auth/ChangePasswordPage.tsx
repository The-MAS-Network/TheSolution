import { Icon } from "@iconify/react";
import Joi from "joi";
import { useForm } from "react-hook-form";

import { changePassword } from "@/api/user.api";
import AppInput from "@/components/forms/AppInput";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { ChangePasswordPageState, ILocationParams } from "@/types";
import { joiPasswordValidation } from "@/utilities";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useVisitIntendedRoute } from "@/utilities/visitIntendedRoute";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Schema {
  newPassword: string;
  confirmPassword: string;
}

const schema = Joi.object<Schema>({
  newPassword: joiPasswordValidation,
  confirmPassword: joiPasswordValidation,
});

const pageValues = [
  "Must be at least 8 characters with an uppercase, lowercase and number",
  "Change Password",
  "New Password",
  "Confirm Password",
  "SAVE",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const ChangePasswordPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const changePasswordPageState =
    useLocation() as ILocationParams<ChangePasswordPageState>;
  const { state } = changePasswordPageState;
  const navigate = useNavigate();

  const changePasswordAPI = useMutation({ mutationFn: changePassword });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Schema>({
    resolver: joiResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const newPassword = data?.newPassword?.trim();

    if (newPassword !== data?.confirmPassword.trim())
      return appToast.Warning(
        "New password and confirm password do not match.",
      );

    const response = await changePasswordAPI.mutateAsync({
      password: data?.newPassword,
      token: state?.token,
    });
    if (response.ok) {
      appToast.Success(response.data?.message ?? "Change password success.");
      navigate(routes.LOGIN_PAGE, {
        replace: true,
      });
    } else handleApiErrors(response);
  });

  const isLoading = changePasswordAPI.isPending;

  // SHOULD BE LAST
  const { isEffectDone } = useVisitIntendedRoute({
    condition: !state?.token,
    otherParams: {
      customIntendedRoutes: [routes.FORGOT_PASSWORD_PAGE],
      defaultRoute: routes.FORGOT_PASSWORD_PAGE,
    },
  });

  if (!isEffectDone) {
    return <></>;
  }

  return (
    <div className="min-h-screen  items-center justify-center bg-appDarkBlue100 md:flex">
      <main className="app-container flex min-h-screen flex-col pt-24 text-white md:min-h-max md:pt-0 ">
        <h1 className="mb-8 text-2xl font-semibold md:text-3xl lg:text-4xl">
          {translatedValues?.["Change Password"]}
        </h1>
        <form
          className="flex flex-1  flex-col justify-between md:block "
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-y-5">
            <AppInput
              id="newPassword"
              placeholder={translatedValues?.["New Password"]}
              errorMessage={errors?.newPassword?.message ?? null}
              disabled={isLoading}
              hookFormProps={{ ...register("newPassword") }}
              autoComplete="password-new"
              type={isPasswordVisible ? "text" : "password"}
              leftIcon={
                <Icon
                  className="text-xl sm:text-2xl"
                  icon="mdi:password-outline"
                />
              }
              rightIcon={
                <button
                  className="text-xl sm:text-2xl"
                  onClick={() => setPasswordVisibility((value) => !value)}
                  type="button"
                >
                  {isPasswordVisible ? (
                    <Icon key={1} icon="line-md:watch" />
                  ) : (
                    <Icon key={2} icon="line-md:watch-off" />
                  )}
                </button>
              }
            />
            <AppInput
              id="password"
              placeholder={translatedValues?.["Confirm Password"]}
              errorMessage={errors?.confirmPassword?.message ?? null}
              disabled={isLoading}
              hookFormProps={{ ...register("confirmPassword") }}
              autoComplete="password-new"
              type={isPasswordVisible ? "text" : "password"}
              leftIcon={
                <Icon
                  className="text-xl sm:text-2xl"
                  icon="mdi:password-outline"
                />
              }
              rightIcon={
                <button
                  className="text-xl sm:text-2xl"
                  onClick={() => setPasswordVisibility((value) => !value)}
                  type="button"
                >
                  {isPasswordVisible ? (
                    <Icon key={1} icon="line-md:watch" />
                  ) : (
                    <Icon key={2} icon="line-md:watch-off" />
                  )}
                </button>
              }
            />
            <p className="mb-24 mt-1  text-sm font-semibold">
              <span className="text-appRed200">*</span>{" "}
              {
                translatedValues?.[
                  "Must be at least 8 characters with an uppercase, lowercase and number"
                ]
              }
            </p>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="app-button-primary mb-6 mt-auto flex items-center justify-center gap-x-2 md:mb-0"
          >
            <span>{translatedValues?.SAVE}</span>
            {isLoading && <SpinnerIcon className="animate-spin" />}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChangePasswordPage;
