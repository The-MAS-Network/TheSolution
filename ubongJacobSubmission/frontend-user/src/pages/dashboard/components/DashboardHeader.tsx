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
    <header className="relative flex w-full items-center ">
      <Icon
        onClick={handleNavigate}
        className="absolute cursor-pointer text-xl md:text-2xl lg:text-3xl"
        icon="ion:arrow-back-outline"
      />

      <p className="flex-1 text-center text-base font-medium md:text-lg lg:text-xl">
        {title}
      </p>
    </header>
  );
};

export default DashboardHeader;
