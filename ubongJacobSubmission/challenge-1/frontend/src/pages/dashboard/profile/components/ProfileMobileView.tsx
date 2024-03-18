import routes from "@/navigation/routes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import ProfileBackButton from "./ProfileBackButton";
import ProfileDetails from "./ProfileDetails";
import ProfileImage from "@/assets/images/profile.png";
import { authStore } from "@/stores/auth.store";
import { useStore } from "zustand";
import { convertSVGtoURL } from "@/utilities";

const ProfileMobileView = (): JSX.Element => {
  const { loginResponse } = useStore(authStore);

  const getProfileImage = () => {
    const loginImage = loginResponse?.data?.imageURL;
    if (loginImage?.startsWith("<svg")) return convertSVGtoURL(loginImage);
    else return ProfileImage;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative px-6 pt-10 text-white">
        <ProfileBackButton />
        <div className="relative">
          <Link
            to={routes.EDIT_PROFILE_PAGE}
            className=" absolute right-0 top-0 block rounded-xl p-3 transition-all duration-300 hover:text-appYellow100"
          >
            <Icon className="text-xl md:text-2xl lg:text-3xl" icon="uil:edit" />
          </Link>
        </div>
        <img
          src={getProfileImage()}
          className="mx-auto aspect-square w-40 object-contain"
          alt={loginResponse?.data?.nickName}
        />
      </header>

      <main className="flex flex-1 flex-col bg-appDarkBlue100 px-6 pt-8 text-white">
        <ProfileDetails />
      </main>
    </div>
  );
};

export default ProfileMobileView;
