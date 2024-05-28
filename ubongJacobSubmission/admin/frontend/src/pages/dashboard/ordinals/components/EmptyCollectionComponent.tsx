import { useAppTranslator } from "@/hooks/useAppTranslator";
import { Icon } from "@iconify/react/dist/iconify.js";

const pageValues = ["You have no collections"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const EmptyCollectionComponent = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-28 text-white">
      <Icon
        className="text-appLight100 text-6xl"
        icon="mdi:delete-empty-outline"
      />
      <p>{translatedValues["You have no collections"]}</p>
    </div>
  );
};

export default EmptyCollectionComponent;
