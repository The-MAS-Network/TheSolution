import { Repository } from "typeorm";
import {
  bitcoinExplorerBaseAPI,
  btcDotComBaseApi,
  getOrdinalsFromWallet,
  ordiscanBaseApi,
} from "../../api/external.api";
import dataSource from "../../db/data-source";
import { Users } from "../../entities/Users.entity";
import { OrdinalWallets } from "../../entities/ordinal/OrdinalWallets.entity";
import { Ordinals } from "../../entities/ordinal/Ordinals.entity";
import { message } from "../../middlewares/utility";
import {
  BTC_COM_SINGLE_TRANSACTION,
  BTC_com_WalletDataResponse,
  SpecificInscriptionResponse,
  // BTC_com_WalletDataResponse,
} from "../../types/external.api.types";
import {
  ConfirmBothWalletsProps,
  GetBlockExplorerWalletDataRes,
  SaveOrdinalByUserInDb,
  SaveOrdinalInDbProps,
} from "../../types/ordinals.types";
import { calculateDateTimeDifference } from "../../utilities";
import { handleApiErrors } from "../../utilities/handleErrors";

const useHistory: Date[] = [];

export const confirmAllOnchainPaymentForWalletVerification = async () => {
  const lastUsed = useHistory[0];
  if (
    useHistory?.length > 0 &&
    calculateDateTimeDifference(lastUsed)?.minutes < 5
  ) {
    return;
  }
  const ordinalWalletsRepository = dataSource.getRepository(OrdinalWallets);
  const ordinalWallets = await ordinalWalletsRepository.find({
    where: { isVerified: false },
  });

  if (ordinalWallets.length > 0) {
    for (let i = 0; i < ordinalWallets.length; i++) {
      const wallet = ordinalWallets[i];
      confirmWalletsPayment(wallet, ordinalWalletsRepository);
    }

    if (useHistory?.length >= 3) {
      useHistory.pop();
    }

    useHistory.unshift(new Date());
  }
};

