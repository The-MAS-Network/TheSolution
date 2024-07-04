import AppBackButton from "@/components/AppBackButton";
import routes from "@/navigation/routes";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

interface Props {
  ordinal: string;
  verify: string;
  wallet: string;
}
const NoOrdinalWalletSubPage = ({
  ordinal,
  verify,
  wallet,
}: Props): JSX.Element => {
  return (
    <>
      <AppBackButton />

      <div className="ordinal-wallet-card-bg mt-5 rounded-2xl p-6">
        <Icon
          className="text-2xl md:text-3xl lg:text-4xl"
          icon="solar:wallet-line-duotone"
        />

        <h1 className="mb-5 mt-3 text-base md:text-lg lg:text-xl">
          {ordinal} {wallet}
        </h1>

        <Link
          className="block w-full rounded-xl bg-appYellow600 p-3 text-center text-sm text-appYellow700 transition-all duration-300 hover:scale-105 active:scale-95 sm:text-base"
          to={routes.NEW_ORDINALS_WALLET_PAGE}
        >
          {verify}
        </Link>
      </div>
    </>
  );
};

export default NoOrdinalWalletSubPage;
