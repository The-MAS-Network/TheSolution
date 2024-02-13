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
}

const AppBackButton = ({ isPrevious }: Props): JSX.Element => {
  const navigate = useNavigate();
  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });

  const getTitle = () => {
    if (!!isPrevious) return translatedValues.previous;
    else return translatedValues.back;
  };

  return (
    <button
      onClick={() => navigate(-1)}
      type="button"
      className="flex items-center gap-x-2 text-base font-medium md:text-lg lg:text-xl"
    >
      <Icon
        className="text-2xl md:text-3xl lg:text-4xl"
        icon="ion:arrow-back-outline"
      />
      <span>{getTitle()}</span>
    </button>
  );
};

export default AppBackButton;
