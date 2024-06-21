import LeaderBoardIcon from "@/components/icons/LeaderBoardIcon";
import OrdinalIcon from "@/components/icons/OrdinalIcon";
import routes from "@/navigation/routes";
import { appStateStore } from "@/stores/appState.store";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import KYW from "./components/KYW";
import { authStore } from "@/stores/auth.store";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useGetProfile } from "@/hooks/useGetRequests";

interface Nav {
  title: string;
  icon: string | JSX.Element;
  onClick: () => void;
}

const pageValues = ["Leaderboard", "Ordinals", "Profile"] as const;

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

  const navigate = useNavigate();
  const { setActiveModal } = useStore(appStateStore);
  const { loginResponse } = useStore(authStore);
  const isVerified = !!loginResponse?.data?.isVerified;

  useGetProfile();

  const handleOrdinalClick = () => {
    if (!isVerified) {
      setActiveModal({
        modalType: "Type two",
        shouldBackgroundClose: true,
        modalChildComponent: <KYW />,
      });
    } else {
      navigate(routes.ORDINALS_PAGE);
    }
  };

  const navs: Nav[] = [
    {
      title: translatedValues?.Leaderboard,
      icon: <LeaderBoardIcon className="text-4xl sm:text-5xl" />,
      onClick: () => navigate(routes.LEADERBOARD_PAGE),
    },

    {
      title: translatedValues?.Ordinals,
      icon: <OrdinalIcon className="text-3xl sm:text-4xl" />,
      onClick: handleOrdinalClick,
    },

    {
      title: translatedValues?.Profile,
      icon: (
        <Icon
          className=" text-4xl text-white sm:text-5xl"
          icon="iconamoon:profile-fill"
        />
      ),
      onClick: () => navigate(routes.PROFILE_PAGE),
    },
  ] as const;

  return (
    <main className="app-container-lg h-full min-h-screen flex-col items-center justify-center md:flex">
      <ul className="grid w-full grid-cols-3 gap-x-5 pt-12 sm:gap-x-10 md:gap-x-20 lg:gap-x-24">
        {navs.map(({ icon, title, onClick }, index) => (
          <li
            onClick={onClick}
            className="group relative flex  aspect-square w-full max-w-[10rem] cursor-pointer flex-col items-center justify-center"
            key={index}
          >
            {title === translatedValues?.Ordinals && !isVerified && (
              <Icon
                className=" absolute bottom-10 right-0 z-[5] text-3xl md:text-4xl lg:text-5xl"
                icon="twemoji:locked"
              />
            )}

            <div className="dashboard-card-bg flex aspect-square w-full items-center justify-center rounded-3xl transition-all duration-300 active:scale-100 group-hover:scale-105">
              {icon}
            </div>
            <p className="pt-2 text-center text-sm font-medium text-white transition-all duration-300 group-hover:text-appYellow100 sm:text-base md:text-lg lg:text-xl">
              {title}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default DashboardPage;
