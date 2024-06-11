import { useAppTranslator } from "@/hooks/useAppTranslator";

interface Props {
  status: string;
}

const pageValues = ["Sent", "Failed"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});
const StatusPill = ({ status }: Props): JSX.Element => {
  const isSuccess = status === "success";
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  return (
    <span
      className={`rounded-full border px-2 py-[2px] text-sm font-medium ${isSuccess ? " border-appGreen400 text-appGreen500" : "border-appRed700 text-appRed700"} `}
    >
      {isSuccess ? translatedValues?.Sent : translatedValues?.Failed}
    </span>
  );
};

export default StatusPill;
