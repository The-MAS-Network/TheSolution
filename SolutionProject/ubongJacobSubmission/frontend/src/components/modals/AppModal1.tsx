import { appStateStore } from "@/stores/appState.store";
import { useEffect } from "react";
import { useStore } from "zustand";

const AppModal1 = (): JSX.Element => {
  const { activeModal, closeActiveModal } = useStore(appStateStore);

  const modalOpen = activeModal?.modalType === "Type one";

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!modalOpen || keyCode !== 27 || !!activeModal?.shouldBackgroundClose)
        return;
      closeActiveModal();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <aside
      className={`fixed inset-0 z-[60] flex  items-center justify-center bg-appDarkBlue300/75 backdrop-blur-xl  backdrop-filter transition-all duration-200 ${
        modalOpen ? " translate-y-0 " : "translate-y-full"
      } `}
    >
      <div onClick={(e) => e?.stopPropagation()} className="p-5">
        {activeModal?.modalOneComponent}
      </div>
    </aside>
  );
};

export default AppModal1;
