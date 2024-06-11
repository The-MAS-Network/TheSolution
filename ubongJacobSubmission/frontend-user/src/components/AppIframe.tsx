interface Props
  extends React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  > {}

const AppIframe = (props: Props): JSX.Element => {
  return <iframe {...props} allow="accelerometer; gyroscope" />;
};

export default AppIframe;
