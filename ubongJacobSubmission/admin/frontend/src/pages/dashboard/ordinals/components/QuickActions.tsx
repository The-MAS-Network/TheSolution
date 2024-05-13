import { appStateStore } from "@/stores/appState.store";
import { QuickActionOption } from "@/types";
import { Icon } from "@iconify/react";
import { useStore } from "zustand";

interface Props {
  options: QuickActionOption[];
  isParentActive?: boolean;
}

const QuickActions = ({ options, isParentActive }: Props): JSX.Element => {
  const { activeQuickAction, setActiveQuickAction } = useStore(appStateStore);

  const isActive = activeQuickAction === "Type one";

  const handleToggle = () => {
    if (!isActive) setActiveQuickAction("Type one");
    else setActiveQuickAction(null);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`-z-[1] text-3xl transition-all duration-300 ${isParentActive ? "hover:text-appBlue120" : "hover:text-appYellow100"} `}
        type="button"
      >
        <Icon icon="mi:options-vertical" />
      </button>

      <ul
        className={`absolute -left-[450%] top-[70%] z-[3] flex w-max flex-col gap-3 rounded-xl bg-appDarkBlue100 p-2  transition-all  ${isActive ? "scale-100" : "scale-0"}`}
      >
        {options.map(
          ({ icon, onClick, title, shouldBackgroundNotClose }, key) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => {
                  onClick();
                  if (!shouldBackgroundNotClose) setActiveQuickAction(null);
                }}
                className="flex  items-center gap-2 p-2 text-sm font-normal  transition-all duration-300 hover:text-appYellow100 sm:text-base"
              >
                {!!icon && (
                  <Icon
                    className="flex-shrink-0 text-xl sm:text-2xl"
                    icon={icon}
                  />
                )}
                <span className="flex-shrink-0">{title}</span>
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default QuickActions;
