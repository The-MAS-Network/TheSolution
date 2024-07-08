import { Request, Response } from "express";
import { buildPaginator } from "typeorm-cursor-pagination";
import { hiroSoBaseApi } from "../api/external.api";
import dataSource from "../db/data-source";
import { OrdinalCollections } from "../entities/ordinal/OrdinalCollections.entity";
import { Ordinals } from "../entities/ordinal/Ordinals.entity";
import { message } from "../middlewares/utility";
import {
  InscriptionErrorResponse,
  OrdinalsResponse,
  SpecificInscriptionResponse,
} from "../types/external.api.types";
import { CreateOrdinalReq, DeleteOrdinalReq } from "../types/ordinals";
import {
  GetOrdinalError,
  GetOrdinalsFromWalletAddress,
} from "../types/ordinals.types";
import { getMinAndMax, removeHashAndComma } from "../utilities";
import {
  validateCreateOrdinal,
  validateDeleteOrdinalReq,
  validateId,
  validateSingleDataByIdReq,
} from "../utilities/schemaValidators";
import { deleteOrdinalInDb, saveOrdinalByAdminInDb } from "./helpers/ordinals";
import { formatUserData } from "./user";

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

export const addOrdinalToCollection = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateCreateOrdinal(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }

  const {
    ordinalCollectionId,
    ordinalId,
    contentType,
    mimeType,
    possibleOrdinalContent,
  } = req.body as CreateOrdinalReq;

  const ordinalCollectionsRepository =
    dataSource.getRepository(OrdinalCollections);

  const ordinalCollection = await ordinalCollectionsRepository.findOneBy({
    id: ordinalCollectionId,
    ordinals: true,
  });

  if (!ordinalCollection) {
    return res
      .status(400)
      .send(
        message(
          false,
          "The ordinal collection with the given id does not exist."
        )
      );
  }

  if (ordinalCollection?.isActive) {
    return res
      .status(400)
      .send(message(false, "Sorry you can't add to an active collection."));
  }

  const ordinalInOrdinalCollection =
    await ordinalCollectionsRepository.findOneBy({
      id: ordinalCollectionId,
      ordinals: { ordinalId },
    });

  if (ordinalInOrdinalCollection) {
    return res
      .status(400)
      .send(
        message(
          false,
          "Ordinal with the given Id already exists in this collection."
        )
      );
  }

  await saveOrdinalByAdminInDb({
    ordinalCollections: [ordinalCollection],
    ordinalId,
    contentType,
    mimeType,
    isAdmin: true,
    possibleOrdinalContent:
      !!possibleOrdinalContent && possibleOrdinalContent?.length > 0
        ? possibleOrdinalContent
        : undefined,
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

  const size = req.query?.size?.toString();
  const afterCursor = req.query?.cursor?.toString();
  const alias = "ordinals";

  const ordinalsRepository = dataSource.getRepository(OrdinalCollections);
  const ordinalsCollection = await ordinalsRepository.findOneBy({
    id,
  });

  const queryBuilder = dataSource
    .getRepository(Ordinals)
    .createQueryBuilder(alias)
    .leftJoin(`${alias}.ordinalCollections`, "ordinalCollections")
    .where(`ordinalCollections.id = :id`, { id })
    .leftJoinAndSelect(`${alias}.user`, "user");

  const paginator = buildPaginator({
    entity: Ordinals,
    alias,
    paginationKeys: ["createdAt", "ordinalId"],
    query: {
      limit: getMinAndMax(size ?? ""),
      ...(!!afterCursor ? { afterCursor } : {}),
    },
  });

  const { cursor, data: ordinals } = await paginator.paginate(queryBuilder);

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

  const formattedOrdinals = ordianalWithData.map((data) => ({
    ...data,
    user: formatUserData(data?.user),
  }));

  return res.status(200).send(
    message(
      true,
      "Ordinals retrieved successfully.",
      { ordinalsCollection, ordinals: formattedOrdinals },
      {
        cursor,
      }
    )
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
  // VALIDATE REQUEST
  const { error } = validateDeleteOrdinalReq(req?.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const { ordinalCollectionId, ordinalId } = req?.body as DeleteOrdinalReq;

  const ordinalsRepository = dataSource.getRepository(Ordinals);
  const ordinal = await ordinalsRepository.findOne({
    where: { id: ordinalId, ordinalCollections: { id: ordinalCollectionId } },
    relations: { ordinalCollections: true },
  });

  if (!ordinal)
    return res
      .status(400)
      .send(
        message(
          false,
          "The ordinal or ordinal collection with the given id could not be found."
        )
      );

  const ordinalCollection = ordinal.ordinalCollections.find(
    ({ id }) => id === ordinalCollectionId
  );

  if (!!ordinalCollection?.isActive) {
    return res
      .status(400)
      .send(
        message(
          false,
          "Sorry you can't delete an ordinal in an active collection."
        )
      );
  }

  ordinal.ordinalCollections = ordinal.ordinalCollections.filter(
    (collection) => {
      return collection.id !== ordinalCollectionId;
    }
  );

  await ordinalsRepository.save(ordinal);

  deleteOrdinalInDb(ordinal.id);

  return res.status(200).send(message(true, "Ordinal deleted successfully."));
};
