import { useAppTranslator } from "@/hooks/useAppTranslator";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const pageValues = [
  "left to verify your account  before it get’s deleted",
  "hours",
  "minutes",
  "seconds",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

interface Props {
  date: string;
}

const VerificationCountDown = ({ date }: Props): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, []);

  const targetDate = new Date(date); // Provided target date

  // Add 24 hours to the target date
  targetDate.setHours(targetDate.getHours() + 24);

  const getTimeRemaining = () => {
    const difference = targetDate.getTime() - currentTime;

    // Calculate remaining days, hours, minutes, and seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = getTimeRemaining();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, []);
  return (
    <span className="flex max-w-max items-center gap-x-3 rounded-full bg-appYellow200 px-2 py-1 text-center text-xs font-medium">
      <Icon icon="octicon:unverified-16" className="flex-shrink-0 text-sm" />
      <p>
        {hours} {translatedValues.hours} : {minutes} {translatedValues?.minutes}
        : {seconds} {translatedValues.seconds}{" "}
        {
          translatedValues[
            "left to verify your account  before it get’s deleted"
          ]
        }
      </p>
    </span>
  );
};

export default VerificationCountDown;
