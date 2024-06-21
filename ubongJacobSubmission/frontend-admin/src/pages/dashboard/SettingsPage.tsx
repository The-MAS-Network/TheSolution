import ChangeLanguageButton from "@/components/ChangeLanguageButton";
import DashboardTitle from "@/components/DashboardTitle";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { authStore } from "@/stores/auth.store";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";

const pageValues = ["Log out"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const SettingsPage = (): JSX.Element => {
  const { logout } = useStore(authStore);
  const navigate = useNavigate();
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  const handleLogout = () => {
    logout();
    navigate(routes.LOGIN_PAGE, { replace: true });
  };

  return (
    <main className="app-container-lg  h-full  min-h-screen flex-col items-center justify-center md:flex ">
      <section className="mx-auto flex h-full min-h-screen w-full max-w-[25rem] flex-col pt-12  text-white md:min-h-max  md:pt-0">
        <DashboardTitle title={"Settings"} />

        <ChangeLanguageButton className="bg-appBlue130 mt-8" />

        <div className="flex flex-1 items-end justify-center pb-9 pt-60">
          <button
            onClick={handleLogout}
            className="flex  items-center gap-x-3 py-3 text-base font-semibold transition-all duration-300 hover:text-appYellow100 md:text-lg lg:text-xl"
            type="button"
          >
            <span>{translatedValues["Log out"]}</span>
            <Icon
              className="text-lg md:text-xl lg:text-2xl"
              icon="line-md:log-out"
            />
          </button>
        </div>
      </section>
    </main>
  );
};

export default SettingsPage;
