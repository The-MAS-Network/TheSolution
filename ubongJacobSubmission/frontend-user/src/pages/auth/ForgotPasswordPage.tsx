import Joi from "joi";
import { useForm } from "react-hook-form";

import { login } from "@/api/user.api";
import AppBackButton from "@/components/AppBackButton";
import AppInput from "@/components/forms/AppInput";
import { EmojioneV1LightningMood } from "@/components/icons";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useCheckIfUserIsLoggedIn } from "@/hooks/useCheckIfUserIsLoggedIn";
import routes from "@/navigation/routes";
import {
  CreateInvoiceParams,
  ForgotPasswordRequest,
} from "@/types/api/auth.types";
import { joiLightningSchema } from "@/utilities";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface ITranslate {
  enterYourLightningAddress: string;
  enterYourLghtningAddressBelowToGetStarted: string;
  forgotPassword: string;
  submit: string;
}

const values: ITranslate = {
  enterYourLightningAddress: "Enter your lightning address",
  enterYourLghtningAddressBelowToGetStarted:
    "Enter your lightning address below to get started.",
  forgotPassword: "Forget Password ?",
  submit: "Submit",
};

const schema = Joi.object<ForgotPasswordRequest>({
  lightningAddress: joiLightningSchema,
});

const ForgotPasswordPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });

  const navigate = useNavigate();

  const loginAPI = useMutation({ mutationFn: login });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>({
    resolver: joiResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    navigate(routes.RESET_PASSWORD_INSTRUCTIONS_PAGE, {
      state: {
        lightningAddress: data?.lightningAddress?.trim(),
        purpose: "forgot_password",
      } as CreateInvoiceParams,
    });
  });

  const isLoading = loginAPI?.isPending;

  // SHOULD BE LAST
  const { isEffectDone } = useCheckIfUserIsLoggedIn();
  if (!isEffectDone) return <></>;

  return (
    <div className="min-h-screen  items-center justify-center bg-appDarkBlue100 md:flex">
      <main className="app-container flex min-h-screen flex-col text-white md:min-h-max ">
        <header className="mb-11 pt-12">
          <AppBackButton />
        </header>

        <h1 className=" text-2xl font-semibold md:text-3xl lg:text-4xl">
          {translatedValues.forgotPassword}
        </h1>
        <p className="mb-10 pb-6  pt-3 text-sm font-normal sm:text-base">
          {translatedValues.enterYourLghtningAddressBelowToGetStarted}
        </p>
        <form onSubmit={onSubmit}>
          <div className="mb-20 flex flex-col gap-y-4">
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
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="app-button-primary flex items-center justify-center gap-x-2"
          >
            <span>{translatedValues.submit}</span>
            {isLoading && <SpinnerIcon className="animate-spin" />}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
