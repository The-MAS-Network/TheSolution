import { editProfile } from "@/api/user.api";
import { appStateStore } from "@/stores/appState.store";
import { authStore } from "@/stores/auth.store";
import { convertSVGtoURL, generateRandomNumber } from "@/utilities";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { micah } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useStore } from "zustand";
import SpinnerIcon from "../icons/SpinnerIcon";

let avatars: string[] = [];

for (let i = 0; i < 100; i++) {
  const avatar = createAvatar(micah, {
    // ... options
    seed: generateRandomNumber(10, 20_000_000_000).toString(),
  });
  const svg = avatar.toString();
  if (svg.length < 9550) avatars.push(svg);
}

const ChangeAvatarModal = (): JSX.Element => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { closeActiveModal } = useStore(appStateStore);

  const editProfileAPI = useMutation({
    mutationFn: editProfile,
  });

  const { updateProfile } = useStore(authStore);

  const isLoading = editProfileAPI.isPending;

  const handleSubmit = async () => {
    if (selectedImage === null)
      return appToast.Error(
        "No image selected. click on the close button by the left to go back.",
      );

    const response = await editProfileAPI.mutateAsync({
      imageURL: avatars[selectedImage],
    });

    if (response.ok) {
      if (response.data) updateProfile(response.data.data);
      appToast.Success(response.data?.message ?? "Profile edit success.");
      closeActiveModal();
    } else handleApiErrors(response);
  };

  return (
    <div className="h-full max-h-[90vh] overflow-y-scroll rounded-3xl bg-red-600/10 p-5">
      <h2 className="mx-auto max-w-4xl py-5 text-center text-xl font-semibold text-white md:text-2xl lg:text-3xl">
        Choose an avatar from our diverse selection of over 50 random options.
        Once you've found the perfect one, simply click the 'update' button to
        make it yours!
      </h2>

      <div className="mx-auto flex max-w-7xl items-center justify-between pb-10 pt-7">
        <button
          disabled={isLoading}
          onClick={closeActiveModal}
          className="flex items-center gap-x-2 rounded-xl bg-red-500 px-3 py-2 text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95 md:text-lg lg:text-2xl"
        >
          <span>Close</span>
          <Icon className="text-white/80" icon="line-md:close-circle" />
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-x-2 rounded-xl bg-appBlue500 px-3 py-2 text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95 md:text-lg lg:text-2xl"
        >
          <span>Update</span>
          {isLoading ? (
            <SpinnerIcon />
          ) : (
            <Icon
              className="text-white/80"
              icon="line-md:circle-to-confirm-circle-transition"
            />
          )}
        </button>
      </div>
      <ul className="grid grid-cols-4 gap-9  sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9">
        {avatars.map((value, index) => (
          <li
            onClick={() => setSelectedImage(index)}
            className={`cursor-pointer rounded-full transition-all duration-300 ${selectedImage === index ? "bg-yellow-200" : "bg-transparent hover:bg-appBlue800 "}`}
            key={index}
          >
            <img
              className="w-full max-w-[10rem]"
              src={convertSVGtoURL(value)}
              alt="avatar"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChangeAvatarModal;
