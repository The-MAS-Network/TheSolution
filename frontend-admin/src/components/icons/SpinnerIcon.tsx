type IconProps = React.HTMLAttributes<SVGElement>;

const SpinnerIcon = (props: IconProps): JSX.Element => {
  return (
    <span className="text-2xl">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        className={`animate-spin ${props?.className}`}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </span>
  );
};

export default SpinnerIcon;
