import { Icon } from "@iconify/react";

interface Props {
  message: string;
}

const EmptyDataComponent = ({ message }: Props): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-28 text-white">
      <Icon
        className="text-6xl text-appLight100"
        icon="mdi:delete-empty-outline"
      />
      <p>{message}</p>
    </div>
  );
};

export default EmptyDataComponent;
