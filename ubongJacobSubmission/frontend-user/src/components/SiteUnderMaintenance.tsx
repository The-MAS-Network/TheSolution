import { Route, Routes } from "react-router-dom";

import GetStartedChip from "@/assets/images/get-started-chip.svg";
import GetStartedMedia from "@/assets/images/get-started-media.svg";
import ChangeLanguageButton from "@/components/ChangeLanguageButton";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import ChangeLanguagePage from "@/pages/ChangeLanguagePage";
import MaintenanceImage from "@/assets/images/maintenance.svg";
import PageNotFound from "@/pages/PageNotFound";

const pageValues = ["Website under maintenance"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const SiteUnderMaintenance = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  return (
    <div className="relative bg-gradient-to-br from-appBlue100 to-appBlue200">
      <div className="absolute inset-0 z-10 hidden items-center lg:flex ">
        <div className="mx-auto -mt-40  flex w-full max-w-[60rem] items-center justify-between px-5">
          <img src={GetStartedChip} />
          <img className="rotate-180" src={GetStartedChip} />
        </div>
      </div>
      <div className="absolute inset-0 z-[5] hidden items-end justify-end lg:flex ">
        <img src={GetStartedMedia} />
      </div>

      <main className="app-container relative z-20 flex min-h-screen flex-col justify-center">
        <img
          src={MaintenanceImage}
          alt={translatedValues?.["Website under maintenance"]}
        />

        <h1 className="py-5 text-center font-baloo2 text-xl font-bold text-white md:text-2xl lg:text-3xl">
          {translatedValues["Website under maintenance"]}
        </h1>

        <ChangeLanguageButton />
      </main>
    </div>
  );
};

function SiteUnderMaintenanceRouter() {
  return (
    <Routes>
      <Route index Component={SiteUnderMaintenance} />
      <Route
        path={routes.CHANGE_LANGUAGE_PAGE}
        Component={ChangeLanguagePage}
      />

      {/* PLEASE THIS SHOULD ALWAYS BE LAST */}
      <Route path={routes.PAGE_NOT_FOUND} Component={PageNotFound} />
      <Route path="/*" Component={PageNotFound} />
    </Routes>
  );
}
export default SiteUnderMaintenanceRouter;
