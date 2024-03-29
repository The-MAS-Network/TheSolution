import { verifyDualAmount } from "@/api/user.api";
import AppInput from "@/components/forms/AppInput";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useGetMaxTrialCount } from "@/hooks/useGetRequests";
import routes from "@/navigation/routes";
import { authStore } from "@/stores/auth.store";
import {
  ChangePasswordPageState,
  ILocationParams,
  VerifyLightningAddressPageState,
} from "@/types";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useVisitIntendedRoute } from "@/utilities/visitIntendedRoute";
import { joiResolver } from "@hookform/resolvers/joi";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import Joi from "joi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "zustand";

interface VerifyLightningRequest {
  firstAmount: number;
  secondAmount: number;
}

const schema = Joi.object<VerifyLightningRequest>({
  firstAmount: Joi.number().required(),
  secondAmount: Joi.number().required(),
});

const pageValues = [
  "Enter the two different amounts you recieved",
  "Double-check wallet for accurate SATs sent. Enter both amounts received. Second payment may take up to 1 minute to reflect.",
  "Enter second amount",
  "Enter first amount",
  "CONFIRM",
  "RETURN TO HOME",
  "Trials remaining",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const VerifyLightningPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const { currentTrialCount, setCurrentTrialCount } = useStore(authStore);
  const maxTrialRes = useGetMaxTrialCount();

  const maxTrial = maxTrialRes?.data;

  const verifyLightningAddressPageState =
    useLocation() as ILocationParams<VerifyLightningAddressPageState>;
  const { state } = verifyLightningAddressPageState;

  const verifyDualAmountAPI = useMutation({ mutationFn: verifyDualAmount });
  const isLoading = verifyDualAmountAPI?.isPending;

  useEffect(() => {
    return () => setCurrentTrialCount(0);
  }, []);

  const {
    handleSubmit,
    register,
    resetField,
    formState: { errors },
  } = useForm<VerifyLightningRequest>({
    resolver: joiResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const response = await verifyDualAmountAPI.mutateAsync({
      firstAmount: data?.firstAmount,
      secondAmount: data?.secondAmount,
      lightningAddress: state?.lightningAddress,
      id: state?.invoiceId,
    });
    if (response.ok) {
      appToast.Success(response.data?.message ?? "Verification Successful.");
      navigate(routes.CHANGE_PASSWORD_PAGE, {
        replace: true,
        state: {
          token: response?.data?.data?.token,
        } as ChangePasswordPageState,
      });
    } else {
      setCurrentTrialCount(response?.data?.data?.trialCount ?? 0);
      handleApiErrors(response);
    }
  });

  const { isEffectDone } = useVisitIntendedRoute({
    condition: !state?.lightningAddress,
    otherParams: {
      customIntendedRoutes: [routes.FORGOT_PASSWORD_PAGE],
      defaultRoute: routes.FORGOT_PASSWORD_PAGE,
    },
  });

  if (!isEffectDone) {
    return <></>;
  }

  return (
    <div className="flex min-h-screen flex-col gap-y-5 bg-appDarkBlue100 font-baloo2 text-white sm:justify-center">
      <main className="mx-auto w-full max-w-[30rem] rounded-lg px-5 py-14 sm:bg-appBlue110 sm:py-10">
        {!!maxTrial && currentTrialCount > maxTrial ? (
          <section className="mx-auto flex max-w-[23rem] flex-col items-center justify-center gap-y-6 px-5 py-24 text-center ">
            <div className="flex flex-col items-center gap-y-7 rounded-2xl bg-appRed400  px-2 py-5 text-appRed300">
              <Icon
                className="text-5xl md:text-6xl lg:text-7xl"
                icon="carbon:warning"
              />
              <p className="text-lg">
                You’ve exceeded the max number of attempts.
              </p>
            </div>

            <Link
              className="app-button-primary"
              to={routes.HOME_PAGE}
              replace={true}
            >
              {translatedValues?.["RETURN TO HOME"]}
            </Link>
          </section>
        ) : (
          <div className="mx-auto max-w-[23rem] ">
            <h1 className="text-lg font-medium md:text-xl lg:text-2xl">
              {
                translatedValues?.[
                  "Enter the two different amounts you recieved"
                ]
              }
            </h1>

            <p className="mb-6 mt-2 rounded-lg bg-appYellow400 px-3 py-2  text-sm text-appYellow300">
              {
                translatedValues?.[
                  "Double-check wallet for accurate SATs sent. Enter both amounts received. Second payment may take up to 1 minute to reflect."
                ]
              }
            </p>

            <form onSubmit={onSubmit}>
              <label className="mb-1 block">
                {translatedValues?.["Enter first amount"]}
              </label>
              <AppInput
                id="firstAmount"
                placeholder={"0"}
                errorMessage={errors?.firstAmount?.message ?? null}
                disabled={isLoading}
                hookFormProps={{ ...register("firstAmount") }}
                type="number"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => resetField("firstAmount")}
                  >
                    <Icon
                      className="text-xl sm:text-2xl"
                      icon="iconamoon:close-bold"
                    />
                  </button>
                }
              />

              <label className="mb-1 mt-5 block">
                {translatedValues?.["Enter second amount"]}
              </label>
              <AppInput
                id="secondAmount"
                placeholder={"0"}
                errorMessage={errors?.secondAmount?.message ?? null}
                disabled={isLoading}
                hookFormProps={{ ...register("secondAmount") }}
                type="number"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => resetField("secondAmount")}
                  >
                    <Icon
                      className="text-xl sm:text-2xl"
                      icon="iconamoon:close-bold"
                    />
                  </button>
                }
              />

              <p className="mb-10 mt-6 px-2 text-appRed200">
                {currentTrialCount} / {maxTrial}
                {"   "}
                {translatedValues?.["Trials remaining"]}
              </p>

              <button
                disabled={isLoading}
                type="submit"
                className="app-button-primary flex items-center justify-center gap-x-2"
              >
                <span> {translatedValues?.CONFIRM} </span>
                {isLoading && <SpinnerIcon className="animate-spin" />}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default VerifyLightningPage;
