import { editProfile } from "@/api/user.api";
import ProfileImage from "@/assets/images/profile.png";
import ErrorMessage from "@/components/ErrorMessage";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import ChangeAvatarModal from "@/components/modals/ChangeAvatarModal";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { appStateStore } from "@/stores/appState.store";
import { authStore } from "@/stores/auth.store";
import { convertSVGtoURL } from "@/utilities";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation } from "@tanstack/react-query";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { useStore } from "zustand";

interface ITranslate {
  nickName: string;
  changeAvatar: string;
  updateProfile: string;
  lightningAddress: string;
}

const values: ITranslate = {
  lightningAddress: "Lightning Address",
  nickName: "Nickname",
  updateProfile: "UPDATE PROFILE",
  changeAvatar: "CHANGE AVATAR",
};

interface Schema {
  nickname: string;
}

const schema = Joi.object<Schema>({
  nickname: Joi.string().min(5).max(255).required(),
});

const EditProfileDetails = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });
  const { loginResponse, updateProfile } = useStore(authStore);

  const { setActiveModal } = useStore(appStateStore);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Schema>({
    resolver: joiResolver(schema),
    defaultValues: { nickname: loginResponse?.data?.nickName },
  });

  const editProfileAPI = useMutation({
    mutationFn: editProfile,
  });

  const isLoading = editProfileAPI.isPending;

  const onSubmit = handleSubmit(async (data) => {
    const response = await editProfileAPI.mutateAsync({
      nickName: data.nickname,
    });

    if (response.ok) {
      if (response.data) updateProfile(response.data.data);
      appToast.Success(response.data?.message ?? "Profile edit success.");
    } else appToast.Error(handleApiErrors(response));
  });

  const getProfileImage = () => {
    const loginImage = loginResponse?.data?.imageURL;
    if (loginImage?.startsWith("<svg")) return convertSVGtoURL(loginImage);
    else return ProfileImage;
  };

  return (
    <>
      <div className="pt-14 sm:hidden">
        <div>
          <img
            src={getProfileImage()}
            className="mx-auto aspect-square w-40 rounded-full object-contain"
            alt={loginResponse?.data?.nickName}
          />
        </div>
      </div>
      <div className="flex items-center pt-2">
        <button
          type="button"
          onClick={() =>
            setActiveModal({
              modalType: "Type one",
              modalOneComponent: <ChangeAvatarModal />,
            })
          }
          className="mx-auto w-full max-w-[12.25rem] rounded-2xl bg-appGreen300 p-2 shadow-appButtonInnerShadow"
        >
          {translatedValues.changeAvatar}
        </button>
      </div>

      <label className="mb-2 mt-7 block text-sm text-appGray400 sm:text-base">
        {translatedValues.nickName}
      </label>

      <form onSubmit={onSubmit}>
        <div>
          <input
            {...register("nickname")}
            type="text"
            className="w-full rounded-2xl bg-white p-4 text-base text-appBlue100 outline-0"
            placeholder="Enter your nickname"
          />
          <ErrorMessage message={errors?.nickname?.message} />
        </div>
        <label className="mb-2 mt-5 block text-sm text-appGray400 sm:text-base">
          {translatedValues.lightningAddress}
        </label>
        <div className="rounded-2xl bg-appGray600 px-4 py-4 text-sm font-normal text-appGray500 sm:text-base">
          {loginResponse?.data?.lightningAddress}
        </div>

        <button
          type="submit"
          className="app-button-primary mt-8 flex items-center justify-center gap-x-2 sm:mb-10"
        >
          {translatedValues.updateProfile}

          {isLoading && <SpinnerIcon className="animate-spin" />}
        </button>
      </form>
    </>
  );
};

export default EditProfileDetails;
