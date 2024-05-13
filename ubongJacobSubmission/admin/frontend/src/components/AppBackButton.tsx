import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useAppTranslator } from "../hooks/useAppTranslator";

interface ITranslate {
  back: string;
  previous: string;
}

const values: ITranslate = {
  back: "Back",
  previous: "Previous",
};

interface Props {
  isPrevious?: boolean;
  isLoading?: boolean;
}

const AppBackButton = ({ isPrevious, isLoading }: Props): JSX.Element => {
  const navigate = useNavigate();
  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });

  const getTitle = () => {
    if (!!isPrevious) return translatedValues.previous;
    else return translatedValues.back;
  };

  return (
    <button
      disabled={isLoading}
      onClick={() => navigate(-1)}
      type="button"
      className="flex items-center gap-x-3 text-base font-medium transition-all duration-300 hover:text-appYellow100 disabled:opacity-50 md:text-lg lg:text-xl"
    >
      <Icon className="text-2xl md:text-3xl" icon="ion:arrow-back-outline" />
      <span>{getTitle()}</span>
    </button>
  );
};

export default AppBackButton;
