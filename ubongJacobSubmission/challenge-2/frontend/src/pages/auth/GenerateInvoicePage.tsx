import { verifyInvoice } from "@/api/user.api";
import { useGetMaxTrialCount } from "@/hooks/useGetRequests";
import routes from "@/navigation/routes";
import { ILocationParams, VerifyLightningAddressPageState } from "@/types";
import { VerifyInvoiceParams } from "@/types/api/auth.types";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useVisitIntendedRoute } from "@/utilities/visitIntendedRoute";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import VerifyOwnership from "./components/VerifyOwnership";
import VerifyPaymentLoader from "./components/VerifyPaymentLoader";

const GenerateInvoicePage = (): JSX.Element => {
  const generateInvoicePageState =
    useLocation() as ILocationParams<VerifyInvoiceParams>;
  const { state } = generateInvoicePageState;
  const navigate = useNavigate();

  useGetMaxTrialCount();

  const verifyInvoiceAPI = useMutation({ mutationFn: verifyInvoice });
  const isLoading = verifyInvoiceAPI?.isPending;

  const handleVerification = async () => {
    const response = await verifyInvoiceAPI.mutateAsync({
      destination: state?.destination,
      lightningAddress: state?.lightningAddress,
    });

    if (response?.ok) {
      navigate(routes?.SATS_RECEIVED_PAGE, {
        state: {
          lightningAddress: state?.lightningAddress,
          invoiceId: response?.data?.data?.invoiceId,
        } as VerifyLightningAddressPageState,
      });
      appToast.Success(response?.data?.message ?? "Verification success");
    } else handleApiErrors(response);
  };

  const { isEffectDone } = useVisitIntendedRoute({
    condition: !state?.lightningAddress || !state?.destination,
    otherParams: {
      customIntendedRoutes: [routes.FORGOT_PASSWORD_PAGE],
      defaultRoute: routes.FORGOT_PASSWORD_PAGE,
    },
  });

  if (!isEffectDone) {
    return <></>;
  }

  return (
    <div className="min-h-screen flex-col justify-center gap-y-5 bg-appDarkBlue100 font-baloo2 text-white sm:flex">
      <main className="mx-auto flex min-h-screen w-full  max-w-[30rem] flex-col rounded-lg px-6 pb-8 pt-14 sm:min-h-max sm:bg-appBlue110 sm:pt-10 ">
        {isLoading ? (
          <VerifyPaymentLoader />
        ) : (
          <VerifyOwnership
            destination={state?.destination}
            onVerify={handleVerification}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
};

export default GenerateInvoicePage;
