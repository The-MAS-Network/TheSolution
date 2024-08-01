import { useAppStateStore } from "@/stores/appState.store";
import { useEffect } from "react";
import AppPromptModal from "./AppPromptModal";

const AppModal1 = (): JSX.Element => {
  const { activeModal, closeActiveModal, isAppModalLoading } =
    useAppStateStore();

  const modalOpen = !!activeModal?.modalType;
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (
        !modalOpen ||
        keyCode !== 27 ||
        !activeModal?.shouldBackgroundClose ||
        !isAppModalLoading
      )
        return;
      closeActiveModal();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const handleBackgroundClose = () => {
    !!activeModal?.shouldBackgroundClose && closeActiveModal();
  };

  return (
    <aside
      onClick={handleBackgroundClose}
      className={`bg-appLight400 fixed inset-0 z-[60]  flex items-center justify-center backdrop-blur-[2px] transition-all duration-200 ${
        modalOpen ? " translate-y-0 " : "translate-y-full"
      } `}
    >
      <div onClick={(e) => e?.stopPropagation()} className="p-5">
        {activeModal?.modalType === "EMPTY_MODAL" &&
          activeModal?.emptyModalComponent}

        {activeModal?.modalType === "PROMPT_MODAL" &&
          !!activeModal?.promptModal && (
            <AppPromptModal {...activeModal?.promptModal} />
          )}
      </div>
    </aside>
  );
};

export default AppModal1;
