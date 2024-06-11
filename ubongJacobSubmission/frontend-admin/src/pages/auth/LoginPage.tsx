import { Icon } from "@iconify/react";
import Joi from "joi";
import { useForm } from "react-hook-form";

// import { login } from "@/api/user.api";
import { login } from "@/api/user.api";
import EmailIcon from "@/assets/icons/EmailIcon";
import AppInput from "@/components/forms/AppInput";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useCheckIfUserIsLoggedIn } from "@/hooks/useCheckIfUserIsLoggedIn";
import routes from "@/navigation/routes";
import { authStore } from "@/stores/auth.store";
import { useNavigationHistoryStore } from "@/stores/navigationHistoryStore";
import { VerifyOTPPageState } from "@/types";
import { LoginRequest } from "@/types/api/auth.types";
import { joiSchemas } from "@/utilities";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "zustand";

const pageValues = [
  "Admin",
  "Login",
  "Email address",
  "Password",
  "Forget password?",
  "SIGN IN",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const loginSchema = Joi.object<LoginRequest>({
  email: joiSchemas.email,
  password: Joi.string().min(3).max(255).required(),
});

const LoginPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const { redirectedFromPath } = useStore(useNavigationHistoryStore);
  const { setLoginResponse } = useStore(authStore);
  const navigate = useNavigate();

  const loginAPI = useMutation({ mutationFn: login });

  const getRedirectedPath = () => {
    if (!!redirectedFromPath && redirectedFromPath !== routes.LOGIN_PAGE)
      return redirectedFromPath;
    else return routes.DASHBOARD_PAGE;
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: joiResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const response = await loginAPI.mutateAsync(data);
    if (response.ok && response.data) {
      setLoginResponse(response.data);
      if (response?.data?.data?.isVerified) {
        navigate(getRedirectedPath(), {
          replace: true,
        });
      } else {
        navigate(routes.VERIFY_OTP_PAGE, {
          state: {
            email: response?.data?.data?.email,
            purpose: "Change Password",
          } as VerifyOTPPageState,
        });
      }

      appToast.Success(response.data?.message ?? "Login Successful.");
    } else handleApiErrors(response);
  });

  const isLoading = loginAPI.isPending;

  // SHOULD BE LAST
  const { isEffectDone } = useCheckIfUserIsLoggedIn();
  if (!isEffectDone) return <></>;

  return (
    <div className="min-h-screen items-center  justify-center bg-appDarkBlue100 font-baloo2 md:flex">
      <main className="app-container flex min-h-screen flex-col pt-24 text-white md:min-h-max md:pt-0 ">
        <h1 className="text-base font-medium">{translatedValues?.Admin}</h1>
        <h2 className="mb-7 mt-1 text-4xl font-medium ">
          {translatedValues.Login}
        </h2>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-y-5">
            <AppInput
              id="email"
              autoComplete="email"
              placeholder={translatedValues["Email address"]}
              errorMessage={errors?.email?.message ?? null}
              disabled={isLoading}
              hookFormProps={{ ...register("email") }}
              leftIcon={
                <span className="text-2xl  text-appGray200">
                  <EmailIcon />
                </span>
              }
            />
            <AppInput
              id="password"
              placeholder={translatedValues.Password}
              errorMessage={errors?.password?.message ?? null}
              disabled={isLoading}
              hookFormProps={{ ...register("password") }}
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
          </div>

          <div className="my-6 flex items-center justify-end">
            <Link
              to={routes.FORGOT_PASSWORD_PAGE}
              className="text-sm font-semibold text-white transition-all duration-300 hover:text-appYellow100 sm:text-base"
            >
              {translatedValues["Forget password?"]}
            </Link>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="app-button-primary flex items-center justify-center gap-x-2"
          >
            <span>{translatedValues["SIGN IN"]}</span>
            {isLoading && <SpinnerIcon className="animate-spin" />}
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
