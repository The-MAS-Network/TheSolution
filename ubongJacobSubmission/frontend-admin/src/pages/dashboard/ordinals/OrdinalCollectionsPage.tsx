import DashboardTitle from "@/components/DashboardTitle";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { appStateStore } from "@/stores/appState.store";
import { Icon } from "@iconify/react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useStore } from "zustand";

const pageValues = ["Inactive Collection", "Active Collection"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const OrdinalCollectionsPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const {
    setActiveQuickAction,
    setIsQuickActionEdit,
    activeQuickAction,
    isQuickActionEdit,
  } = useStore(appStateStore);

  const pathName = useLocation().pathname;

  const navItems = [
    {
      title: translatedValues["Inactive Collection"],
      route: routes.INACTIVE_ORDINAL_COLLECTIONS_PAGE,
    },
    {
      title: translatedValues["Active Collection"],
      route: routes.ACTIVE_ORDINAL_COLLECTIONS_PAGE,
    },
  ];

  const handleBodyClick = () => {
    if (!!activeQuickAction) setActiveQuickAction(null);
    if (!!isQuickActionEdit) setIsQuickActionEdit(false);
  };

  return (
    <main
      onClick={handleBodyClick}
      className="app-container-lg  h-full  min-h-screen flex-col  items-center md:flex "
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex h-full min-h-screen w-full max-w-[25rem] flex-col pb-20 text-white md:min-h-max  "
      >
        <div className="sticky top-0 z-20 bg-appBlue100  pt-12 ">
          <DashboardTitle
            title={"Ordinals Collection"}
            rightIcon={
              <Link to={routes.PAYMENTS_HISTORY_PAGE}>
                <Icon
                  icon="iconamoon:history-duotone"
                  className="cursor-pointer text-2xl"
                />
              </Link>
            }
          />

          <ul className="my-7 flex rounded-full bg-appBlue140 p-1 ">
            {navItems?.map(({ route, title }, key) => (
              <li key={key} className="flex-1">
                <Link
                  replace
                  className={`block rounded-full bg-appDarkBlue400 py-2 text-center text-sm font-normal transition-all duration-300  sm:text-base ${pathName === route ? "bg-opacity-100" : "bg-opacity-0"}`}
                  to={route}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Outlet />
      </section>
    </main>
  );
};

export default OrdinalCollectionsPage;
