import { useAppStateStore } from "@/stores/appState.store";
import SpinnerIcon from "../icons/SpinnerIcon";
// import {
//   CustomSpinerIcon,
//   RiCheckboxCircleFill,
//   RiCloseCircleFill,
//   RiDeleteBinFill,
//   RiQuestionFill,
// } from "../icons";
// import SpinnerIcon from "../icons/SpinnerIcon";

export interface AppPromptModalProps {
  type: PromptModalType;
  title: string;
  description: string;
  noButtonTitle: string;
  yesButtonTitle: string;
  onNoButtonClick?: () => void;
  onYesButtonClick?: () => void;
  excerpt?: string;
}

export type PromptModalType = "SUCCESS" | "DANGER" | "INFO" | "DELETE";

// interface Variant {
//   textColor: string;
//   icon: JSX.Element;
//   shadow: string;
//   iconBg: string;
//   buttonBg: string;
// }

// const variant: Record<PromptModalType, Variant> = {
//   DANGER: {
//     icon: <RiCloseCircleFill />,
//     textColor: "text-appRed100",
//     shadow: "shadow-declineButton",
//     iconBg: "bg-appRed300",
//     buttonBg: "bg-appRed100",
//   },
//   DELETE: {
//     icon: <RiDeleteBinFill />,
//     textColor: "text-appRed100",
//     shadow: "shadow-declineButton",
//     iconBg: "bg-appRed300",
//     buttonBg: "bg-appRed100",
//   },
//   SUCCESS: {
//     icon: <RiCheckboxCircleFill />,
//     shadow: "shadow-successButton",
//     textColor: "text-appGreen200",
//     iconBg: "bg-appGreen300",
//     buttonBg: "bg-appGreen200",
//   },
//   INFO: {
//     buttonBg: "bg-appBlue200",
//     icon: <RiQuestionFill />,
//     iconBg: "bg-white/90",
//     shadow: "shadow-appButton",
//     textColor: "text-appBlue100",
//   },
// };

export interface AppPromptModalProps {
  type: PromptModalType;
  title: string;
  description: string;
  noButtonTitle: string;
  yesButtonTitle: string;
  onNoButtonClick?: () => void;
  onYesButtonClick?: () => void;
  excerpt?: string;
}

const AppPromptModal = (props: AppPromptModalProps) => {
  const {
    // type,
    description,
    onNoButtonClick,
    title,
    noButtonTitle,
    onYesButtonClick,
    yesButtonTitle,
    excerpt,
  } = props;

  // const { icon, shadow, textColor, iconBg, buttonBg } = variant?.[type];
  const { closeActiveModal, isAppModalLoading } = useAppStateStore();

  const handleDecline = () => {
    if (!!onNoButtonClick) onNoButtonClick?.();
    else closeActiveModal();
  };

  return (
    <>
      <div
        onClick={(e) => e?.stopPropagation()}
        className={`flex w-full  flex-col items-center justify-center rounded-3xl bg-appDarkBlue600 px-12 pb-7 pt-6 text-white ${true ? "aspect-square" : ""}`}
      >
        <p className="max-w-[15.875rem] text-center text-lg">{title}</p>
        <p className="mt-5 max-w-[15.875rem] text-center text-lg">
          {description}
        </p>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            disabled={isAppModalLoading}
            onClick={handleDecline}
            className="flex items-center justify-center gap-2 rounded-full border border-white px-4 py-2 text-base font-bold text-white transition-all duration-300  hover:border-appDarkBlue100 hover:bg-white hover:text-appDarkBlue100 disabled:hidden sm:text-lg"
            type="button"
          >
            {noButtonTitle ?? "NO, CANCEL"}
          </button>
          <button
            disabled={isAppModalLoading}
            onClick={onYesButtonClick}
            className="flex items-center justify-center gap-2  rounded-full border border-appRed100 px-4 py-2 text-base font-bold text-appRed100 transition-all duration-300 hover:border-red-500  hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
            type="button"
          >
            <p>{yesButtonTitle ?? "YES, CONFIRM"}</p>
            {isAppModalLoading && <SpinnerIcon className="animate-spin" />}
          </button>
        </div>

        {!!excerpt && (
          <p className="pb-2 text-center text-xs text-appGray100">{excerpt}</p>
        )}
      </div>
      {/* <div
        onClick={(e) => e?.stopPropagation()}
        className=" !z-[60001] w-full max-w-96 rounded-lg bg-appDarkBlue100 px-2 text-white"
      >
        <section className="flex flex-col items-center justify-center px-3 py-6">
          <span
            className={`${iconBg} ${textColor} rounded-full p-3 text-2xl sm:text-3xl`}
          >
            {icon}
          </span>

          <p className="mb-2 mt-6 text-center text-sm font-semibold sm:text-base">
            {title}
          </p>
          <p className="mx-auto max-w-72 text-center font-medium text-white/90">
            {description}
          </p>
        </section>

        <footer className="border-appLightGray200 flex items-center justify-between gap-4 border-t border-t-white/50 px-3 py-5">
          <button
            disabled={isAppModalLoading}
            onClick={handleDecline}
            className="w-full rounded-lg border border-white/80 p-3 text-center font-medium transition-all duration-300 hover:scale-105 hover:border-transparent hover:bg-appRed600 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
          >
            {noButtonTitle}
          </button>
          <button
            disabled={isAppModalLoading}
            onClick={onYesButtonClick}
            className={`${shadow} ${buttonBg} flex w-full items-center justify-center rounded-lg border border-transparent p-3 text-center font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50`}
            type="button"
          >
            {isAppModalLoading ? (
              <CustomSpinerIcon className="animate-spin text-xl text-white" />
            ) : (
              yesButtonTitle
            )}
          </button>
        </footer>
        {!!excerpt && (
          <p className="pb-2 text-center text-xs text-appGray100">{excerpt}</p>
        )}
      </div> */}
    </>
  );
};
export default AppPromptModal;
