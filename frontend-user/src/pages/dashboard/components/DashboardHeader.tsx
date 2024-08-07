import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  onClick?: () => void;
}

const DashboardHeader = ({ title, onClick }: Props): JSX.Element => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    if (!!onClick) onClick();
    else navigate(-1);
  };

  return (
    <header className="relative flex w-full flex-wrap items-center gap-5 ">
      {/* <Icon
        onClick={handleNavigate}
        className="cursor-pointer text-xl md:text-2xl lg:text-3xl"
        icon="ion:arrow-back-outline"
      />
      <span className="ml-2 text-base md:text-lg lg:text-xl">Back</span> */}

      <div
        className="flex shrink-0 cursor-pointer items-center"
        onClick={handleNavigate}
      >
        <Icon
          className="text-xl md:text-2xl lg:text-3xl"
          icon="ion:arrow-back-outline"
        />
        <span className="ml-2 text-base md:text-lg lg:text-xl">Back</span>
      </div>

      <p className="flex-1 text-center text-base font-medium md:text-lg lg:text-xl">
        {title}
      </p>
    </header>
  );
};

export default DashboardHeader;
