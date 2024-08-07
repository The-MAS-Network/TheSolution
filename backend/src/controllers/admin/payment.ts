import { Request, Response } from "express";
import { PayResult } from "lightning";
import dataSource from "../../db/data-source";
import { Users } from "../../entities/Users.entity";
import { AdminOTPS } from "../../entities/admin/AdminOTPs.entity";
import { Admins } from "../../entities/admin/Admins.entity";
import { OrdinalCollections } from "../../entities/ordinal/OrdinalCollections.entity";
import {
  OrdinalTips,
  PaymentStatus,
} from "../../entities/ordinal/OrdinalTips.entity";
import {
  GroupType,
  OrdinalTipsGroups,
} from "../../entities/ordinal/OrdinalTipsGroups.entity";
import { Ordinals } from "../../entities/ordinal/Ordinals.entity";
import { message } from "../../middlewares/utility";
import {
  convertAmountToSatsFromCurrentBtcPrice,
  generateOTP,
  getMinAndMax,
  validateOTP,
} from "../../utilities";
import { handleLNURLPayment } from "../../utilities/lightning/lnd";
import {
  GenerateTipOTPReq,
  TipCollectionSchema,
  TipUserSchema,
  validateGenerateTipOTP,
  validateTipCollection,
  validateTipUser,
} from "../../utilities/schema/admin";
import { sendAppErrorMail, sendOTPEmail } from "../../utilities/sendEmail";
import { buildPaginator } from "typeorm-cursor-pagination";
import { validateSingleDataByIdReq } from "../../utilities/schemaValidators";
import { Currencies } from "../../utilities/enums";
import { getBTCPrice } from "../../api/btcPrice.api";
import { LeaderboardTips } from "../../entities/ordinal/LeaderboardTips.entity";

export const tipUser = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateTipUser(req?.body);
  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const { lightningAddress, otp, amount, collectionId, currency } =
    req?.body as TipUserSchema;

  // VALIDATE OTP
  const adminOTPRepository = dataSource.getRepository(AdminOTPS);
  const result = await adminOTPRepository.find({
    take: 1,
  });

  const firstOTP = result?.[0];

  const otpError = validateOTP({
    dbOTP: firstOTP,
    OTP: otp,
    expiryTimeInMinutes: 3,
  });
  if (otpError) return res.status(400).send(message(false, otpError));

  // CHECK IF USER ACCOUNT STILL EXISTS AND ITS VERIFIED
  const userRepository = dataSource.getRepository(Users);
  const user = await userRepository.findOneBy({ lightningAddress });
  if (!user) {
    return res
      .status(400)
      .send(
        message(
          false,
          "We couldn't find a user with the provided lightning address. It's possible the account has been deleted."
        )
      );
  }
  if (!user?.isVerified) {
    return res
      .status(400)
      .send(
        message(
          false,
          "The user with the given lightning address is not verified."
        )
      );
  }

  // CHECK IF USER HAS AN ORDINAL IN THE GIVEN ORDINAL COLLECTION ID
  const ordinalsRepository = dataSource.getRepository(Ordinals);
  const ordinalCollectionsRepository =
    dataSource.getRepository(OrdinalCollections);

  const ordinalCollection = await ordinalCollectionsRepository.findOneBy({
    id: collectionId,
  });

  if (!ordinalCollection) {
    return res
      .status(400)
      .send(
        message(
          false,
          "Ordinal collection with the given collection id does not exist."
        )
      );
  }

  if (!ordinalCollection?.isActive) {
    return res
      .status(400)
      .send(message(false, "A user in an inactive collection can't be tipped"));
  }

  const userOrdinals = await ordinalsRepository.find({
    where: {
      ordinalCollections: {
        id: collectionId,
      },
      user: { lightningAddress },
    },
    relations: {
      ordinalCollections: true,
    },
  });

  if (userOrdinals?.length < 1) {
    return res
      .status(400)
      .send(
        message(
          false,
          "The user with the given lightning address does not own any ordinal in this ordinal collection."
        )
      );
  }

  let currentBTCPrice = "";
  let currentSource = "";

  if (currency === Currencies.USD) {
    const price = await getBTCPrice();
    if (!price?.value || !price?.source) {
      return res
        .status(500)
        .send(
          message(false, "An error occured while getting current BTC price")
        );
    } else {
      currentBTCPrice = price.value;
      currentSource = price?.source;
    }
  }

  const amountInSat = convertAmountToSatsFromCurrentBtcPrice({
    currentBTCPrice,
    dollarAmount: amount,
  });

  const response = await handleLNURLPayment({
    address: lightningAddress,
    amountInSat: !!currentBTCPrice ? amountInSat : amount,
  });

  if (!response || !response.status) {
    return res
      .status(503)
      .send(message(false, `Error sending sats :  ${response?.message}`));
  }

  const responseData = response?.data as PayResult;

  const ordinalTipsRepository = dataSource.getRepository(OrdinalTips);
  const ordinalTipsGroupsRepository =
    dataSource.getRepository(OrdinalTipsGroups);

  const totalTip = !!currentBTCPrice ? amountInSat : amount;

  const ordinalGroup = ordinalTipsGroupsRepository.create({
    totalTip,
    totalSent: totalTip,
    ordinalCollection,
    type: GroupType.SINGLE_TIP,
    ...(!!currentBTCPrice ? { dollarPrice: currentBTCPrice } : {}),
    ...(!!currentSource ? { dollarSource: currentSource } : {}),
    ...(!!currentSource ? { dollarValue: amount?.toString() } : {}),
    currency,
  });

  const leaderboardRepository = dataSource.getRepository(LeaderboardTips);
  const userLeaderboard = await leaderboardRepository.findOneBy({
    user: { lightningAddress: user?.lightningAddress },
  });

  if (!!userLeaderboard) {
    userLeaderboard.totalTip = userLeaderboard.totalTip + totalTip;
    await leaderboardRepository.save(userLeaderboard);
  } else {
    const newLeaderboardUser = leaderboardRepository.create({ user, totalTip });
    await leaderboardRepository.save(newLeaderboardUser);
  }

  const ordinalTip = ordinalTipsRepository.create({
    currency,
    transactionId: responseData?.id as string,
    lightningAddress,
    status: mapStatus(response?.message),
    // imageURL: user?.imageURL ?? "",
    amount: !!currentBTCPrice ? amountInSat : amount,
  });

  const singleTip = await ordinalTipsRepository.save(ordinalTip);

  ordinalGroup.singleTip = singleTip;
  await ordinalTipsGroupsRepository.save(ordinalGroup);

  firstOTP.isUsed = true;
  currentBTCPrice = "";
  currentSource = "";

  await adminOTPRepository.save(firstOTP);

  return res
    .status(201)
    .send(message(true, `${lightningAddress} tipped successfully.`, response));
};

