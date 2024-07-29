import { Icon } from "@iconify/react";

import ProfileImage from "@/assets/images/profile.png";
import ProfileDetails from "./ProfileDetails";
import { Link } from "react-router-dom";
import routes from "@/navigation/routes";
import ProfileBackButton from "./ProfileBackButton";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { authStore } from "@/stores/auth.store";
import { useStore } from "zustand";
import { convertSVGtoURL } from "@/utilities";

interface ITranslate {
  profile: string;
}

const values: ITranslate = {
  profile: "Profile",
};

const ProfileDesktopView = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });

  const { loginResponse } = useStore(authStore);

  const getProfileImage = () => {
    const loginImage = loginResponse?.data?.imageURL;
    if (loginImage?.startsWith("<svg")) return convertSVGtoURL(loginImage);
    else return ProfileImage;
  };

  return (
    <main className="mx-auto w-full max-w-[31.813rem] rounded-2xl bg-appBlue800 px-8 py-4 font-baloo2 text-white ">
      <header className="relative flex items-center justify-between py-5">
        <ProfileBackButton />

        <p className="flex-1 text-center font-baloo2 text-base font-bold md:text-lg lg:text-xl">
          {translatedValues.profile}
        </p>
        <Link
          to={routes.EDIT_PROFILE_PAGE}
          className="absolute right-0 rounded-xl bg-appBlue100 p-3 transition-all duration-300 hover:text-appYellow100"
        >
          <Icon className="text-xl md:text-2xl lg:text-3xl" icon="uil:edit" />
        </Link>
      </header>

      <img
        className="mx-auto aspect-square  w-full max-w-[7rem] rounded-full bg-appBlue100 object-contain"
        src={getProfileImage()}
        alt={loginResponse?.data?.nickName}
      />

      <ProfileDetails />
    </main>
  );
};

export default ProfileDesktopView;
