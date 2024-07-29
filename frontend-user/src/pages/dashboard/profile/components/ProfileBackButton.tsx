import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

interface ITranslate {
  goBack: string;
}

const values: ITranslate = {
  goBack: "Back",
};

const ProfileBackButton = (): JSX.Element => {
  const navigate = useNavigate();

  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });
  return (
    <button
      onClick={() => navigate(routes?.DASHBOARD_PAGE, { replace: true })}
      className="absolute flex items-center gap-x-2 transition-all duration-300 hover:text-appYellow100"
    >
      <Icon
        icon="ion:arrow-back-outline"
        className=" text-xl md:text-2xl lg:text-3xl"
      />
      <span className="text-base font-semibold md:text-lg lg:text-xl">
        {translatedValues.goBack}
      </span>
    </button>
  );
};

export default ProfileBackButton;
