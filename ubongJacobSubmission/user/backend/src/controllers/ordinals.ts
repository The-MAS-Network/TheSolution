import { Request, Response } from "express";
import { Repository } from "typeorm";
import { bitcoinExplorerBaseAPI, hiroSoBaseApi } from "../api/external.api";
import dataSource from "../db/data-source";
import { OrdinalWallets } from "../entities/OrdinalWallets.entity";
import { message } from "../middlewares/utility";
import {
  ConfirmBothWalletsProps,
  GetBlockExplorerTransactionDetailsRes,
  GetBlockExplorerWalletDataRes,
  GetOrdinalError,
  GetOrdinalsFromWalletAddress,
} from "../types/ordinals.types";
import { handleApiErrors } from "../utilities/handleErrors";
import { validateId } from "../utilities/schemaValidators";

export const getOrdinalsFromWalletAddress = async (
  req: Request,
  res: Response
) => {
  const id = req?.params?.id;

  // VALIDATE REQUEST
  const { error } = validateId({ data: { id }, maxLength: 100 });

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const response = await hiroSoBaseApi.get<
    GetOrdinalsFromWalletAddress,
    GetOrdinalError
  >(`/inscriptions?address=${id?.trim()}`);

  if (response.ok) {
    return res
      .status(200)
      .send(
        message(true, "Wallet ordinals retrieved successfully.", response?.data)
      );
  } else {
    return res
      .status(503)
      .send(
        message(
          false,
          response?.data?.error ??
            "An error occured when getting ordinals with the given id."
        )
      );
  }
};

export const confirmOnchainPaymentForWalletVerification = async () => {
  const ordinalWalletsRepository = dataSource.getRepository(OrdinalWallets);
  const ordinalWallets = await ordinalWalletsRepository.find({
    where: { isVerified: false },
  });

  if (ordinalWallets.length > 0) {
    for (let i = 0; i < ordinalWallets.length; i++) {
      const wallet = ordinalWallets[i];
      confirmWalletsPayment(wallet, ordinalWalletsRepository);
    }
  }
};

export async function confirmWalletsPayment(
  wallet: OrdinalWallets,
  ordinalWalletsRepository: Repository<OrdinalWallets>
): Promise<{ message: string; status: boolean }> {
  if (wallet?.isVerified)
    return {
      status: false,
      message: "The wallet with the given Id is already verified.",
    };

  if (!!wallet?.transactionId) {
    const message = await confirmBothWallets({
      ordinalWalletsRepository,
      wallet,
      transactionID: wallet?.transactionId,
    });
    return message;
  } else {
    const walletDetailsResponse =
      await bitcoinExplorerBaseAPI.get<GetBlockExplorerWalletDataRes>(
        `/address/${wallet.onChainWallet}`
      );

    if (walletDetailsResponse.ok) {
      const transactionIDS = walletDetailsResponse?.data?.txHistory?.txids;

      if (!!transactionIDS && transactionIDS.length > 0) {
        const message = await confirmBothWallets({
          ordinalWalletsRepository,
          wallet,
          transactionID: transactionIDS[0],
        });
        return message;
      } else {
        return {
          status: false,
          message: `No transaction ID found yet for the given onchain wallet. ${transactionIDS}`,
        };
      }
    } else {
      return {
        status: false,
        message: `Error in getting wallet details : ${handleApiErrors(
          walletDetailsResponse
        )}`,
      };
    }
  }
}

async function confirmBothWallets({
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
          await ordinalWalletsRepository.remove(oldOwner);
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
          // FRONTEND IS MAKING STRICT USE OF THE STARTING WORDS OF THIS MESSAGE. IN THE CASE OF ANY CHANGES FIND IT ON THE USER FRONTEND AND CHANGE IT TOO.
          message: `Transaction details confirmation is less than 1. Current confirmation is ${
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
