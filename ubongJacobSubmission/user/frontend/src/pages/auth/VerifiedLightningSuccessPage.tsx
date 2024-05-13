import { VerifiedIcon } from "@/assets/icons/VerifiedIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { ChangePasswordPageState, ILocationParams } from "@/types";
import { useVisitIntendedRoute } from "@/utilities/visitIntendedRoute";
import { useLocation, useNavigate } from "react-router-dom";

const pageValues = [
  "OKAY",
  "You have successfully verified your Lightning Address.",
  "Verified!",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const VerifiedLightningSuccessPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const navigate = useNavigate();

  const changePasswordPageState =
    useLocation() as ILocationParams<ChangePasswordPageState>;
  const { state } = changePasswordPageState;

  const { isEffectDone } = useVisitIntendedRoute({
    condition: !state?.token,
    otherParams: {
      customIntendedRoutes: [routes.DASHBOARD_PAGE],
      defaultRoute: routes.DASHBOARD_PAGE,
    },
  });

  if (!isEffectDone) {
    return <></>;
  }

  return (
    <div className="flex min-h-screen flex-col gap-y-5 bg-appDarkBlue100 font-baloo2 text-white sm:justify-center">
      <main className="mx-auto w-full max-w-[30rem] rounded-lg px-5 py-14 sm:bg-appBlue110 sm:py-10">
        <section className="mx-auto flex max-w-[23rem] flex-col items-center justify-center pb-10 pt-16 text-center ">
          <VerifiedIcon />
          <p className="mb-2 mt-5 text-lg font-bold md:text-xl lg:text-2xl">
            {translatedValues["Verified!"]}
          </p>

          <p className="mb-16 text-base md:text-lg lg:text-xl">
            {
              translatedValues[
                "You have successfully verified your Lightning Address."
              ]
            }
          </p>

          <button
            className="app-button-primary"
            onClick={() => navigate(routes?.DASHBOARD_PAGE, { replace: true })}
          >
            {translatedValues?.["OKAY"]}
          </button>
        </section>
      </main>
    </div>
  );
};

export default VerifiedLightningSuccessPage;
