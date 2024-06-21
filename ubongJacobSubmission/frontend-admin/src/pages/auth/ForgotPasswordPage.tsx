import Joi from "joi";
import { useForm } from "react-hook-form";

import EmailIcon from "@/assets/icons/EmailIcon";
import AppInput from "@/components/forms/AppInput";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useCheckIfUserIsLoggedIn } from "@/hooks/useCheckIfUserIsLoggedIn";
import routes from "@/navigation/routes";
import { joiSchemas } from "@/utilities";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router-dom";
import { VerifyOTPPageState } from "@/types";
import AppBackButton from "@/components/AppBackButton";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useMutation } from "@tanstack/react-query";
import { generateOTP } from "@/api/user.api";

const pageValues = [
  "Forgot",
  "Password",
  "SEND OTP",
  "Enter email address to receive OTP",
  "Email address",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

interface Schema {
  email: string;
}

const schema = Joi.object<Schema>({
  email: joiSchemas.email,
});

const ForgotPasswordPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const navigate = useNavigate();
  const generateOTPAPI = useMutation({ mutationFn: generateOTP });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Schema>({
    resolver: joiResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const response = await generateOTPAPI.mutateAsync({
      email: data?.email?.toLowerCase(),
      purpose: "FORGOT_PASSWORD",
    });
    if (response.ok) {
      navigate(routes.VERIFY_OTP_PAGE, {
        state: {
          email: data?.email,
          purpose: "Set New Password",
        } as VerifyOTPPageState,
      });
      appToast.Success(response.data?.message ?? "OTP Sent.");
    } else handleApiErrors(response);
  });

  const isLoading = generateOTPAPI?.isPending;

  // SHOULD BE LAST
  const { isEffectDone } = useCheckIfUserIsLoggedIn();

  if (!isEffectDone) {
    return <></>;
  }

  return (
    <div className="min-h-screen items-center  justify-center bg-appDarkBlue100 font-baloo2 md:flex">
      <main className="app-container flex min-h-screen flex-col  pt-24 text-white md:min-h-max md:pt-0 ">
        <AppBackButton />

        <h1 className="mt-8 text-4xl font-medium">
          {translatedValues.Forgot} {"  "} <br className="md:hidden" />
          {translatedValues.Password}
        </h1>
        <h2 className="mb-4 mt-5 text-base  font-medium">
          {translatedValues["Enter email address to receive OTP"]}
        </h2>
        <form className="flex flex-1 flex-col " onSubmit={onSubmit}>
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

          <div className="mt-auto  pb-11 pt-8">
            <button
              disabled={isLoading}
              type="submit"
              className="app-button-primary flex items-center justify-center gap-x-2"
            >
              <span>{translatedValues["SEND OTP"]}</span>
              {isLoading && <SpinnerIcon className="animate-spin" />}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
