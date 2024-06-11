import { Icon } from "@iconify/react/dist/iconify.js";

const AppLoader = ({
  isActive,
  isDeepBlur,
}: {
  isActive: boolean;
  isDeepBlur?: boolean;
}): JSX.Element => {
  return (
    <aside
      className={`fixed inset-0 z-[60] flex  items-center justify-center bg-appBlue130 ${isDeepBlur ? "backdrop-blur-xl" : "backdrop-blur-sm "} transition-all duration-200 ${
        isActive ? " translate-y-0 " : "translate-y-full"
      } `}
    >
      <div className="p-5">
        <Icon
          className="text-5xl md:text-6xl lg:text-7xl"
          icon="line-md:loading-twotone-loop"
        />
      </div>
    </aside>
  );
};

export default AppLoader;
