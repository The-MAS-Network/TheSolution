import {
  generatePaymentOTP,
  getAllTipGroupsKey,
  tipCommunity,
  tipSingleOrdinalUser,
} from "@/api/ordinals.api";
import SatsImage from "@/assets/images/sats-image.png";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { appStateStore } from "@/stores/appState.store";
import { CurrencyType } from "@/types/api/ordinals.types";
import { joiSchemas, pasteFromClipboard } from "@/utilities";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { joiResolver } from "@hookform/resolvers/joi";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Joi from "joi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import { EmojioneV1LightningMood } from "../icons";
import SpinnerIcon from "../icons/SpinnerIcon";
import { pageStateStore } from "@/stores/pageState.store";

interface MenuItem {
  icon: string;
  iconType: "icon" | "image";
  title: string;
  value: CurrencyType;
}

const menuItems: MenuItem[] = [
  {
    icon: SatsImage,
    title: "SATs",
    iconType: "image",
    value: "SATS",
  },
  // {
  //   icon: "cryptocurrency-color:btc",
  //   title: "BTC",
  //   iconType: "icon",
  //   value: "BTC",
  // },
  {
    icon: "cryptocurrency:usd",
    title: "USD",
    iconType: "icon",
    value: "USD",
  },
] as const;

type MenuTypes = (typeof menuItems)[number]["title"];

interface Props {
  isUserTip: boolean;
  collectionId: string;
  userLightningAddress: string;
}

