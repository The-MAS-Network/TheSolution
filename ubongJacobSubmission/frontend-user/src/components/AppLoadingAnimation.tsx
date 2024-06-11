import Lottie from "lottie-react";
import verifySatsLoader from ".././assets/animation/verify-sats-loader.json";

const AppLoadingAnimation = (): JSX.Element => {
  return (
    <div className="w-full p-5">
      <Lottie animationData={verifySatsLoader} loop={true} />
    </div>
  );
};

export default AppLoadingAnimation;
