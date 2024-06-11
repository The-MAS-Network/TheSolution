import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import ChangeLanguagePage from "@/pages/ChangeLanguagePage";
import PageNotFound from "@/pages/PageNotFound";
import { Route, Routes } from "react-router-dom";
import ChangeLanguageButton from "./ChangeLanguageButton";
import MaintenanceImage from "@/assets/images/maintenance.svg";

const pageValues = ["Admin", "Website under maintenance"] as const;

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
    <div className="min-h-screen items-center  justify-center bg-appDarkBlue100 font-baloo2 md:flex">
      <main className="app-container flex min-h-screen flex-col pt-24 text-white md:min-h-max md:pt-0 ">
        <h1 className="mb-7 mt-1 text-4xl font-medium ">
          {translatedValues.Admin}
        </h1>

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
