import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PropsWithChildren, useState } from "react";

export interface GenericRowPopoverActionProps {
  title: string;
  onClick: () => void;
  icon: JSX.Element;
  className?: string;
}
export interface GenericRowPopoverProps extends PropsWithChildren {
  actions: GenericRowPopoverActionProps[];
}

const GenericRowPopover = ({
  children,
  actions,
}: GenericRowPopoverProps): JSX.Element => {
  const [isVisible, setVisiblility] = useState(false);

  return (
    <Popover open={isVisible} onOpenChange={(value) => setVisiblility(value)}>
      <PopoverTrigger className="cursor-pointer" asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="bg-appDarkBlue100 flex w-full max-w-max flex-col gap-y-3 rounded-xl border-0  px-1 py-2 ">
        {actions.map(({ icon, onClick, title, className }, key) => (
          <button
            type="button"
            key={key}
            onClick={() => {
              onClick();
              setVisiblility(false);
            }}
            className={cn(
              "hover:text-appYellow100 flex w-max cursor-pointer items-center gap-2 p-1 text-sm font-normal text-white  outline-0 transition-all duration-300 sm:text-base",
              className,
            )}
          >
            <span className="text-base">{icon}</span>
            <span>{title}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default GenericRowPopover;
