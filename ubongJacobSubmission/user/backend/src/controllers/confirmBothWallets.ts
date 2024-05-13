import { bitcoinExplorerBaseAPI } from "../api/external.api";
import {
  ConfirmBothWalletsProps,
  GetBlockExplorerTransactionDetailsRes,
} from "../types/ordinals.types";
import { handleApiErrors } from "../utilities/handleErrors";

export async function confirmBothWallets({
  wallet,
  ordinalWalletsRepository,
  transactionID,
}: ConfirmBothWalletsProps): Promise<{ message: string; status: boolean }> {
  const transactionDetailRes =
    await bitcoinExplorerBaseAPI.get<GetBlockExplorerTransactionDetailsRes>(
      `/tx/${transactionID}`
    );

  if (transactionDetailRes?.ok && transactionDetailRes?.data) {
    const firstAddress =
      transactionDetailRes?.data?.vout?.[0]?.scriptPubKey?.address;
    const secondAddress =
      transactionDetailRes?.data?.vout?.[1]?.scriptPubKey?.address;

    const bothWalletAdrressisValid =
      (firstAddress == wallet?.onChainWallet &&
        secondAddress == wallet?.address) ||
      (firstAddress == wallet?.address &&
        secondAddress == wallet?.onChainWallet);

    if (bothWalletAdrressisValid) {
      if (!wallet.isBroadcasted) {
        wallet.isBroadcasted = true;
        wallet.transactionId = transactionID;
        await ordinalWalletsRepository.save(wallet);
      }

      if (transactionDetailRes?.data?.confirmations >= 1) {
        wallet.isVerified = true;
        await ordinalWalletsRepository.save(wallet);

        const similarOrdinalWallets = await ordinalWalletsRepository.find({
          where: { address: wallet?.address },
          order: { createdAt: "ASC" },
        });

        if (similarOrdinalWallets?.length > 1) {
          const oldOwner = similarOrdinalWallets[0];
          // await ordinalWalletsRepository.remove(oldOwner);
          console.log(oldOwner);
          return {
            message: `Verification successful and old user details removed.`,
            status: true,
          };
        }

        return { message: `Verification successful`, status: true };
      } else {
        return {
          status: false,
          message: `Transacation details confirmation is less than 1. Current confirmation is ${
            transactionDetailRes?.data?.confirmations ?? 0
          }`,
        };
      }
    } else {
      return {
        status: false,
        message: `Sender wallet or receivers wallet does not match. Wallet 1: ${firstAddress} ---- Wallet 2:${secondAddress} `,
      };
    }
  } else {
    return {
      status: false,
      message: `Error in getting transaction details data : ${handleApiErrors(
        transactionDetailRes
      )}`,
    };
  }
}
