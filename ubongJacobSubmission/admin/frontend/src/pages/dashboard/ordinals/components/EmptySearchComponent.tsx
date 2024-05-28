import { Icon } from "@iconify/react";

interface Props {
  title: string;
  action: string;
  onPaste: () => void;
}

const EmptySearchComponent = ({
  action,
  onPaste,
  title,
}: Props): JSX.Element => {
  return (
    <>
      <div className="flex items-center justify-center pb-16 pt-60 text-center md:pb-24 md:pt-32">
        <p className="max-w-xs font-normal text-white opacity-55">{title}</p>
      </div>
      <button
        type="button"
        onClick={onPaste}
        className="bg-appLight300 mx-auto flex items-center justify-center gap-2 rounded-2xl px-14 py-4 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {action}
        <Icon icon="fa-solid:paste" className="text-2xl" />
      </button>
    </>
  );
};

export default EmptySearchComponent;
