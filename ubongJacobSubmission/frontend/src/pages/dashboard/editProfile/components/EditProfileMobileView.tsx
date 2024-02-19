import ProfileBackButton from "../../profile/components/ProfileBackButton";
import EditProfileDetails from "./EditProfileDetails";

const EditProfileMobileView = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col bg-appDarkBlue100 px-6 pt-8 text-white">
        <div className="pt-4">
          <ProfileBackButton />
        </div>
        <EditProfileDetails />
      </main>
    </div>
  );
};

export default EditProfileMobileView;
