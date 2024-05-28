import { useAppTranslator } from "@/hooks/useAppTranslator";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  rightIcon?: JSX.Element;
}

const DashboardTitle = ({ title, rightIcon }: Props): JSX.Element => {
  interface ITranslate {
    [title: string]: string;
  }

  const values: ITranslate = {
    [title]: title,
  };
  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });
  const navigate = useNavigate();

  return (
    <nav className="flex items-center">
      <Icon
        onClick={() => navigate(-1)}
        className="absolute cursor-pointer text-xl transition-all duration-300 hover:text-appYellow100 md:text-2xl lg:text-3xl"
        icon="ep:back"
      />
      <p className="flex-1   text-center text-base font-medium md:text-lg lg:text-xl">
        {translatedValues[title]}
      </p>
      {!!rightIcon && <span className="absolute right-0">{rightIcon}</span>}
    </nav>
  );
};

export default DashboardTitle;
