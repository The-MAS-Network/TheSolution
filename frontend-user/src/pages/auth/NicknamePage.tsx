import { Register } from "@/api/user.api";
import AppBackButton from "@/components/AppBackButton";
import AppInput from "@/components/forms/AppInput";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { ILocationParams, NickNamePageState } from "@/types";
import { NickNameRequest } from "@/types/api/auth.types";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useVisitIntendedRoute } from "@/utilities/visitIntendedRoute";
import { joiResolver } from "@hookform/resolvers/joi";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

interface ITranslate {
  whatIsYour: string;
  nickname: string;
  thisIsWhatOtherCommunityMemberSee: string;
  continue: string;
}

const values: ITranslate = {
  whatIsYour: "What is your",
  nickname: "Nickname?",
  thisIsWhatOtherCommunityMemberSee: "This is what other community member see.",
  continue: "CONTINUE",
};

const schema = Joi.object<NickNameRequest>({
  nickname: Joi.string().min(3).max(50).required(),
});

const NicknamePage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });

  const registerAPI = useMutation({ mutationFn: Register });
  const navigate = useNavigate();
  const isLoading = registerAPI.isPending;

  const {
    handleSubmit,
    register,
    resetField,
    formState: { errors },
  } = useForm<NickNameRequest>({
    resolver: joiResolver(schema),
  });

  const nickNamePageState = useLocation() as ILocationParams<NickNamePageState>;
  const { state } = nickNamePageState;

  const onSubmit = handleSubmit(async (data) => {
    const response = await registerAPI.mutateAsync({
      password: state.password,
      lightningAddress: state.lightningAddress,
      nickName: data.nickname,
    });
    if (response.ok) {
      appToast.Success(response.data?.message ?? "Registration Successful.");
      navigate(routes.LOGIN_PAGE, { replace: true });
    } else handleApiErrors(response);
  });

  const { isEffectDone } = useVisitIntendedRoute({
    condition: !state?.password || !state?.lightningAddress,
    otherParams: {
      customIntendedRoutes: [routes.REGISTER_PAGE],
      defaultRoute: routes.REGISTER_PAGE,
    },
  });

  if (!isEffectDone) {
    return <></>;
  }

  return (
    <div className="min-h-screen  items-center justify-center bg-appDarkBlue100 md:flex">
      <main className="app-container flex min-h-screen flex-col text-white md:min-h-max ">
        <header className="mb-11 pt-12">
          <AppBackButton />
        </header>

        {/* <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
          {translatedValues.whatIsYour} <br />{" "}
          <span className="lowercase">{translatedValues.nickname}</span>
        </h1> */}

        <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
          {translatedValues.whatIsYour} {" "}
          <span className="lowercase">{translatedValues.nickname}</span>
        </h1>

        <p className="pb-6 pt-3 text-sm font-normal sm:text-base">
          {translatedValues.thisIsWhatOtherCommunityMemberSee}
        </p>

        <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-y-2">
          <AppInput
            id="nickname"
            placeholder={translatedValues.nickname}
            errorMessage={errors?.nickname?.message ?? null}
            disabled={isLoading}
            hookFormProps={{ ...register("nickname") }}
            rightIcon={
              <button type="button" onClick={() => resetField("nickname")}>
                <Icon
                  className="text-xl sm:text-2xl"
                  icon="iconamoon:close-bold"
                />
              </button>
            }
          />
          <div className="flex flex-1 flex-col justify-end py-6 md:pt-12">
            <button
              disabled={isLoading}
              className="app-button-primary flex items-center justify-center gap-x-2"
            >
              {translatedValues.continue}

              {isLoading && <SpinnerIcon className="animate-spin" />}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NicknamePage;
