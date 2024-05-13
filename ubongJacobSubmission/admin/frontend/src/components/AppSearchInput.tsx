import { Icon } from "@iconify/react";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  onSearchClick: () => void;
}

const AppSearchInput = ({
  onSearchClick,
  ...otherProps
}: Props): JSX.Element => {
  return (
    <label
      className="my-5 flex h-11 w-full items-center gap-2 rounded-lg border border-appBlue500  bg-appDarkBlue500 px-2 md:px-3 lg:px-4"
      htmlFor="search"
    >
      <input
        id="search"
        type="search"
        className="flex-1 bg-transparent text-white outline-0 placeholder:text-appLight200"
        {...otherProps}
      />
      <button
        onClick={onSearchClick}
        type="button"
        className="text-white  transition-all duration-300 hover:scale-105 hover:text-appYellow100 active:scale-95"
      >
        <Icon icon="iconamoon:search-light" className="text-2xl" />
      </button>
    </label>
  );
};

export default AppSearchInput;
