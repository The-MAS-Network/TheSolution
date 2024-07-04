import { Icon } from "@iconify/react/dist/iconify.js";

const menuItems = [
  "SATs",
  //  "BTC",
  "USD",
];

interface Props {
  handleBlur: () => void;
  setActiveMenu: (value: string) => void;
  setVisibility: () => void;
  isVisible: boolean;
}

const FilterButton = ({
  handleBlur,
  setActiveMenu,
  setVisibility,
  isVisible,
}: Props): JSX.Element => {
  return (
    <button onBlur={handleBlur} onClick={setVisibility} type="button">
      <Icon
        icon="solar:filter-bold-duotone"
        className="cursor-pointer text-2xl"
      />

      <ul
        className={`absolute right-0 top-[100%] z-[3] flex w-max flex-col gap-3 rounded-xl bg-appDarkBlue100 p-2  transition-all  ${isVisible ? "scale-100" : "scale-0"}`}
      >
        {menuItems.map((value, key) => (
          <li
            onClick={() => setActiveMenu(value)}
            className="flex w-screen max-w-44 cursor-pointer rounded-md bg-transparent p-1 px-3 text-sm text-white transition-all duration-300 hover:bg-appBlue140  sm:text-base"
            key={key}
          >
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </button>
  );
};

export default FilterButton;
