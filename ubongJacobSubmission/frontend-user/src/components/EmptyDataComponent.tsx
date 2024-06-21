import { MdiDeleteEmptyOutline } from "./icons";

interface Props {
  message: string;
}

const EmptyDataComponent = ({ message }: Props): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-28 text-white">
      <MdiDeleteEmptyOutline className="text-6xl md:text-7xl lg:text-8xl" />
      <p>{message}</p>
    </div>
  );
};

export default EmptyDataComponent;
