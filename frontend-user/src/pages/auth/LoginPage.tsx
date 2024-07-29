import { Icon } from "@iconify/react";
import Joi from "joi";
import { useForm } from "react-hook-form";

import { login } from "@/api/user.api";
import AppBackButton from "@/components/AppBackButton";
import AppInput from "@/components/forms/AppInput";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useCheckIfUserIsLoggedIn } from "@/hooks/useCheckIfUserIsLoggedIn";
import routes from "@/navigation/routes";
import { authStore } from "@/stores/auth.store";
import { useNavigationHistoryStore } from "@/stores/navigationHistoryStore";
import { LoginRequest } from "@/types/api/auth.types";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { joiLightningSchema } from "@/utilities";
import CheckIcon from "@/assets/icons/CheckIcon";
import { EmojioneV1LightningMood } from "@/components/icons";

interface ITranslate {
  welcomeBack: string;
  enterYourLightningAddress: string;
  password: string;
  rememberMe: string;
  forgetPassowrd: string;
  signIn: string;
  signUp: string;
  dontHaveAnAccountYet: string;
}

const values: ITranslate = {
  welcomeBack: "Welcome back!",
  enterYourLightningAddress: "Enter your Lightning Address",
  password: "Password",
  forgetPassowrd: "Forget Password",
  rememberMe: "Remember me",
  signIn: "SIGN IN",
  dontHaveAnAccountYet: "Don’t have an account yet?",
  signUp: "SIGN UP",
};

const loginSchema = Joi.object<LoginRequest>({
  password: Joi.string().min(8).max(255).required(),
  lightningAddress: joiLightningSchema,
});

const LoginPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });
  const [isChecked, setIsChecked] = useState(false);
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const { redirectedFromPath } = useStore(useNavigationHistoryStore);
  const { setLoginResponse } = useStore(authStore);
  const navigate = useNavigate();

  const loginAPI = useMutation({ mutationFn: login });

  const getRedirectedPath = () => {
    if (
      !!redirectedFromPath &&
      redirectedFromPath !== routes.LOGIN_PAGE &&
      redirectedFromPath !== routes.HOME_PAGE
    )
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
    if (response.ok) {
      if (response.data) setLoginResponse(response.data);
      navigate(getRedirectedPath(), {
        replace: true,
      });
      appToast.Success(response.data?.message ?? "Login Successful.");
    } else handleApiErrors(response);
  });

  const isLoading = loginAPI.isPending;

  // SHOULD BE LAST
  const { isEffectDone } = useCheckIfUserIsLoggedIn();
  if (!isEffectDone) return <></>;

  return (
    <div className="min-h-screen  items-center justify-center bg-appDarkBlue100 md:flex">
      <main className="app-container flex min-h-screen flex-col text-white md:min-h-max ">
        <header className="mb-11 pt-12">
          <AppBackButton />
        </header>

        <h1 className="mb-6 text-2xl font-semibold md:text-3xl lg:text-4xl">
          {translatedValues.welcomeBack}
        </h1>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-y-4">
            <AppInput
              id="lightningAddress"
              placeholder={translatedValues.enterYourLightningAddress}
              errorMessage={errors?.lightningAddress?.message ?? null}
              disabled={isLoading}
              hookFormProps={{ ...register("lightningAddress") }}
              leftIcon={
                <EmojioneV1LightningMood className="text-xl sm:text-2xl" />
              }
            />
            <AppInput
              id="password"
              placeholder={translatedValues.password}
              errorMessage={errors?.password?.message ?? null}
              disabled={isLoading}
              hookFormProps={{ ...register("password") }}
              autoComplete="password"
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
          </div>

          <div className="my-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsChecked((value) => !value)}
              className="flex items-center gap-3 text-sm font-normal sm:text-base"
            >
              <span className="flex aspect-square h-6 items-center justify-center overflow-hidden rounded border-[2px] border-appGray300">
                <CheckIcon isChecked={isChecked} />
              </span>
              <span>{translatedValues.rememberMe}</span>
            </button>

            <Link
              to={routes.FORGOT_PASSWORD_PAGE}
              className="text-sm font-semibold text-white transition-all duration-300 hover:text-appYellow100 sm:text-base"
            >
              {translatedValues.forgetPassowrd}
            </Link>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="app-button-primary flex items-center justify-center gap-x-2"
          >
            <span>{translatedValues.signIn}</span>
            {isLoading && <SpinnerIcon className="animate-spin" />}
          </button>
        </form>
        <div className="flex flex-1 flex-col justify-end py-10 md:pt-32">
          <p className="text-center text-sm font-medium sm:text-base">
            {translatedValues.dontHaveAnAccountYet}
            <Link
              className="px-2 font-bold transition-all duration-300 hover:text-appYellow100"
              to={routes.REGISTER_PAGE}
            >
              {translatedValues.signUp}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
