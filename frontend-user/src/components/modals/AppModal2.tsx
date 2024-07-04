import { appStateStore } from "@/stores/appState.store";
import { useEffect } from "react";
import { useStore } from "zustand";

const AppModal2 = (): JSX.Element => {
  const { activeModal, closeActiveModal } = useStore(appStateStore);

  const modalOpen = activeModal?.modalType === "Type two";

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
      onClick={() => {
        if (activeModal?.shouldBackgroundClose) closeActiveModal();
      }}
      className={`fixed inset-0 z-[60] flex  items-center justify-center bg-appBlue130 backdrop-blur-[1px] transition-all duration-200 ${
        modalOpen ? " translate-y-0 " : "translate-y-full"
      } `}
    >
      <div onClick={(e) => e?.stopPropagation()} className="p-5">
        {activeModal?.modalChildComponent}
      </div>
    </aside>
  );
};

export default AppModal2;
