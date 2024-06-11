import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { Link, Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

const pageValues = ["Weekly", "All Time", "Leaderboard"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const LeaderboardPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const navs = [
    {
      title: translatedValues?.Weekly,
      route: routes.LEADERBOARD_PAGE,
    },
    {
      title: translatedValues?.["All Time"],
      route: routes.LEADERBOARD_ALL_TIME_PAGE,
    },
  ];

  const currentPath = useLocation()?.pathname;

  return (
    <div className=" flex min-h-screen flex-col items-center bg-appDarkBlue100 px-6 pt-12 font-baloo2 sm:bg-appBlue100 md:px-0">
      <main className="w-full max-w-lg text-white">
        <DashboardHeader title={translatedValues?.Leaderboard} />

        <nav className="my-5 flex w-full items-center gap-2">
          {navs.map(({ route, title }, key) => (
            <Link
              className={`app-button-secondary  text-center hover:!scale-100 ${currentPath === route ? "!bg-appYellow900" : ""}`}
              to={route}
              key={key}
              replace
            >
              {title}
            </Link>
          ))}
        </nav>
        <Outlet />
      </main>
    </div>
  );
};

export default LeaderboardPage;
