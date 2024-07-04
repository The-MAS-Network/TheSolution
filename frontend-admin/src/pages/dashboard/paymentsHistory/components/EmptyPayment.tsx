import { MdiDeleteEmptyOutline } from "@/components/icons";
import { useAppTranslator } from "@/hooks/useAppTranslator";

const pageValues = ["You have no payment or tipping history"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const EmptyPayment = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-28 text-white">
      <MdiDeleteEmptyOutline className="text-6xl text-appLight100" />
      <p>{translatedValues["You have no payment or tipping history"]}</p>
    </div>
  );
};

export default EmptyPayment;
