import { Request, Response } from "express";
import { buildPaginator } from "typeorm-cursor-pagination";
import dataSource from "../../db/data-source";
import { OrdinalCollections } from "../../entities/ordinal/OrdinalCollections.entity";
import { Ordinals } from "../../entities/ordinal/Ordinals.entity";
import { message } from "../../middlewares/utility";
import { getMinAndMax, removeHashAndComma } from "../../utilities";
import {
  getOrdinalInCollectionByLightningAddressReq,
  validateGetCollectionsReq,
  validateSingleDataByIdReq,
} from "../../utilities/schemaValidators";
import { deleteOrdinalInDb } from "../helpers/ordinals";
import { OrdinalTipsGroups } from "../../entities/ordinal/OrdinalTipsGroups.entity";
import {
  InscriptionErrorResponse,
  SpecificInscriptionResponse,
} from "../../types/external.api.types";
import { hiroSoBaseApi } from "../../api/external.api";
import sendExternalMessage from "../../utilities/sendExternalMessage";
import { Users } from "../../entities/Users.entity";

export const getAllCollections = async (req: Request, res: Response) => {
  const status = req.query?.status?.toString();
  const size = req.query?.size?.toString();
  const afterCursor = req.query?.cursor?.toString();

  const collectionsRepository = dataSource.getRepository(OrdinalCollections);

  const isActiveReq = !!status && status === "active";

  if (!!status) {
    const { error } = validateGetCollectionsReq({ status });
    if (error)
      return res.status(400).send(message(false, error.details[0].message));
  }

  const alias = "ordinalCollections";

  const queryBuilder = collectionsRepository
    .createQueryBuilder(alias)
    .where(`${alias}.isActive = :isActiveReq`, { isActiveReq });

  const paginator = buildPaginator({
    entity: OrdinalCollections,
    alias,
    paginationKeys: ["createdAt", "id"],
    query: {
      limit: getMinAndMax(size ?? ""),
      ...(!!afterCursor ? { afterCursor } : {}),
    },
  });

  const { cursor, data } = await paginator.paginate(queryBuilder);

  return res.status(200).send(
    message(
      true,
      `${
        isActiveReq ? "Active" : "Inactive"
      } collections retrieved successfully.`,
      data,
      {
        cursor,
      }
    )
  );
};

export const createCollection = async (req: Request, res: Response) => {
  const newCollection = new OrdinalCollections();

  const collectionsRepository = dataSource.getRepository(OrdinalCollections);

  const collection = await collectionsRepository.save(newCollection);

  return res
    .status(201)
    .send(message(true, "Collections created successfully.", collection));
};

export const deleteCollection = async (req: Request, res: Response) => {
  const id = req?.params?.id;
  // VALIDATE REQUEST
  const { error } = validateSingleDataByIdReq({ id });

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  if (!id) return res.status(400).send(message(false, "Inavlid Id"));

  const collectionsRepository = dataSource.getRepository(OrdinalCollections);

  const collection = await collectionsRepository.findOne({
    where: { id },
    relations: { ordinals: true },
  });

  if (!collection)
    return res
      .status(400)
      .send(
        message(false, "The collection with the given id could not be found.")
      );

  const tipGroupsRepository = dataSource.getRepository(OrdinalTipsGroups);

  const ordinalTipGroups = await tipGroupsRepository.findOneBy({
    ordinalCollection: { id },
  });

  if (!!ordinalTipGroups) {
    return res
      .status(400)
      .send(
        message(
          false,
          "The ordinal collection could not be deleted as it has previous tipping history."
        )
      );
  }

  const ordinalsIdsInCollection = collection?.ordinals?.map(({ id }) => id);

  await collectionsRepository.remove(collection);

  ordinalsIdsInCollection.forEach((id) => {
    deleteOrdinalInDb(id);
  });

  return res
    .status(200)
    .send(message(true, "Collection deleted successfully."));
};

export const toggleOrdinalCollectionStatus = async (
  req: Request,
  res: Response
) => {
  const id = req?.params?.id;
  // VALIDATE REQUEST
  const { error } = validateSingleDataByIdReq({ id });

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  if (!id) return res.status(400).send(message(false, "Inavlid Id"));

  const collectionsRepository = dataSource.getRepository(OrdinalCollections);

  const collection = await collectionsRepository.findOneBy({ id });

  if (!collection)
    return res
      .status(400)
      .send(
        message(false, "The collection with the given id could not be found.")
      );

  collection.isActive = !collection.isActive;

  await collectionsRepository.save(collection);

  return res
    .status(200)
    .send(
      message(
        true,
        `Collection ${
          collection.isActive ? "deactivated" : "activated"
        } successfully.`
      )
    );
};

