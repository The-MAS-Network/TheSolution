import { InputHTMLAttributes } from "react";
import ErrorMessage from "../ErrorMessage";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  hookFormProps: {};
  errorMessage: string | null;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  ignoreCapitalLetterSpacing?: boolean;
}

const AppInput = ({
  leftIcon,
  rightIcon,
  errorMessage,
  hookFormProps,
  ignoreCapitalLetterSpacing,
  ...otherProps
}: Props): JSX.Element => {
  return (
    <div>
      <div className="flex items-center gap-x-2 rounded-lg border border-transparent bg-appGray100 px-4 transition-all duration-300 focus-within:border-appBlue500 focus-within:bg-appDarkBlue200">
        {leftIcon}
        <input
          className="w-full  bg-transparent py-4 text-white outline-0 placeholder:text-appGray200"
          placeholder="Enter your lightning address"
          {...hookFormProps}
          {...otherProps}
        />
        {rightIcon}
      </div>

      <ErrorMessage
        message={errorMessage ?? undefined}
        ignoreCapitalLetterSpacing={ignoreCapitalLetterSpacing}
      />
    </div>
  );
};

export default AppInput;
