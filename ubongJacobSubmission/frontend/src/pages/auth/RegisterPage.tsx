import { Icon } from "@iconify/react";
import Joi from "joi";
import { useForm } from "react-hook-form";

import AppBackButton from "@/components/AppBackButton";
import AppInput from "@/components/forms/AppInput";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useCheckIfUserIsLoggedIn } from "@/hooks/useCheckIfUserIsLoggedIn";
import routes from "@/navigation/routes";
import { NickNamePageState } from "@/types";
import { appToast } from "@/utilities/appToast";
import { joiResolver } from "@hookform/resolvers/joi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verifyLightningAddress } from "@/api/user.api";
import { handleApiErrors } from "@/utilities/handleErrors";
import SpinnerIcon from "@/components/icons/SpinnerIcon";

interface ITranslate {
  getStartedByEnteringYourLightningAddress: string;
  enterYourLightningAddress: string;
  password: string;
  confirmPassword: string;
  continue: string;
}

const values: ITranslate = {
  getStartedByEnteringYourLightningAddress:
    "Get started by entering your Lightning Address",
  enterYourLightningAddress: "Enter your lightning address",
  password: "Password",
  confirmPassword: "Confirm Password",
  continue: "CONTINUE",
};

interface RegisterSchema {
  confirmPassword: string;
  lightningAddress: string;
  password: string;
}

const registerSchema = Joi.object<RegisterSchema>({
  confirmPassword: Joi.string().min(8).max(255).required(),
  password: Joi.string().min(8).max(255).required(),
  lightningAddress: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: false,
    })
    .required()
    .min(3)
    .max(255)
    .label("Lightning Address"),
});

const RegisterPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisibility] =
    useState(false);

  const navigate = useNavigate();

  const verifyLightningAddressAPI = useMutation({
    mutationFn: verifyLightningAddress,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: joiResolver(registerSchema),
  });

  const isLoading = verifyLightningAddressAPI.isPending;

  const onSubmit = handleSubmit(async (data) => {
    if (data.confirmPassword.trim() !== data.password.trim()) {
      return appToast.Warning("Password and confirm password does not match.");
    }

    const response = await verifyLightningAddressAPI.mutateAsync({
      lightningAddress: data.lightningAddress,
    });
    if (response.ok) {
      navigate(routes.NICKNAME_PAGE, {
        replace: true,
        state: {
          password: data.confirmPassword.trim(),
          lightningAddress: data.lightningAddress,
        } as NickNamePageState,
      });
    } else appToast.Error(handleApiErrors(response));
  });

  // SHOULD BE THE LAST
  const { isEffectDone } = useCheckIfUserIsLoggedIn();
  if (!isEffectDone) return <></>;

  return (
    <div className="min-h-screen  items-center justify-center bg-appDarkBlue100 md:flex">
      <main className="app-container flex min-h-screen flex-col text-white md:min-h-max ">
        <header className="mb-11 pt-12">
          <AppBackButton isPrevious />
        </header>

        <h1 className="mb-6 pr-1 text-2xl font-semibold md:text-3xl lg:text-4xl">
          {translatedValues.getStartedByEnteringYourLightningAddress}
        </h1>
        <form
          className="flex flex-1 flex-col justify-between "
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-y-4">
            <AppInput
              id="lightningAddress"
              placeholder={translatedValues.enterYourLightningAddress}
              errorMessage={
                errors?.lightningAddress?.message?.replace(
                  "email",
                  "lightning address",
                ) ?? null
              }
              hookFormProps={{ ...register("lightningAddress") }}
              disabled={isLoading}
              leftIcon={
                <Icon
                  className="text-xl sm:text-2xl"
                  icon="emojione-v1:lightning-mood"
                />
              }
            />

            <AppInput
              id="password"
              placeholder={translatedValues.password}
              disabled={isLoading}
              errorMessage={errors?.password?.message ?? null}
              hookFormProps={{ ...register("password") }}
              autoComplete="new-password"
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
              id="confirmPassword"
              placeholder={translatedValues.confirmPassword}
              errorMessage={errors?.confirmPassword?.message ?? null}
              hookFormProps={{ ...register("confirmPassword") }}
              disabled={isLoading}
              autoComplete="password"
              type={isConfirmPasswordVisible ? "text" : "password"}
              leftIcon={
                <Icon
                  className="text-xl sm:text-2xl"
                  icon="mdi:password-outline"
                />
              }
              rightIcon={
                <button
                  className="text-xl sm:text-2xl"
                  onClick={() =>
                    setConfirmPasswordVisibility((value) => !value)
                  }
                  type="button"
                >
                  {isConfirmPasswordVisible ? (
                    <Icon key={1} icon="line-md:watch" />
                  ) : (
                    <Icon key={2} icon="line-md:watch-off" />
                  )}
                </button>
              }
            />
          </div>

          <div className="py-7">
            <button
              disabled={isLoading}
              type="submit"
              className="app-button-primary flex items-center justify-center gap-x-2"
            >
              {translatedValues.continue}
              {isLoading && <SpinnerIcon className="animate-spin" />}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RegisterPage;