export const tipCommunity = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateTipCollection(req?.body);
  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const { totalAmount, otp, collectionId, currency } =
    req?.body as TipCollectionSchema;

  // VALIDATE OTP
  const adminOTPRepository = dataSource.getRepository(AdminOTPS);
  const result = await adminOTPRepository.find({
    take: 1,
  });

  const firstOTP = result?.[0];

  const otpError = validateOTP({
    dbOTP: firstOTP,
    OTP: otp,
    expiryTimeInMinutes: 3,
  });
  if (otpError) return res.status(400).send(message(false, otpError));

  firstOTP.isUsed = true;
  await adminOTPRepository.save(firstOTP);

  // CHECK IF ORDINAL COLLECTION EXISTS AND ITS ACTIVE
  const ordinalCollectionsRepository =
    dataSource.getRepository(OrdinalCollections);

  const ordinalCollection = await ordinalCollectionsRepository.findOneBy({
    id: collectionId,
  });

  if (!ordinalCollection) {
    return res
      .status(400)
      .send(
        message(
          false,
          "Ordinal collection with the given collection id does not exist."
        )
      );
  }

  if (!ordinalCollection?.isActive) {
    return res
      .status(400)
      .send(message(false, "An inactive collection can't be tipped"));
  }

  const ordinalsRepository = dataSource.getRepository(Ordinals);
  const ordinals = await ordinalsRepository.find({
    where: { ordinalCollections: { id: collectionId } },
    relations: { user: true },
  });
  const filteredOrdinals = ordinals?.filter(
    ({ user }) => !!user && user?.lightningAddress?.length > 2
  );

  if (filteredOrdinals?.length < 1) {
    return res
      .status(400)
      .send(message(false, "No ordinal claimed lightning address found"));
  }

  let currentBTCPrice = "";
  let currentSource = "";

  if (currency === Currencies.USD) {
    const price = await getBTCPrice();
    if (!price?.value || !price?.source) {
      return res
        .status(500)
        .send(
          message(false, "An error occured while getting current BTC price")
        );
    } else {
      currentBTCPrice = price.value;
      currentSource = price?.source;
    }
  }

  const amountInSat = convertAmountToSatsFromCurrentBtcPrice({
    currentBTCPrice,
    dollarAmount: totalAmount,
  });

  const mainAmount = !!currentBTCPrice ? Number(amountInSat) : totalAmount;

  const individualAmount = Math.floor(mainAmount / filteredOrdinals?.length);
  const minimumNumberOfSatsPerUser = 2;

  if (individualAmount < minimumNumberOfSatsPerUser) {
    return res
      .status(400)
      .send(
        message(
          false,
          "Amount too low as minimum amount per user is " +
            minimumNumberOfSatsPerUser
        )
      );
  }

  const ordinalTipsRepository = dataSource.getRepository(OrdinalTips);
  const ordinalTipsGroupsRepository =
    dataSource.getRepository(OrdinalTipsGroups);

  const ordinalGroup = ordinalTipsGroupsRepository.create({
    totalTip: mainAmount,
    totalSent: mainAmount,
    ordinalCollection,
    type: GroupType.GROUP_TIP,
    currency,
    ...(!!currentBTCPrice ? { dollarPrice: currentBTCPrice } : {}),
    ...(!!currentSource ? { dollarSource: currentSource } : {}),
    ...(!!currentSource ? { dollarValue: totalAmount?.toString() } : {}),
  });

  const savedOrdinalGroup = await ordinalTipsGroupsRepository.save(
    ordinalGroup
  );

  // AWAIT THE FIRST 50 ITEMS AND DON'T AWAIT THE REST IN THE CASE THERE ARE 100 OF ITEMS .. USER SHOULD NOT WAIT TOO LONG

  const awaitOrdinals: Ordinals[] = [];
  const nonAwaitOrdinals: Ordinals[] = [];

  for (let i = 0; i < filteredOrdinals.length; i++) {
    if (i < 50) {
      awaitOrdinals.push(filteredOrdinals[i]);
    } else {
      nonAwaitOrdinals.push(filteredOrdinals[i]);
    }
  }

  const handlePayments = async ({
    ordinal,
    isAwait,
  }: {
    ordinal: Ordinals;
    isAwait: boolean;
  }) => {
    const response = await handleLNURLPayment({
      address: ordinal?.user?.lightningAddress ?? "",
      amountInSat: individualAmount,
    });
    const responseData = response?.data as PayResult;
    const ordinalTip = ordinalTipsRepository.create({
      currency,
      ordinalTipGroup: savedOrdinalGroup,
      amount: individualAmount,
      transactionId: (responseData?.id ?? "") as string,
      lightningAddress: ordinal?.user?.lightningAddress,
      status: mapStatus(response?.message ?? PaymentStatus.FAILED),
      // imageURL: ordinal?.user?.imageURL ?? "",
      ...(!response?.status
        ? { error: `${response?.message} --- ${response?.data}`.slice(0, 250) }
        : {}),
    });

    if (!!response?.status) {
      const leaderboardRepository = dataSource.getRepository(LeaderboardTips);
      const userLeaderboard = await leaderboardRepository.findOneBy({
        user: { lightningAddress: ordinal?.user?.lightningAddress },
      });

      if (!!userLeaderboard) {
        userLeaderboard.totalTip = userLeaderboard.totalTip + individualAmount;
        await leaderboardRepository.save(userLeaderboard);
      } else {
        if (ordinal?.user) {
          const newLeaderboardUser = leaderboardRepository.create({
            user: ordinal?.user,
            totalTip: individualAmount,
          });
          await leaderboardRepository.save(newLeaderboardUser);
        }
      }

      if (!isAwait) {
        savedOrdinalGroup.totalSent =
          savedOrdinalGroup.totalSent + individualAmount;
        await ordinalTipsGroupsRepository.save(savedOrdinalGroup);
      }
    } else {
      // IN CASE THE PAYMENT FAILED WE SHOULD REDUCE THE TOTAL AMOUNT FROM THE ORDINAL GROU
      savedOrdinalGroup.totalSent = Math.max(
        0,
        savedOrdinalGroup.totalSent - individualAmount
      );
      await ordinalTipsGroupsRepository.save(ordinalGroup);

      if (!isAwait) {
        sendAppErrorMail({
          message: `
                An error occured while tipping ordinal collection ${
                  ordinalCollection?.numericId
                }.
    
                Below are some of the details:
    
                ${`${response?.message} --- ${response?.data}`.slice(0, 250)}
                `,
          subject: "An error occured while tipping an ordinal collection.",
        });
      }
    }

    await ordinalTipsRepository.save(ordinalTip);
    return response;
  };

  let awaitPossibleErrors: string[] = [];

  for (let i = 0; i < awaitOrdinals?.length; i++) {
    const response = await handlePayments({
      ordinal: awaitOrdinals?.[i],
      isAwait: true,
    });
    if (!response?.status) {
      awaitPossibleErrors.push(
        `${response?.message} --- ${response?.data}`.slice(0, 250)
      );
    }
  }

  if (awaitPossibleErrors?.length > 0) {
    sendAppErrorMail({
      message: `
            An error occured while tipping ordinal collection ${
              ordinalCollection?.numericId
            }.

            Below are some of the details:

            ${JSON.stringify(awaitPossibleErrors, undefined, 3)}
            `,
      subject: "An error occured while tipping an ordinal collection.",
    });
  }

  nonAwaitOrdinals?.forEach(async (ordinal) => {
    if (ordinal) {
      handlePayments({ isAwait: false, ordinal });
    }
  });

  currentBTCPrice = "";
  currentSource = "";

  // firstOTP.isUsed = true;
  // await adminOTPRepository.save(firstOTP);

  return res
    .status(201)
    .send(
      message(
        true,
        `Collection ${ordinalCollection?.numericId} tipped successfully.`,
        savedOrdinalGroup
      )
    );
};

