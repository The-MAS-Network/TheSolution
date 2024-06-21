import { EmojioneV1LightningMood } from "@/components/icons";
import { useAppTranslator } from "@/hooks/useAppTranslator";

interface Props {
  totalAmount: number;
  totalSentAmount: number;
}

const pageValues = ["Successfully Sent out of", "Total TIP"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const Summary = ({ totalAmount, totalSentAmount }: Props): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  return (
    <>
      <data
        value="600"
        className="mx-auto flex items-center font-baloo2 font-semibold"
      >
        <EmojioneV1LightningMood className="text-xl sm:text-2xl" />
        <span className="pl-1 text-2xl text-white sm:text-3xl">
          {totalSentAmount}/
        </span>
        <span className="text-xl text-appYellow300  sm:text-2xl">
          {totalAmount}
        </span>
      </data>

      <p className="mb-4 mt-3 text-center text-sm">
        {translatedValues?.["Successfully Sent out of"]}{" "}
        <span className="pl-1 text-appYellow300">
          {" "}
          {translatedValues?.["Total TIP"]}
        </span>
      </p>
    </>
  );
};

export default Summary;
