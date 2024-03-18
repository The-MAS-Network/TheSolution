import AppBackButton from "@/components/AppBackButton";

const ForgotPasswordPage = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-5 bg-appBlue400 text-white">
      <p className="text-base font-semibold md:text-lg lg:text-xl">
        Forgot PasswordPage
      </p>
      <AppBackButton />
    </div>
  );
};

export default ForgotPasswordPage;
