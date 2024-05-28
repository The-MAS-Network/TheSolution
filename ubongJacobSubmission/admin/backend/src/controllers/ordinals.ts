import { Request, Response } from "express";
import { db } from "../drizzle/db";
import { OrdinalsTable } from "../drizzle/schema";
import { message } from "../middlewares/utility";
import { eq } from "drizzle-orm";
import {
  validateCreateOrdinal,
  validateSingleDataByIdReq,
} from "../utilities/schemaValidators";
import { CreateOrdinalReq } from "../types/ordinals";
import { hiroSoBaseApi } from "../api/external.api";
import {
  InscriptionErrorResponse,
  OrdinalsResponse,
  SpecificInscriptionResponse,
} from "../types/external.api.types";
import { removeHashAndComma } from "../utilities";

export const addOrdinalToCollection = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateCreateOrdinal(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }

  const {
    ordinalCollectionId,
    ordinalId,
    ordinalNumber,
    contentType,
    mimeType,
    possibleOrdinalContent,
  } = req.body as CreateOrdinalReq;

  const ordinals = await db.query.OrdinalsTable.findMany({
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    columns: { createdAt: false, updatedAt: false },
    with: { ordinalCollection: true },

    where: ({ ordinalCollectionId: OID }) => eq(OID, ordinalCollectionId),
  });

  if (ordinals?.length > 0) {
    if (!!ordinals?.[0]?.ordinalCollection?.isActive) {
      return res
        .status(400)
        .send(message(false, "Sorry you can't add to an active collection."));
    }

    for (let i = 0; i < ordinalNumber.length; i++) {
      if (
        ordinals[i]?.ordinalId == ordinalId ||
        ordinals[i]?.ordinalNumber == ordinalNumber
      ) {
        return res
          .status(400)
          .send(
            message(
              false,
              "Ordinal with the given Id or number already exists in this collection."
            )
          );
      }
    }
  }

  await db.insert(OrdinalsTable).values({
    ordinalId,
    ordinalNumber,
    ordinalCollectionId,
    contentType,
    mimeType,
    possibleOrdinalContent:
      !!possibleOrdinalContent && possibleOrdinalContent?.length > 0
        ? possibleOrdinalContent
        : null,
  });

  return res
    .status(201)
    .send(message(true, "Ordinal added to collection successfully."));
};

export const getOrdinalsFromCollectionId = async (
  req: Request,
  res: Response
) => {
  const id = req?.params?.id;
  // VALIDATE REQUEST
  const { error } = validateSingleDataByIdReq({ id });
  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const ordinals = await db.query.OrdinalsTable.findMany({
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    columns: { createdAt: false, updatedAt: false },
    with: {
      ordinalCollection: { columns: { createdAt: false, updatedAt: false } },
    },
    where: ({ ordinalCollectionId }) => eq(ordinalCollectionId, id),
  });

  let ordianalWithData: any[] = [];

  if (ordinals?.length > 0) {
    for (let ordinalDetail of ordinals) {
      if (!!ordinalDetail?.possibleOrdinalContent) {
        ordianalWithData.push(ordinalDetail);
      } else {
        const response = await hiroSoBaseApi.get<any, InscriptionErrorResponse>(
          `/inscriptions/${ordinalDetail?.ordinalId}/content`
        );

        if (!response.ok) ordianalWithData.push(ordinalDetail);
        else {
          ordianalWithData.push({
            ...ordinalDetail,
            possibleOrdinalContent: response?.data,
          });
        }
      }
    }
  }

  return res.status(200).send(
    message(true, "Ordinals retrieved successfully.", ordianalWithData, {
      page: 1,
      size: ordinals.length,
      totalItems: ordinals.length,
      totalPages: 1,
    })
  );
};

export const getSingleOrdinalOrOrdinalWalletData = async (
  req: Request,
  res: Response
) => {
  const id = req?.params?.id;
  const { error } = validateSingleDataByIdReq({ id }, 150);
  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const response = await hiroSoBaseApi.get<
    SpecificInscriptionResponse,
    InscriptionErrorResponse
  >(`/inscriptions/${removeHashAndComma(id)}`);

  if (response?.ok) {
    return res.status(200).send(
      message(true, "Inscription data retrieved successfully.", {
        limit: 1,
        offset: 0,
        total: 1,
        results: [response?.data],
      })
    );
  }

  const walletResponse = await hiroSoBaseApi.get<
    OrdinalsResponse,
    InscriptionErrorResponse
  >(`/inscriptions?address=${id}`);

  if (walletResponse?.ok) {
    return res
      .status(200)
      .send(
        message(
          true,
          "Ordinal wallet data retrieved successfully.",
          walletResponse?.data
        )
      );
  }

  return res
    .status(503)
    .send(
      message(
        false,
        response?.data?.error ??
          "An error occured when getting inscription details."
      )
    );
};

export const deleteOrdinal = async (req: Request, res: Response) => {
  const id = req?.params?.id;
  // VALIDATE REQUEST
  const { error } = validateSingleDataByIdReq({ id });

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  if (!id) return res.status(400).send(message(false, "Inavlid Id"));

  const ordinal = await db.query.OrdinalsTable.findFirst({
    where: ({ id: DBID }, { eq }) => eq(DBID, id),
    with: { ordinalCollection: true },
  });

  if (!!ordinal?.ordinalCollection?.isActive) {
    return res
      .status(400)
      .send(
        message(
          false,
          "Sorry you can't delete an ordinal in an active collection."
        )
      );
  }

  if (!ordinal)
    return res
      .status(400)
      .send(
        message(false, "The ordinal with the given id could not be found.")
      );

  await db.delete(OrdinalsTable).where(eq(OrdinalsTable.id, id));

  return res.status(200).send(message(true, "Ordinal deleted successfully."));
};
