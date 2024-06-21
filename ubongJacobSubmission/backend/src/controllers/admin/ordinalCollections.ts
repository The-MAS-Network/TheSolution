import { Request, Response } from "express";
import { buildPaginator } from "typeorm-cursor-pagination";
import dataSource from "../../db/data-source";
import { OrdinalCollections } from "../../entities/ordinal/OrdinalCollections.entity";
import { Ordinals } from "../../entities/ordinal/Ordinals.entity";
import { message } from "../../middlewares/utility";
import { getMinAndMax } from "../../utilities";
import {
  getOrdinalInCollectionByLightningAddressReq,
  validateGetCollectionsReq,
  validateSingleDataByIdReq,
} from "../../utilities/schemaValidators";
import { deleteOrdinalInDb } from "../helpers/ordinals";

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
      lightningAddress,
      ordinalCollections: { id: collectionId },
    },
  });
  return res
    .status(200)
    .send(message(true, `Ordinals retrieved successfully.`, ordinals));
};
