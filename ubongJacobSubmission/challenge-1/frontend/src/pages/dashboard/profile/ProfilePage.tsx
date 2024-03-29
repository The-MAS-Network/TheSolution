import ProfileDesktopView from "./components/ProfileDesktopView";
import ProfileMobileView from "./components/ProfileMobileView";

const ProfilePage = (): JSX.Element => {
  return (
    <div className=" min-h-screen flex-col items-center justify-center bg-appBlue100 sm:flex">
      <div className="w-full sm:hidden">
        <ProfileMobileView />
      </div>
      <div className="hidden w-full  sm:block">
        <ProfileDesktopView />
      </div>
    </div>
  );
};

export default ProfilePage;