export async function confirmWalletsPayment(
  wallet: OrdinalWallets,
  ordinalWalletsRepository: Repository<OrdinalWallets>
): Promise<{ message: string; status: boolean }> {
  confirmAllOnchainPaymentForWalletVerification();
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
    // WE ARE USING 2 APIS TO VERIFY ON CHAIN DATA IN CASE ONE IS DOWN

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
          message: `No transaction ID found yet for the given onchain wallet.`,
        };
      }
    } else {
      const secondWalletDetailsResponse =
        await btcDotComBaseApi.get<BTC_com_WalletDataResponse>(
          `/address/${wallet.onChainWallet}/unspent`
        );
      if (secondWalletDetailsResponse?.ok) {
        const transactionIDS = secondWalletDetailsResponse?.data?.data.list;

        if (!!transactionIDS && transactionIDS.length > 0) {
          const message = await confirmBothWallets({
            ordinalWalletsRepository,
            wallet,
            transactionID: transactionIDS?.[0]?.tx_hash,
          });
          return message;
        } else {
          return {
            status: false,
            message: `No transaction ID found yet for the given onchain wallet.`,
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
}

async function confirmBothWallets({
  wallet,
  ordinalWalletsRepository,
  transactionID,
}: ConfirmBothWalletsProps): Promise<{ message: string; status: boolean }> {
  const transactionDetailRes =
    await btcDotComBaseApi.get<BTC_COM_SINGLE_TRANSACTION>(
      `/tx/${transactionID}`
    );

  if (transactionDetailRes?.ok && transactionDetailRes?.data) {
    const firstAddress =
      transactionDetailRes?.data?.data?.outputs?.[0]?.addresses?.[0];
    const secondAddress =
      transactionDetailRes?.data?.data?.outputs?.[1]?.addresses?.[0];
    // const inputAddress =
    //   transactionDetailRes?.data?.data?.inputs?.[1]?.prev_addresses?.[0];

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

      if (transactionDetailRes?.data?.data?.confirmations >= 1) {
        // TAKE SNAP SHOT OF THE USER ORDINALS IN THE ORDINAL WALLET
        takeWalletSnapShot({
          lightningAddress: wallet?.user?.lightningAddress,
          walletAddress: wallet?.address,
        });
        wallet.isVerified = true;
        await ordinalWalletsRepository.save(wallet);

        const similarOrdinalWallets = await ordinalWalletsRepository.find({
          where: { address: wallet?.address },
          order: { createdAt: "ASC" },
        });

        if (similarOrdinalWallets?.length > 1) {
          const oldOwner = similarOrdinalWallets[0];
          await ordinalWalletsRepository.remove(oldOwner);

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
            transactionDetailRes?.data?.data?.confirmations ?? 0
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

export async function saveOrdinalByAdminInDb(props: SaveOrdinalInDbProps) {
  const {
    ordinalId,
    contentType,
    isAdmin,
    mimeType,
    ordinalCollections,
    possibleOrdinalContent,
  } = props;
  const ordinalsRepository = dataSource.getRepository(Ordinals);

  const ordinalInDB = await ordinalsRepository.findOne({
    where: { ordinalId },
    relations: { ordinalCollections: true },
  });

  const containsCollection =
    !!ordinalCollections && ordinalCollections?.length > 0;

  if (!!ordinalInDB) {
    if (containsCollection) {
      ordinalInDB.ordinalCollections = [
        ...ordinalInDB.ordinalCollections,
        ...ordinalCollections,
      ];
      return await ordinalsRepository.save(ordinalInDB);
    } else {
      return ordinalInDB;
    }
  }

  const ordinal = ordinalsRepository.create({
    ordinalId,
    contentType,
    mimeType,
    isAdmin,
    ...(containsCollection ? { ordinalCollections } : {}),
    possibleOrdinalContent:
      !!possibleOrdinalContent && possibleOrdinalContent?.length > 0
        ? possibleOrdinalContent
        : undefined,
  });

  return await ordinalsRepository.save(ordinal);
}

export async function deleteOrdinalInDb(id: string) {
  const ordinalsRepository = dataSource.getRepository(Ordinals);

  const ordinalInDB = await ordinalsRepository.findOne({
    where: { id },
    relations: { ordinalCollections: true, user: true },
  });

  if (!ordinalInDB) {
    return message(false, "Ordinal with the given id could not be found");
  }

  if (
    ordinalInDB?.ordinalCollections &&
    ordinalInDB?.ordinalCollections.length > 0
  ) {
    return message(false, "Ordinal contains one or more ordinal collections");
  }

  if (!!ordinalInDB?.user?.lightningAddress) {
    return message(false, "Ordinal is owned by a lightning address");
  }

  await ordinalsRepository.remove(ordinalInDB);

  return message(true, "Ordinal deleted successfully.");
}

type OrdinalContentTypes = "Image" | "HTML" | "Text" | "Unknown" | "JSON";

interface CheckOrdinalContentTypeProps {
  mime_type: string;
  content_type: string;
}

function CheckOrdinalContentType({
  content_type: contentType,
  mime_type: mimeType,
}: CheckOrdinalContentTypeProps): OrdinalContentTypes {
  const htmlDataTypes = ["text/html", "text/html;charset=utf-8"];

  const jsonDataTypes = ["application/json", "application/json;charset=utf-8"];

  // const textDataTypes = ["text/plain", "text/plain;charset=utf-8"];

  const imageDataTypes = [
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
    "image/jpeg",
    "image/svg+xml",
  ];

  if (
    htmlDataTypes.includes(mimeType) ||
    contentType.includes("html") ||
    mimeType.includes("html")
  ) {
    return "HTML";
  }

  if (
    (imageDataTypes.includes(mimeType) || imageDataTypes.includes(contentType),
    contentType.includes("image") || mimeType.includes("image"))
  ) {
    return "Image";
  }

  if (contentType === "text/plain") {
    return "Text";
  }
  if (
    (jsonDataTypes.includes(mimeType) || jsonDataTypes.includes(contentType),
    contentType.includes("application/json") ||
      mimeType.includes("application/json"))
  ) {
    return "JSON";
  }

  return "Unknown";
}

export const generateOrdinalContentLink = (id: string) =>
  "https://ordiscan.com/content/" + id;

interface GetContentValueProps {
  contentType: OrdinalContentTypes;
  id: string;
}

async function getTextContent(id: string) {
  const content = await ordiscanBaseApi.get(`/content/${id}`);
  const value = content?.data as string;

  if (value?.length > 1 && value?.length <= 1900) return JSON.stringify(value);
  else return undefined;
}

async function getContentValue(props: GetContentValueProps) {
  const { contentType, id } = props;

  if (contentType == "HTML" || contentType === "Image") {
    return generateOrdinalContentLink(id ?? "");
  } else if (contentType == "Text" || contentType === "JSON") {
    const response = getTextContent(id);
    return response;
  } else {
    return undefined;
  }
}

async function saveOrdinalByUserInDb(props: SaveOrdinalByUserInDb) {
  const {
    ordinalId,
    lightningAddress,
    contentType,
    mimeType,
    possibleOrdinalContent,
  } = props;

  const ordinalsRepository = dataSource.getRepository(Ordinals);

  const ordinalInDB = await ordinalsRepository.findOne({
    where: { ordinalId },
    relations: { user: true },
  });

  const userRepository = dataSource.getRepository(Users);
  const user = await userRepository.findOneBy({ lightningAddress });

  if (!!ordinalInDB) {
    if (!!user) {
      if (user?.lightningAddress !== ordinalInDB?.user?.lightningAddress) {
        ordinalInDB.user = user;
        await ordinalsRepository.save(ordinalInDB);
        return;
      }
    }
    return;
  } else {
    const ordinal = ordinalsRepository.create({
      ...(!!user ? { user } : {}),
      ordinalId,
      contentType,
      mimeType,
      isAdmin: false,
      // lightningAddress,
      possibleOrdinalContent:
        !!possibleOrdinalContent && possibleOrdinalContent?.length > 0
          ? possibleOrdinalContent
          : undefined,
    });

    return await ordinalsRepository.save(ordinal);
  }
}

interface TakeWalletSnapShotProps {
  lightningAddress: string;
  walletAddress: string;
  offset?: number;
}

export async function takeWalletSnapShot(props: TakeWalletSnapShotProps) {
  const { lightningAddress, walletAddress } = props;
  const response = await getOrdinalsFromWallet({
    address: walletAddress,
    offset: 0,
  });

  if (response?.ok && response?.data) {
    const totalItems = response?.data?.total;
    const itemsPerPage = response?.data?.limit;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const offset = (totalPages - 1) * itemsPerPage;

    for (let i = 1; i < totalItems; i++) {
      getOtherWalletData({ lightningAddress, walletAddress, offset });
    }

    iterateWalletResponse({ data: response?.data?.results, lightningAddress });

    return message(true, "Wallet snapshot started.");
  } else {
    return message(false, "An error occured when taking wallet snapshot.");
  }
}

interface IterateWalletResponseProps {
  data: SpecificInscriptionResponse[];
  lightningAddress: string;
}

async function iterateWalletResponse(props: IterateWalletResponseProps) {
  const { data, lightningAddress } = props;

  for (let i = 0; i < data.length; i++) {
    const currentData = data[i];
    const contentType = CheckOrdinalContentType({
      content_type: currentData?.content_type,
      mime_type: currentData?.mime_type,
    });

    const possibleContent = await getContentValue({
      contentType,
      id: currentData?.id,
    });

    await saveOrdinalByUserInDb({
      contentType: currentData?.content_type,
      mimeType: currentData?.mime_type,
      lightningAddress,
      ordinalId: currentData?.id,
      possibleOrdinalContent: possibleContent,
    });
  }
}

async function getOtherWalletData(props: TakeWalletSnapShotProps) {
  const { lightningAddress, walletAddress, offset } = props;
  if (!!offset) {
    const response = await getOrdinalsFromWallet({
      address: walletAddress,
      offset,
    });
    if (response?.ok && response?.data) {
      iterateWalletResponse({
        data: response?.data?.results,
        lightningAddress,
      });
    }
  }
}
