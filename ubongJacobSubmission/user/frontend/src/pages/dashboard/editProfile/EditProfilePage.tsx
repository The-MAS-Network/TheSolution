import EditProfileDesktopView from "./components/EditProfileDesktopView";
import EditProfileMobileView from "./components/EditProfileMobileView";

const EditProfilePage = (): JSX.Element => {
  return (
    <div className=" min-h-screen flex-col items-center justify-center bg-appBlue100 sm:flex">
      <div className="w-full sm:hidden">
        <EditProfileMobileView />
      </div>
      <div className="hidden w-full  sm:block">
        <EditProfileDesktopView />
      </div>
    </div>
  );
};

export default EditProfilePage;
