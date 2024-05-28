import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "../drizzle/db";
import { OrdinalCollectionsTable } from "../drizzle/schema";
import { message } from "../middlewares/utility";
import {
  validateGetCollectionsReq,
  validateSingleDataByIdReq,
} from "../utilities/schemaValidators";

export const getAllCollections = async (req: Request, res: Response) => {
  const status = req.query?.status?.toString();

  if (!!status) {
    const { error } = validateGetCollectionsReq({ status });
    if (error)
      return res.status(400).send(message(false, error.details[0].message));

    const isActiveReq = status === "active";

    const collections = await db.query.OrdinalCollectionsTable.findMany({
      orderBy: ({ createdAt }, { desc }) => desc(createdAt),
      columns: { createdAt: false, updatedAt: false },
      where: ({ isActive }, { eq }) => eq(isActive, isActiveReq),
    });

    return res.status(200).send(
      message(
        true,
        `${
          isActiveReq ? "Active" : "Inactive"
        } collections retrieved successfully.`,
        collections,
        {
          page: 1,
          size: collections.length,
          totalItems: collections.length,
          totalPages: 1,
        }
      )
    );
  }

  const collections = await db.query.OrdinalCollectionsTable.findMany({
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    columns: { createdAt: false, updatedAt: false },
  });

  return res.status(200).send(
    message(true, "Collections retrieved successfully.", collections, {
      page: 1,
      size: collections.length,
      totalItems: collections.length,
      totalPages: 1,
    })
  );
};

export const createCollection = async (req: Request, res: Response) => {
  await db.insert(OrdinalCollectionsTable).values({});

  const collectionId = await db.query.OrdinalCollectionsTable.findFirst({
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    columns: { createdAt: false, updatedAt: false },
  });

  return res
    .status(201)
    .send(message(true, "Collections created successfully.", collectionId));
};

export const deleteCollection = async (req: Request, res: Response) => {
  const id = req?.params?.id;
  // VALIDATE REQUEST
  const { error } = validateSingleDataByIdReq({ id });

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  if (!id) return res.status(400).send(message(false, "Inavlid Id"));

  const collection = await db.query.OrdinalCollectionsTable.findFirst({
    where: ({ id: DBID }, { eq }) => eq(DBID, id),
  });

  if (!collection)
    return res
      .status(400)
      .send(
        message(false, "The collection with the given id could not be found.")
      );

  // const ordinals = await db.query.OrdinalsTable.findFirst({
  //   where: ({ ordinalCollectionId }) => eq(ordinalCollectionId, id),
  // });

  // if (!!ordinals)
  //   return res
  //     .status(400)
  //     .send(
  //       message(
  //         false,
  //         "Collection with the given id contains some ordinals. Delete all ordinals in the collection before deleteing the collection."
  //       )
  //     );

  await db
    .delete(OrdinalCollectionsTable)
    .where(eq(OrdinalCollectionsTable.id, id));

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

  const collection = await db.query.OrdinalCollectionsTable.findFirst({
    where: ({ id: DBID }, { eq }) => eq(DBID, id),
  });

  if (!collection)
    return res
      .status(400)
      .send(
        message(false, "The collection with the given id could not be found.")
      );

  await db
    .update(OrdinalCollectionsTable)
    .set({ isActive: !collection?.isActive })
    .where(eq(OrdinalCollectionsTable.id, id));

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

  const ordinals = await db.query.OrdinalsTable.findMany({
    where: ({ ordinalCollectionId }) => eq(ordinalCollectionId, id),
  });

  return res
    .status(200)
    .send(
      message(
        true,
        "Total ordinals in a collection retrieved successfully.",
        ordinals?.length
      )
    );
};
