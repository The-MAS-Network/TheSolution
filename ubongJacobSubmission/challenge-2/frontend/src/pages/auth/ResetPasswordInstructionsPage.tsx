import { createInvoice } from "@/api/user.api";
import AppBackButton from "@/components/AppBackButton";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { ILocationParams } from "@/types";
import {
  CreateInvoiceParams,
  VerifyInvoiceParams,
} from "@/types/api/auth.types";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useVisitIntendedRoute } from "@/utilities/visitIntendedRoute";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

const pageValues = [
  "We need to verify ownership of your lightning address",
  "In order to verify ownership we need you to send us 1000 SATS, which will be sent back to your lightning address:",
  "in two different amounts minus the transaction fee of XXX. This is to help validate a user account.",
  "CLICK HERE TO GENERATE INVOICE",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const ResetPasswordInstructionsPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const navigate = useNavigate();
  const createInvoiceAPI = useMutation({ mutationFn: createInvoice });
  const isLoading = createInvoiceAPI?.isPending;

  const resetPasswordInstructionsState =
    useLocation() as ILocationParams<CreateInvoiceParams>;
  const { state } = resetPasswordInstructionsState;

  const handleGenerateInvoice = async () => {
    const response = await createInvoiceAPI.mutateAsync({
      lightningAddress: state?.lightningAddress,
    });

    if (response.ok) {
      appToast.Success(
        response?.data?.message ?? "Invoice created successfully.",
      );
      navigate(routes.GENERATE_INVOICE_PAGE, {
        state: {
          lightningAddress: state?.lightningAddress,
          destination: response?.data?.data?.destination,
        } as VerifyInvoiceParams,
      });
    } else handleApiErrors(response);
  };

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
        <AppBackButton isPrevious />
        <h1 className="mb-3 mt-14 text-center text-lg font-bold text-white">
          {
            translatedValues[
              "We need to verify ownership of your lightning address"
            ]
          }
        </h1>

        <h2 className="my-4 text-center text-base font-bold text-appYellow300">
          {state?.lightningAddress}
        </h2>

        <p className="mb-14 text-center text-base font-normal text-white">
          {
            translatedValues[
              "In order to verify ownership we need you to send us 1000 SATS, which will be sent back to your lightning address:"
            ]
          }{" "}
          <span className="font-medium text-appYellow300">
            {state?.lightningAddress}
          </span>{" "}
          {
            translatedValues[
              "in two different amounts minus the transaction fee of XXX. This is to help validate a user account."
            ]
          }
        </p>

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
