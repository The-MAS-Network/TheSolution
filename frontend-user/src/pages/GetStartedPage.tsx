import { Link } from "react-router-dom";

import ChangeLanguageButton from "@/components/ChangeLanguageButton";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import GetStartedChip from "@/assets/images/get-started-chip.svg";
import GetStartedMedia from "@/assets/images/get-started-media.svg";

const pageValues = ["The Solution", "LOG IN", "SIGN UP"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const GetStartedPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  return (
    <div className="relative bg-gradient-to-br from-appBlue100 to-appBlue200">
      <div className="absolute inset-0 z-10 hidden items-center lg:flex ">
        <div className="mx-auto -mt-40  flex w-full max-w-[60rem] items-center justify-between px-5">
          <img src={GetStartedChip} />
          <img className="rotate-180" src={GetStartedChip} />
        </div>
      </div>
      <div className="absolute inset-0 z-[5] hidden items-end justify-end lg:flex ">
        <img src={GetStartedMedia} />
      </div>

      <main className="app-container relative z-20 flex min-h-screen flex-col justify-end">
        {/* <h1 className="text-center font-baloo2 text-xl font-bold text-white md:text-2xl lg:text-3xl"> */}
        <h1 className="text-center font-baloo2 text-5xl font-bold text-white sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl">
          {translatedValues["The Solution"]}
        </h1>

        <ChangeLanguageButton />
        <div className="flex flex-col gap-y-4 pb-6 pt-48">
          <Link
            to={routes.LOGIN_PAGE}
            className="block w-full rounded-xl bg-appDarkBlue100 py-4 text-center font-bold text-white shadow-appButtonInnerShadow transition-all duration-300 hover:scale-110 active:scale-100"
          >
            {translatedValues["LOG IN"]}
          </Link>
          <Link
            to={routes.REGISTER_PAGE}
            className="block w-full rounded-xl border-[2px] border-white py-4 text-center font-bold text-white transition-all  duration-300 hover:scale-110 active:scale-100"
          >
            {translatedValues["SIGN UP"]}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default GetStartedPage;
