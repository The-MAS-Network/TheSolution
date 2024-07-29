import ProfileImage from "@/assets/images/profile.png";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import ProfileBackButton from "../../profile/components/ProfileBackButton";
import EditProfileDetails from "./EditProfileDetails";
import { authStore } from "@/stores/auth.store";
import { convertSVGtoURL } from "@/utilities";
import { useStore } from "zustand";

interface ITranslate {
  editProfile: string;
}

const values: ITranslate = {
  editProfile: "Edit Profile",
};

const EditProfileDesktopView = (): JSX.Element => {
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
          {translatedValues.editProfile}
        </p>
      </header>

      <img
        className="mx-auto aspect-square  w-full max-w-[7rem] rounded-full bg-appBlue100 object-contain"
        src={getProfileImage()}
        alt={loginResponse?.data?.nickName}
      />

      <EditProfileDetails />
    </main>
  );
};

export default EditProfileDesktopView;
