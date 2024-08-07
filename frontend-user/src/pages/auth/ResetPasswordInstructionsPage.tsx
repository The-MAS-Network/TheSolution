import { createInvoice } from "@/api/user.api";
import CheckIcon from "@/assets/icons/CheckIcon";
import AppBackButton from "@/components/AppBackButton";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { authStore } from "@/stores/auth.store";
import { ILocationParams, SatsReceivedPageState } from "@/types";
import { CreateInvoiceParams } from "@/types/api/auth.types";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useVisitIntendedRoute } from "@/utilities/visitIntendedRoute";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "zustand";

const pageValues = [
  "We need to verify ownership of your Lightning Address:",
  "In order to verify ownership, we need you to send us ",
  "1000 SATs,",
  " which will be sent back to your Lightning Address:",
  "in two different amounts. This helps validate a user’s account.",
  "CLICK HERE TO GENERATE INVOICE",
  "By checking this box, you agree to our terms and conditions",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const ResetPasswordInstructionsPage = (): JSX.Element => {
  const [isChecked, setIsChecked] = useState(false);
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const navigate = useNavigate();
  const createInvoiceAPI = useMutation({ mutationFn: createInvoice });
  const isLoading = createInvoiceAPI?.isPending;

  const resetPasswordInstructionsState =
    useLocation() as ILocationParams<CreateInvoiceParams>;
  const { state } = resetPasswordInstructionsState;

  const { getUserData } = useStore(authStore);

  const handleGenerateInvoice = async () => {
    if (!isChecked)
      return appToast.Warning(
        "Accept the terms and conditions by checking the box below.",
      );

    const response = await createInvoiceAPI.mutateAsync({
      lightningAddress: state?.lightningAddress,
      purpose: state?.purpose,
    });

    if (response.ok) {
      appToast.Success(
        response?.data?.message ?? "Invoice created successfully.",
      );
      navigate(routes.GENERATE_INVOICE_PAGE, {
        state: {
          lightningAddress: state?.lightningAddress,
          destination: response?.data?.data?.destination,
          purpose: state?.purpose,
        } as SatsReceivedPageState,
      });
    } else handleApiErrors(response);
  };

  useEffect(() => {
    if (state?.purpose == "verify_account" && !!getUserData()?.isVerified) {
      navigate(routes.DASHBOARD_PAGE, { replace: true });
    }
  }, []);

  const { isEffectDone } = useVisitIntendedRoute({
    condition: !state?.lightningAddress || !state?.purpose,
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
        <AppBackButton isPrevious />
        
        <h1 className="mb-3 mt-14 text-center text-lg font-bold text-white">
          {
            translatedValues[
            "We need to verify ownership of your Lightning Address:"
            ]
          }
        </h1>

        <h2 className="my-4 text-center text-base font-bold text-appYellow300">
          {state?.lightningAddress}
        </h2>

        <p className="text-left text-base font-normal text-white">
          {
            translatedValues[
            "In order to verify ownership, we need you to send us "
            ]
          }
          <span className="font-bold text-appYellow300">
            1000 SATs,
          </span>
          {
            translatedValues[
            " which will be sent back to your Lightning Address:"
            ]
          }{" "}
          <span className="font-medium text-appYellow300">
            {state?.lightningAddress}
          </span>{" "}
          {
            translatedValues[
            "in two different amounts. This helps validate a user’s account."
            ]
          }
        </p>


        {/* <p className=" text-left text-base font-normal text-white">
          {
            translatedValues[
              "In order to verify ownership we need you to send us 1000 SATs, which will be sent back to your Lightning Address:"
            ]
          }{" "}
          <span className="font-medium text-appYellow300">
            {state?.lightningAddress}
          </span>{" "}
          {
            translatedValues[
              "in two different amounts. This helps validate a user’s account."
            ]
          }
        </p> */}

        <div className="mb-8 mt-9 flex items-center gap-3 text-sm font-normal sm:text-base">
          <button type="button" onClick={() => setIsChecked((value) => !value)}>
            <span className="flex aspect-square h-6 items-center justify-center overflow-hidden rounded border-[2px] border-appGray300">
              <CheckIcon isChecked={isChecked} />
            </span>
          </button>
          <p className="text-start">
            {
              translatedValues[
              "By checking this box, you agree to our terms and conditions"
              ]
            }
          </p>
        </div>
        <button
          type="button"
          disabled={isLoading}
          onClick={handleGenerateInvoice}
          className="app-button-primary flex items-center justify-center gap-x-2"
        >
          <span>{translatedValues["CLICK HERE TO GENERATE INVOICE"]} </span>
          {isLoading && <SpinnerIcon className="animate-spin" />}
        </button>
      </main>
    </div>
  );
};

export default ResetPasswordInstructionsPage;
