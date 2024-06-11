import Lottie from "lottie-react";
import verifySatsLoader from "../../../assets/animation/verify-sats-loader.json";
import { useAppTranslator } from "@/hooks/useAppTranslator";

const pageValues = ["Wait while we verify payment..."] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const VerifyPaymentLoader = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  return (
    <>
      <h1 className="mb-16 mt-12  text-center  text-lg font-bold text-white sm:mb-8 sm:mt-6 sm:text-xl">
        {translatedValues?.["Wait while we verify payment..."]}
      </h1>

      <div className="w-full p-5">
        <Lottie animationData={verifySatsLoader} loop={true} />
      </div>
    </>
  );
};

export default VerifyPaymentLoader;
