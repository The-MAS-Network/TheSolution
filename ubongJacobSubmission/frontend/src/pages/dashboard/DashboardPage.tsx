import EarnSatsIcon from "@/components/icons/EarnSatsIcon";
import OrdinalIcon from "@/components/icons/OrdinalIcon";
import routes from "@/navigation/routes";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const navs = [
  {
    title: "Earn SATs",
    icon: <EarnSatsIcon className="text-3xl md:text-4xl lg:text-5xl" />,
    route: "",
  },

  {
    title: "Leaderboard",
    icon: (
      <Icon
        className="text-3xl text-white  transition-all duration-[50000ms] hover:text-green-600 hover:brightness-200 md:text-4xl lg:text-5xl"
        icon="iconoir:leaderboard-star"
      />
    ),
    route: "",
  },

  {
    title: "Ordinals",
    icon: <OrdinalIcon className="text-3xl md:text-4xl lg:text-5xl" />,
    route: "",
  },

  {
    title: "Profile",
    icon: (
      <Icon
        className="text-2xl text-white sm:text-3xl  md:text-4xl lg:text-5xl"
        icon="iconamoon:profile-fill"
      />
    ),
    route: routes.PROFILE_PAGE,
  },
];

const DashboardPage = (): JSX.Element => {
  return (
    <div className=" bg-appBlue100">
      <main className="app-container-lg h-full min-h-screen flex-col items-center justify-center md:flex">
        <ul className="grid w-full grid-cols-4 gap-x-5 pt-12 sm:gap-x-10 md:gap-x-20 lg:gap-x-24">
          {navs.map(({ icon, title, route }, index) => (
            <li
              className="group flex aspect-square w-full flex-col items-center justify-center"
              key={index}
            >
              <Link
                to={route}
                className="group flex aspect-square w-full flex-col items-center justify-center"
              >
                <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-gradient-to-br from-appBlue600/50 to-appBlue700 transition-all duration-300 active:scale-100 group-hover:scale-105">
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
    </div>
  );
};

export default DashboardPage;
