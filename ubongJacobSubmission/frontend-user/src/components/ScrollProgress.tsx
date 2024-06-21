import { useEffect, useRef } from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onScrollProgress: (value: number) => void;
}

const ScrollProgress = ({
  onScrollProgress,
  ...otherProps
}: Props): JSX.Element => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!divRef?.current) return;

      const { scrollTop, scrollHeight, clientHeight } = divRef?.current;
      const newScrollProgress = Math.round(
        (scrollTop / (scrollHeight - clientHeight)) * 100,
      );
      onScrollProgress(newScrollProgress);
    };
    if (divRef?.current) {
      divRef?.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      !!divRef?.current &&
        divRef.current.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <div {...otherProps} ref={divRef} />;
};

export default ScrollProgress;