const pageValues = [
  "Tip Community",
  "Tip User",
  "Give to a user who owns this ordinal",
  "Give to a community of users who own these ordinals",
  "Enter amount to tip community",
  "Enter amount to tip user",
  "SEND TIP",
  "SEND OTP",
  "Enter OTP sent to your e-mail",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

interface Schema {
  amount: number;
  otp: string;
}

const TipCommunityModal = ({
  isUserTip,
  collectionId,
  userLightningAddress,
}: Props): JSX.Element => {
  const [isVisible, setVisibility] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuTypes>("SATs");
  const seconds = 120; // value in seconds  which is equals to 2 minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  const { setSummaryPageState } = useStore(pageStateStore);

  const generatePaymentOTPAPI = useMutation({ mutationFn: generatePaymentOTP });
  const tipUserAPI = useMutation({
    mutationFn: tipSingleOrdinalUser,
  });
  const tipCommunityAPI = useMutation({
    mutationFn: tipCommunity,
  });
  const { closeActiveModal } = useStore(appStateStore);
  const queryClient = useQueryClient();

  const schema = Joi.object<Schema>({
    amount: Joi.number().min(1).max(1_000_000).required(),
    otp: !!isOTPSent ? joiSchemas.otp.required() : joiSchemas.otp.allow(""),
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<Schema>({
    resolver: joiResolver(schema),
  });

  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  const currentMenu = menuItems.find((value) => value?.title === activeMenu);

  const handleBlur = () => {
    setTimeout(() => {
      setVisibility(false);
    }, 300);
  };

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const secondsRemaining = timeLeft % 60;

  const tipUser = async (data: Schema) => {
    const response = await tipUserAPI.mutateAsync({
      amount: data?.amount,
      collectionId,
      lightningAddress: userLightningAddress,
      otp: data?.otp,
      currency: currentMenu?.value ?? "SATS",
    });
    if (response.ok) {
      queryClient.invalidateQueries({ queryKey: [getAllTipGroupsKey] });
      appToast.Success(response.data?.message ?? "Payment sent successfully.");
      closeActiveModal();
      navigate(routes.PAYMENTS_HISTORY_PAGE);
    } else handleApiErrors(response);
  };

  const tipCollection = async (data: Schema) => {
    const response = await tipCommunityAPI.mutateAsync({
      totalAmount: data?.amount,
      collectionId,
      otp: data?.otp,
      currency: currentMenu?.value ?? "SATS",
    });
    if (response.ok) {
      console.log(response?.data?.data);
      setSummaryPageState({ id: response?.data?.data?.id ?? "" });
      queryClient.invalidateQueries({ queryKey: [getAllTipGroupsKey] });
      appToast.Success(response.data?.message ?? "Payment sent successfully.");
      closeActiveModal();
      navigate(routes.PAYMENTS_SUMMARY_PAGE);
    } else handleApiErrors(response);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!isOTPSent) {
      return handleOTPSend();
    }

    if (data?.otp?.length !== 6) return appToast.Warning("Invalid OTP");

    if (!isUserTip) tipCollection(data);
    else tipUser(data);
  });

  const handlePaste = async () => {
    const clipboardValue = await pasteFromClipboard();
    setValue("otp", clipboardValue);
  };

  const handleOTPSend = async () => {
    if (!isOTPSent) setIsOTPSent(true);
    setTimeLeft(seconds);

    const response = await generatePaymentOTPAPI.mutateAsync({
      purpose: isUserTip ? "Tip user" : "Tip collection",
    });

    if (response.ok) {
      appToast.Success(response?.data?.message ?? "OTP sent successfully.");
    } else {
      setTimeLeft(0);
      handleApiErrors(response);
    }
  };

  const isGenerateOTPLoading = generatePaymentOTPAPI?.isPending;
  const isTipLoading = tipUserAPI?.isPending || tipCommunityAPI.isPending;

  const isLoading = isGenerateOTPLoading || isTipLoading;

  return (
    <section className="w-screen max-w-lg p-5">
      <form
        onSubmit={onSubmit}
        className=" flex w-full flex-col items-center rounded-3xl bg-appDarkBlue600 px-4 py-10 font-baloo2 text-white"
      >
        <h1 className="text-base font-semibold md:text-lg lg:text-xl">
          {isUserTip
            ? translatedValues?.["Tip User"]
            : translatedValues?.["Tip Community"]}
        </h1>
        <h2 className="mt-2 text-sm font-normal sm:text-base">
          {isUserTip
            ? translatedValues?.["Give to a user who owns this ordinal"]
            : translatedValues?.[
                "Give to a community of users who own these ordinals"
              ]}
        </h2>

        <div className="mb-2 mt-8  w-full">
          <label
            htmlFor="amount"
            className="flex w-full items-center gap-2 rounded-lg bg-appBlue110 px-1"
          >
            <EmojioneV1LightningMood className="flex-shrink-0 text-2xl text-appYellow100 " />
            <input
              type="text"
              id="amount"
              {...register("amount")}
              placeholder={
                isUserTip
                  ? translatedValues?.["Enter amount to tip user"]
                  : translatedValues?.["Enter amount to tip community"]
              }
              className="h-12 flex-1 bg-transparent text-sm font-normal outline-none  placeholder:text-appLight500 sm:text-base"
            />

            <div className="relative">
              <button
                onBlur={handleBlur}
                onClick={() => setVisibility((value) => !value)}
                className="flex items-center gap-2 rounded-md bg-appBlue140 p-2 text-sm"
                type="button"
              >
                <span>{currentMenu?.title}</span>
                {currentMenu?.iconType === "icon" && (
                  <Icon
                    className="text-xl sm:text-2xl"
                    icon={currentMenu?.icon}
                  />
                )}
                {currentMenu?.iconType === "image" && (
                  <img
                    alt="icon"
                    className="size-5 sm:size-6"
                    src={currentMenu?.icon}
                  />
                )}
              </button>
              <ul
                className={`absolute right-0 top-[100%] z-[3] flex w-max flex-col gap-3 rounded-xl bg-appDarkBlue100 p-2  transition-all  ${isVisible ? "scale-100" : "scale-0"}`}
              >
                {menuItems.map(({ icon, iconType, title }, key) => (
                  <li
                    onClick={() => setActiveMenu(title)}
                    className="flex w-screen max-w-44 cursor-pointer items-center justify-center gap-2  rounded-md bg-appBlue140 p-1 text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95 sm:text-base"
                    key={key}
                  >
                    <span>{title}</span>
                    {iconType === "icon" && (
                      <Icon className="text-xl sm:text-2xl" icon={icon} />
                    )}
                    {iconType === "image" && (
                      <img alt="icon" className="size-5 sm:size-6" src={icon} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </label>

          <p
            className={`mt-1 p-1 font-baloo2 text-sm font-medium  tracking-wider text-appYellow100 first-letter:uppercase`}
          >
            {errors?.amount?.message?.split('"')?.join("")}
          </p>
        </div>

        <div
          className={` app-collapse w-full  ${
            isOTPSent ? " app-collapse-open " : "app-collapse-close"
          }`}
        >
          <div className="w-full overflow-hidden">
            <label
              htmlFor="otp"
              className="flex w-full items-center gap-2 rounded-lg bg-appBlue110 px-1"
            >
              <button
                onClick={handlePaste}
                disabled={isLoading}
                type="button"
                className="flex items-center gap-2  rounded-md bg-appBlue140 p-2 text-sm transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Icon
                  icon="line-md:clipboard-list-twotone"
                  className="flex-shrink-0 text-xl text-white sm:text-2xl "
                />
              </button>
              <input
                type="text"
                id="otp"
                autoComplete="one-time-code"
                {...register("otp")}
                placeholder={
                  translatedValues?.["Enter OTP sent to your e-mail"]
                }
                className="h-12 flex-1 bg-transparent text-sm font-normal outline-none  placeholder:text-appLight500 sm:text-base"
              />

              <div className="relative">
                <button
                  onClick={handleOTPSend}
                  disabled={isLoading || timeLeft > 0}
                  className="flex items-center gap-1 rounded-md bg-appBlue140 p-2 text-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                >
                  {timeLeft > 0 ? (
                    <span>
                      {`${minutes} : ${
                        secondsRemaining < 10
                          ? `0 ${secondsRemaining}`
                          : `${secondsRemaining}`
                      }`}
                    </span>
                  ) : (
                    <span>Resend</span>
                  )}
                  <Icon className="text-xl" icon="mdi:email-resend-outline" />
                </button>
              </div>
            </label>

            <p
              className={`mt-1 p-1 font-baloo2 text-sm font-medium  tracking-wider text-appYellow100 first-letter:uppercase`}
            >
              {errors?.otp?.message?.split('"')?.join("")}
            </p>
          </div>
        </div>
        <button
          disabled={isLoading}
          type="submit"
          className="app-button-primary mt-6 flex items-center justify-center gap-2 "
        >
          {!isOTPSent
            ? translatedValues?.["SEND OTP"]
            : translatedValues?.["SEND TIP"]}
          {isLoading && <SpinnerIcon className="animate-spin" />}
        </button>
      </form>
    </section>
  );
};

export default TipCommunityModal;
