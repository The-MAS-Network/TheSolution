import Lottie from "lottie-react";
import verifySatsLoader from "@/assets/animation/loader.json";
import { useAppTranslator } from "@/hooks/useAppTranslator";

const pageValues = ["Loading ..."] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const AppLoader = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  return (
    <main className="app-container-lg  h-full  min-h-screen flex-col items-center justify-center md:flex ">
      <section className="mx-auto flex h-full min-h-screen w-full max-w-[25rem] flex-col items-center justify-center pb-20 text-white md:min-h-max  ">
        <div>
          <div className="maxw w-full p-5">
            <Lottie animationData={verifySatsLoader} loop={true} />
          </div>
          <h1 className="mb-16 mt-12  text-center  text-lg font-bold text-white sm:mb-8 sm:mt-6 sm:text-xl">
            {translatedValues?.["Loading ..."]}
          </h1>
        </div>
      </section>
    </main>
  );
};

export default AppLoader;
