import OrdinalIcon from "@/components/icons/OrdinalIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const pageValues = ["Ordinals", "Settings"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const DashboardPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const navs = [
    {
      title: translatedValues.Ordinals,
      icon: <OrdinalIcon className="text-3xl md:text-4xl lg:text-5xl" />,
      route: routes.ORDINAL_COLLECTIONS_PAGE,
    },

    {
      title: translatedValues.Settings,
      icon: (
        <Icon
          className="text-5xl text-white sm:text-5xl  md:text-6xl lg:text-7xl"
          icon="solar:settings-linear"
        />
      ),
      route: routes.SETTINGS_PAGE,
    },
  ];

  return (
    <main className="app-container-lg  h-full  min-h-screen flex-col items-center justify-center pt-12 md:flex">
      <ul className="grid w-full grid-cols-3 gap-x-7 gap-y-10 sm:max-w-sm sm:grid-cols-2 sm:gap-x-10 md:gap-x-20 lg:max-w-md lg:grid-cols-2 lg:gap-x-24">
        {navs.map(({ icon, title, route }, index) => (
          <li
            className="group flex aspect-square w-full flex-col items-center justify-center"
            key={index}
          >
            <Link
              to={route}
              className="group flex aspect-square w-full flex-col items-center justify-center"
            >
              <div className="dashboard-card-bg flex aspect-square w-full items-center justify-center rounded-3xl  transition-all duration-300 active:scale-100 group-hover:scale-105">
                {icon}
              </div>
              <p className="pt-2 text-sm font-medium text-white transition-all duration-300 group-hover:text-appYellow100 sm:text-base md:text-lg lg:text-xl">
                {title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default DashboardPage;