export const rescanOrdinalsInCollection = async (
  req: Request,
  res: Response
) => {
  const id = req?.params?.id;
  // VALIDATE REQUEST
  const { error } = validateSingleDataByIdReq({ id });

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  if (!id) return res.status(400).send(message(false, "Inavlid Id"));

  const collectionsRepository = dataSource.getRepository(OrdinalCollections);

  const collection = await collectionsRepository.findOne({
    where: { id },
    relations: {
      ordinals: true,
    },
  });

  if (!collection)
    return res
      .status(400)
      .send(
        message(false, "The collection with the given id could not be found.")
      );

  if (!collection?.isActive)
    return res
      .status(400)
      .send(message(false, "The collection with the given id is inactive."));
  const ordinalsInCollection = collection?.ordinals;

  if (!ordinalsInCollection || ordinalsInCollection?.length < 1)
    return res
      .status(400)
      .send(
        message(false, "The collection with the given id has no ordinals.")
      );

  const usersRepository = dataSource.getRepository(Users);
  const ordinalsRepository = dataSource.getRepository(Ordinals);

  let isError = false;

  for (let i = 0; i < ordinalsInCollection?.length; i++) {
    // Get ordinal details from ordinal id
    const ordinalId = ordinalsInCollection?.[i].ordinalId;
    console.log("ordinalId", ordinalId);
    const response = await hiroSoBaseApi.get<
      SpecificInscriptionResponse,
      InscriptionErrorResponse
    >(`/inscriptions/${removeHashAndComma(ordinalId)}`);
    // console.log("response ", response?.data);

    if (response?.ok && response?.data) {
      const walletAddress = response?.data?.address;

      const user = await usersRepository.findOne({
        relations: { ordinalWallet: true },
        where: { ordinalWallet: { address: walletAddress } },
      });

      // console.log("User with ordinal wallet address", user);
      const ordinal = await ordinalsRepository?.findOne({
        relations: { user: true },
        where: { ordinalId },
      });
      // console.log("Ordinal with ordinal ID", ordinal);
      if (ordinal) {
        if (user) {
          if (user?.id !== ordinal?.user?.id) {
            ordinal.user = user;
          }
        } else {
          if (ordinal?.user) {
            console.log("Unclaimed");
            ordinal.user = null;
          }
        }

        await ordinalsRepository.save(ordinal);
      }
    } else {
      isError = true;
      sendExternalMessage(`Could not recan ordinal with id ${ordinalId}`);
    }
  }

  const errorMessage = isError
    ? "Some ordinals in the collection was scanned successfully. Check discord or email for details of fail scan."
    : "Ordinals in ordinal collection scanned successfully.";

  return res.status(200).send(message(true, errorMessage));
};

export const getTotalOrdinalsInACollection = async (
  req: Request,
  res: Response
) => {
  const id = req?.params?.id;
  // VALIDATE REQUEST
  const { error } = validateSingleDataByIdReq({ id });
  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const ordinalsRepository = dataSource.getRepository(Ordinals);

  const ordinalsCount = await ordinalsRepository.countBy({
    ordinalCollections: { id },
  });

  return res
    .status(200)
    .send(
      message(
        true,
        "Total ordinals in a collection retrieved successfully.",
        ordinalsCount
      )
    );
};

export const getOrdinalsInCollectionByLightningAddress = async (
  req: Request,
  res: Response
) => {
  const lightningAddress = req.query?.address?.toString();
  const collectionId = req.query?.collectionId?.toString();
  // VALIDATE REQUEST
  const { error } = getOrdinalInCollectionByLightningAddressReq({
    collectionId,
    lightningAddress,
  });
  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const ordinalsRepository = dataSource.getRepository(Ordinals);

  const ordinals = await ordinalsRepository.find({
    where: {
      // lightningAddress,
      ordinalCollections: { id: collectionId },
      user: { lightningAddress },
    },
  });
  return res
    .status(200)
    .send(message(true, `Ordinals retrieved successfully.`, ordinals));
};