export const generateTipOTP = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateGenerateTipOTP(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }
  const { purpose } = req.body as GenerateTipOTPReq;

  const adminRepository = dataSource.getRepository(Admins);

  const result = await adminRepository.find({ take: 1 });
  if (!result?.[0]) {
    return res.status(400).send(message(false, "No administrator found."));
  }

  const adminEmail = result?.[0]?.email;
  const otp = generateOTP();

  const adminOTPRepository = dataSource.getRepository(AdminOTPS);

  const newAdminOTP = adminOTPRepository.create({
    email: adminEmail,
    otp,
    purpose,
  });
  await adminOTPRepository.save(newAdminOTP);

  await sendOTPEmail({
    email: adminEmail,
    otp,
    subject: purpose + " verification.",
    title: "Hello Administrator! Help us verify it's you.😉 ",
  });

  return res.status(201).send(message(true, "OTP sent successfully."));
};

export const getAllTipGroups = async (req: Request, res: Response) => {
  const size = req.query?.size?.toString();
  const afterCursor = req.query?.cursor?.toString();
  const alias = "ordinalTipsGroups";

  const queryBuilder = dataSource
    .getRepository(OrdinalTipsGroups)
    .createQueryBuilder(alias)
    .leftJoinAndSelect(`${alias}.singleTip`, "singleTip")
    .leftJoinAndSelect(`${alias}.ordinalCollection`, "ordinalCollection");

  const paginator = buildPaginator({
    entity: OrdinalTipsGroups,
    alias,
    paginationKeys: ["createdAt", "id"],
    query: {
      limit: getMinAndMax(size ?? ""),
      ...(!!afterCursor ? { afterCursor } : {}),
    },
  });

  const { cursor, data } = await paginator.paginate(queryBuilder);

  return res.send(
    message(true, "Tip groups retrieved successfully.", data, {
      cursor,
    })
  );
};

