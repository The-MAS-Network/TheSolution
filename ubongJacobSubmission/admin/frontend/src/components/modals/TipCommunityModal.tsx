import SatsImage from "@/assets/images/sats-image.png";
import { Icon } from "@iconify/react";
import { useState } from "react";

interface MenuItem {
  icon: string;
  iconType: "icon" | "image";
  title: string;
}

const menuItems: MenuItem[] = [
  {
    icon: SatsImage,
    title: "SATs",
    iconType: "image",
  },
  {
    icon: "cryptocurrency-color:btc",
    title: "BTC",
    iconType: "icon",
  },
  {
    icon: "cryptocurrency:usd",
    title: "USD",
    iconType: "icon",
  },
] as const;

type MenuTypes = (typeof menuItems)[number]["title"];

const TipCommunityModal = (): JSX.Element => {
  const [isVisible, setVisibility] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuTypes>("BTC");

  const currentMenu = menuItems.find((value) => value?.title === activeMenu);

  const handleBlur = () => {
    setTimeout(() => {
      setVisibility(false);
    }, 300);
  };

  return (
    <section className="w-screen max-w-lg p-5">
      <div className=" flex w-full flex-col items-center rounded-3xl bg-appDarkBlue600 px-4 py-10 font-baloo2 text-white">
        <h1 className="text-base font-semibold md:text-lg lg:text-xl">
          Tip Community
        </h1>
        <h2 className="mt-2 text-sm font-normal sm:text-base">
          Tips shared out among community
        </h2>

        <label
          htmlFor="amount"
          className="my-8 flex w-full items-center gap-2 rounded-lg bg-appBlue110 px-1"
        >
          <Icon
            icon="emojione-v1:lightning-mood"
            className="flex-shrink-0 text-2xl text-appYellow100 "
          />
          <input
            type="text"
            name="amount"
            id="amount"
            placeholder="Enter amount to tip community"
            className="h-12 flex-1 bg-transparent text-sm font-normal outline-none  placeholder:text-appLight500 sm:text-base"
          />

          <div className="relative">
            <button
              onBlur={handleBlur}
              onClick={() => setVisibility((value) => !value)}
              className="flex items-center gap-2 rounded-md bg-appBlue140 p-2 text-sm"
              type="button"
            >
              <span>{currentMenu?.title}</span>
              {currentMenu?.iconType === "icon" && (
                <Icon
                  className="text-xl sm:text-2xl"
                  icon={currentMenu?.icon}
                />
              )}
              {currentMenu?.iconType === "image" && (
                <img
                  alt="icon"
                  className="size-5 sm:size-6"
                  src={currentMenu?.icon}
                />
              )}
            </button>
            <ul
              className={`absolute right-0 top-[100%] z-[3] flex w-max flex-col gap-3 rounded-xl bg-appDarkBlue100 p-2  transition-all  ${isVisible ? "scale-100" : "scale-0"}`}
            >
              {menuItems.map(({ icon, iconType, title }, key) => (
                <li
                  onClick={() => setActiveMenu(title)}
                  className="flex w-screen max-w-44 cursor-pointer items-center justify-center gap-2  rounded-md bg-appBlue140 p-1 text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95 sm:text-base"
                  key={key}
                >
                  <span>{title}</span>
                  {iconType === "icon" && (
                    <Icon className="text-xl sm:text-2xl" icon={icon} />
                  )}
                  {iconType === "image" && (
                    <img alt="icon" className="size-5 sm:size-6" src={icon} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </label>

        <button type="submit" className="app-button-primary ">
          SEND TIP
        </button>
      </div>
    </section>
  );
};

export default TipCommunityModal;
