import { Icon } from "@iconify/react";
import Joi from "joi";
import { useForm } from "react-hook-form";

import AppInput from "@/components/forms/AppInput";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { ChangePasswordPageState, ILocationParams } from "@/types";
import { joiSchemas } from "@/utilities";
import { useVisitIntendedRoute } from "@/utilities/visitIntendedRoute";
import { joiResolver } from "@hookform/resolvers/joi";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { appToast } from "@/utilities/appToast";
import { useMutation } from "@tanstack/react-query";
import { changePassword, resetPassword } from "@/api/user.api";
import { handleApiErrors } from "@/utilities/handleErrors";
import { authStore } from "@/stores/auth.store";
import { useStore } from "zustand";

const pageValues = [
  "CHANGE PASSWORD",
  "Change",
  "Old Password",
  "Password",
  "New Password",
  "Set",
  "Confirm Password",
  "New password and confirm password do not match.",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

interface Schema {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isSecondaryPasswordVisible, setSecondaryPasswordVisibility] =
    useState(false);
  const navigate = useNavigate();

  const resetPasswordAPI = useMutation({ mutationFn: resetPassword });
  const changePasswordAPI = useMutation({ mutationFn: changePassword });
  const { setLoginResponse } = useStore(authStore);

  const changePasswordPageState =
    useLocation() as ILocationParams<ChangePasswordPageState>;
  const { state } = changePasswordPageState;
  const isChangePassword = state?.purpose === "Change Password";

  const schema = Joi.object<Schema>({
    newPassword: joiSchemas.strictPassword.label("New password"),
    ...(isChangePassword
      ? { oldPassword: joiSchemas.password.label("Old password") }
      : {
          confirmPassword: joiSchemas.strictPassword.label("Confirm password"),
        }),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Schema>({
    resolver: joiResolver(schema),
  });

  const onChangePasswordSubmit = async (data: Schema) => {
    if (!state?.id || !state?.token)
      return appToast.Warning("Invalid id given.");

    const response = await changePasswordAPI.mutateAsync({
      id: state?.id,
      password: data?.newPassword,
      oldPassword: data?.oldPassword,
      token: state.token,
    });
    if (response.ok) {
      appToast.Success(response.data?.message ?? "Change password Successful.");
      if (response.data) setLoginResponse(response.data);
      navigate(routes.DASHBOARD_PAGE, {
        replace: true,
      });
    } else handleApiErrors(response);
  };

  const onSetPasswordSubmit = async (data: Schema) => {
    if (!state?.id || !state?.token)
      return appToast.Warning("Invalid id given.");

    if (data.newPassword !== data.confirmPassword)
      return appToast.Warning(
        translatedValues["New password and confirm password do not match."],
      );

    const response = await resetPasswordAPI.mutateAsync({
      id: state?.id,
      password: data?.newPassword,
      token: state?.token,
    });

    if (response.ok) {
      navigate(routes.LOGIN_PAGE, {
        replace: true,
      });
      appToast.Success(response.data?.message ?? "Reset password Successful.");
    } else handleApiErrors(response);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!!isChangePassword) onChangePasswordSubmit(data);
    else onSetPasswordSubmit(data);
  });

  const isLoading = changePasswordAPI?.isPending || resetPasswordAPI?.isPending;

  // SHOULD BE LAST
  const { isEffectDone } = useVisitIntendedRoute({
    condition: !state?.token || !state?.purpose || !state?.id,
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
        <h1 className="mb-8 text-4xl font-medium">
          {isChangePassword ? translatedValues["Change"] : translatedValues.Set}{" "}
          {"  "} <br className={`${isChangePassword && "md:hidden"}`} />
          {isChangePassword
            ? translatedValues.Password
            : translatedValues["New Password"]}
        </h1>

        <form className="flex flex-1 flex-col gap-y-5" onSubmit={onSubmit}>
          {!!isChangePassword && (
            <AppInput
              id="old-password"
              placeholder={translatedValues["Old Password"]}
              errorMessage={errors?.oldPassword?.message ?? null}
              disabled={isLoading}
              hookFormProps={{ ...register("oldPassword") }}
              autoComplete="current-password"
              type={isPasswordVisible ? "text" : "password"}
              leftIcon={
                <Icon
                  className="text-2xl  text-appGray200"
                  icon="mdi:password-outline"
                />
              }
              rightIcon={
                <button
                  className="text-2xl  text-appGray200"
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
          )}
          <AppInput
            id="new-password"
            placeholder={translatedValues["New Password"]}
            errorMessage={errors?.newPassword?.message ?? null}
            disabled={isLoading}
            hookFormProps={{ ...register("newPassword") }}
            autoComplete="new-password"
            type={isSecondaryPasswordVisible ? "text" : "password"}
            leftIcon={
              <Icon
                className="text-2xl  text-appGray200"
                icon="mdi:password-outline"
              />
            }
            rightIcon={
              <button
                className="text-2xl  text-appGray200"
                onClick={() =>
                  setSecondaryPasswordVisibility((value) => !value)
                }
                type="button"
              >
                {isSecondaryPasswordVisible ? (
                  <Icon key={1} icon="line-md:watch" />
                ) : (
                  <Icon key={2} icon="line-md:watch-off" />
                )}
              </button>
            }
          />

          {!isChangePassword && (
            <AppInput
              id="confirm-password"
              placeholder={translatedValues["Confirm Password"]}
              errorMessage={errors?.oldPassword?.message ?? null}
              disabled={isLoading}
              hookFormProps={{ ...register("confirmPassword") }}
              autoComplete="new-password"
              type={isPasswordVisible ? "text" : "password"}
              leftIcon={
                <Icon
                  className="text-2xl  text-appGray200"
                  icon="mdi:password-outline"
                />
              }
              rightIcon={
                <button
                  className="text-2xl  text-appGray200"
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
          )}

          <div className="mt-auto  pb-11 pt-8 md:pt-4">
            <button
              disabled={isLoading}
              type="submit"
              className="app-button-primary flex items-center justify-center gap-x-2"
            >
              <span>{translatedValues["CHANGE PASSWORD"]}</span>
              {isLoading && <SpinnerIcon className="animate-spin" />}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ChangePasswordPage;
