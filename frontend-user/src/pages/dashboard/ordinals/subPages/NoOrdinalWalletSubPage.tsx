import AppBackButton from "@/components/AppBackButton";
import OrdinalIcon from "@/components/icons/OrdinalIcon";
import routes from "@/navigation/routes";
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
        {/* <Icon
          className="text-2xl md:text-3xl lg:text-4xl"
          icon="solar:wallet-line-duotone"
        /> */}
        <OrdinalIcon className="text-3xl sm:text-4xl" />

        <h1 className="mb-5 mt-3 text-base md:text-lg lg:text-xl text-center">
          {ordinal} {wallet}
        </h1>

        <Link
          className="block w-full rounded-xl bg-appYellow600 p-3 text-center text-sm text-appYellow700 font-bold transition-all duration-300 hover:scale-105 active:scale-95 sm:text-base"
          to={routes.NEW_ORDINALS_WALLET_PAGE}
        >
          {verify}
        </Link>
      </div>
    </>
  );
};

export default NoOrdinalWalletSubPage;
