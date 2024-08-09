import { deleteAccount } from "@/api/user.api";
import AppInput from "@/components/forms/AppInput";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { authStore } from "@/stores/auth.store";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { joiResolver } from "@hookform/resolvers/joi";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import Joi from "joi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";

const pageValues = [
  "DELETE ACCOUNT",
  "Deleting your account will remove all of your information from our database. This cannot be undone.",
  "NO, KEEP ACCOUNT",
  "Password",
  "YES, DELETE ACCOUNT",
  "Enter your Password"
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

interface Schema {
  password: string;
}

const schema = Joi.object<Schema>({
  password: Joi.string().min(8).max(255).required(),
});

const DeleteAccountPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const deleteAccountAPI = useMutation({ mutationFn: deleteAccount });
  const navigate = useNavigate();
  const { logout } = useStore(authStore);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Schema>({
    resolver: joiResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const response = await deleteAccountAPI.mutateAsync({
      password: data?.password,
    });
    if (response.ok) {
      appToast.Success(
        response.data?.message ?? "Account deleted Successfully.",
      );
      logout();
    } else handleApiErrors(response);
  });

  const isLoading = deleteAccountAPI?.isPending;

  return (
    <div className=" flex min-h-screen items-center justify-center bg-appDarkBlue100 px-6 font-baloo2 sm:bg-appBlue100 md:px-0">
      <main className="w-full max-w-lg rounded-3xl text-white sm:bg-appBlue800">
        <form
          className="mx-auto flex flex-col items-center py-7 sm:max-w-[24.5rem]"
          onSubmit={onSubmit}
        >
          <Icon
            icon="fluent:person-warning-24-regular"
            className="text-7xl text-appRed600"
          />
          <h1 className="mb-2 mt-7  text-lg font-semibold sm:text-xl">
            {translatedValues?.["DELETE ACCOUNT"]}
          </h1>
          <h2 className="text-left text-sm font-normal sm:text-base">
            {
              translatedValues?.[
                "Deleting your account will remove all of your information from our database. This cannot be undone."
              ]
            }
          </h2>

          <div className="mt-8 w-full">
            <AppInput
              id="password"
              placeholder={translatedValues?.["Enter your Password"]}
              errorMessage={errors?.password?.message ?? null}
              disabled={isLoading}
              hookFormProps={{ ...register("password") }}
              autoComplete="password"
              type={isPasswordVisible ? "text" : "password"}
              leftIcon={
                <Icon
                  icon="mdi:password-outline"
                  className="text-xl text-appGray200 sm:text-2xl"
                />
              }
              rightIcon={
                <button
                  className="text-xl text-appGray200 sm:text-2xl"
                  onClick={() => setPasswordVisibility((value) => !value)}
                  type="button"
                >
                  {isPasswordVisible ? (
                    <Icon key={1} icon="line-md:watch" />
                  ) : (
                    <Icon key={2} icon="line-md:watch-off" />
                  )}
                </button>
              }
            />
          </div>
          <footer className="mt-8 flex w-full justify-between gap-5">
            <button
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="flex-1 rounded-full border border-white p-3 font-baloo2 text-sm transition-all duration-300 hover:bg-white hover:text-appBlue800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base font-bold"
              type="button"
            >
              {translatedValues?.["NO, KEEP ACCOUNT"]}
            </button>
            <button
              disabled={isLoading}
              className="flex flex-1 items-center justify-center rounded-full border border-appRed600 p-3 font-baloo2 text-sm text-appRed600 transition-all duration-300 hover:bg-appRed600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-base font-bold"
              type="submit"
            >
              {isLoading ? (
                <SpinnerIcon className="animate-spin" />
              ) : (
                translatedValues?.["YES, DELETE ACCOUNT"]
              )}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
};

export default DeleteAccountPage;