export const getOrdinalTipsByGroupId = async (req: Request, res: Response) => {
  const id = req?.params?.id;
  const size = req?.query?.size?.toString();
  const afterCursor = req?.query?.cursor?.toString();
  const alias = "ordinalTips";

  // VALIDATE REQUEST
  const { error } = validateSingleDataByIdReq({ id });
  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const ordinalTipGroupRepository = dataSource.getRepository(OrdinalTipsGroups);
  const ordinalTipsGroup = await ordinalTipGroupRepository.findOneBy({ id });
  if (!ordinalTipsGroup) {
    return res
      .status(400)
      .send(
        message(
          false,
          "The ordinal tip group with the given id does not exist."
        )
      );
  }

  const queryBuilder = dataSource
    .getRepository(OrdinalTips)
    .createQueryBuilder(alias)
    .leftJoin(`${alias}.ordinalTipGroup`, "ordinalTipGroup")
    .where(`${alias}.ordinalTipGroup.id = :id`, { id });

  const paginator = buildPaginator({
    entity: OrdinalTips,
    alias,
    paginationKeys: ["createdAt", "id"],
    query: {
      limit: getMinAndMax(size ?? ""),
      ...(!!afterCursor ? { afterCursor } : {}),
    },
  });

  const { cursor, data } = await paginator.paginate(queryBuilder);
  return res.send(
    message(
      true,
      "Ordinal tips retrieved successfully.",
      { ordinalTipsGroup, ordinalTips: data },
      {
        cursor,
      }
    )
  );
};

function mapStatus(value: string): PaymentStatus {
  if (value === PaymentStatus.SUCCESS) return PaymentStatus.SUCCESS;
  if (value === PaymentStatus.PENDING) return PaymentStatus.PENDING;
  else return PaymentStatus.FAILED;
}
