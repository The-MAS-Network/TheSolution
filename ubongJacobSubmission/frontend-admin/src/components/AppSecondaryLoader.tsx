import SpinnerIcon from "./icons/SpinnerIcon";

const AppSecondaryLoader = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-28 text-white">
      <SpinnerIcon className="animate-spin text-4xl md:text-5xl lg:text-6xl" />
    </div>
  );
};

export default AppSecondaryLoader;
