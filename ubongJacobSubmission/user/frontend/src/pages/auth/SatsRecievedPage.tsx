import { useAppTranslator } from "@/hooks/useAppTranslator";
import { Icon } from "@iconify/react";
import Lottie from "lottie-react";
import doneLoader from "../../assets/animation/done.json";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "@/navigation/routes";
import { ILocationParams, VerifyLightningAddressPageState } from "@/types";
import { useVisitIntendedRoute } from "@/utilities/visitIntendedRoute";
import { useGetMaxTrialCount } from "@/hooks/useGetRequests";

const pageValues = [
  "SATs received",
  "Thanks for focusing on the Solution",
  "CONTINUE",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const SatsRecievedPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const navigate = useNavigate();
  useGetMaxTrialCount();
  const satsReceivedPageState =
    useLocation() as ILocationParams<VerifyLightningAddressPageState>;

  const { state } = satsReceivedPageState;

  const { isEffectDone } = useVisitIntendedRoute({
    condition: !state?.lightningAddress || !state?.invoiceId || !state?.purpose,
    otherParams: {
      customIntendedRoutes: [routes.FORGOT_PASSWORD_PAGE],
      defaultRoute: routes.FORGOT_PASSWORD_PAGE,
    },
  });

  if (!isEffectDone) {
    return <></>;
  }

  const handleClick = () => {
    navigate(routes.VERIFY_LIGHTNING_ADDRESS_PAGE, {
      state: {
        lightningAddress: state?.lightningAddress,
        invoiceId: state?.invoiceId,
        purpose: state?.purpose,
      } as VerifyLightningAddressPageState,
      replace: true,
    });
  };

  return (
    <div className="min-h-screen flex-col justify-center gap-y-5 bg-appDarkBlue100 font-baloo2 text-white sm:flex">
      <main className="mx-auto flex min-h-screen w-full  max-w-[30rem] flex-col rounded-lg px-6 pb-8 pt-14 sm:min-h-max sm:bg-appBlue110 sm:pt-10 ">
        <div className="flex flex-1 flex-col items-center">
          <div className="w-full max-w-44 p-5">
            <Lottie animationData={doneLoader} loop={true} />
          </div>
          <span className="mt-6 flex items-center gap-2">
            <Icon
              className="text-xl sm:text-2xl"
              icon="emojione-v1:lightning-mood"
            />
            <h1 className="text-lg font-bold sm:text-xl">
              {translatedValues?.["SATs received"]}
            </h1>
          </span>
          <p className="mb-20 mt-2">
            {translatedValues?.["Thanks for focusing on the Solution"]}
          </p>

          <button
            onClick={handleClick}
            type="button"
            className="app-button-primary mt-auto flex items-center justify-center gap-x-2 sm:mt-0"
          >
            <span>{translatedValues?.CONTINUE}</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default SatsRecievedPage;
