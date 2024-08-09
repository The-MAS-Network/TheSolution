import Joi, { Schema } from "joi";
import { appToast } from "./appToast";

export function addSpaceBeforeCapitalLetters(str: string) {
  return str?.replace(/([A-Z])/g, " $1")?.trim();
}

export function generateRandomNumber(min: number, max: number) {
  // Generate a random number between min (inclusive) and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const joiSchemas = {
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: false,
    })
    .required()
    .min(3)
    .max(250),

  password: Joi.string().min(6).max(255).required(),

  // DO NOT MAKE REQUIRED
  otp: Joi.string().length(6),

  strictPassword: Joi.string()
    .min(8)
    .max(255)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, and one number.",
      "any.required": "Password is required.",
    }),

  lightning: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: false,
    })
    .required()
    .min(3)
    .max(250)
    .messages({
      "string.email": "Lightning address is invalid.",
    }),
};

export async function pasteFromClipboard() {
  const text = await navigator.clipboard.readText();
  return text;
}

export function copyTextToClipboard(text: string, successMessage?: string) {
  navigator.clipboard
    .writeText(text)
    .then(function () {
      appToast.Success(
        successMessage ?? "Link successfully copied to clipboard",
      );
    })
    .catch(function (err) {
      appToast.Error(`Unable to copy text to clipboard ${err}`);
    });
}

export function removeHashAndComma(str: string) {
  return str.replace(/[#,]/g, "");
}

export const generateOrdinalContentLink = (id: string) =>
  "https://ordiscan.com/content/" + id;

export const generateOrdinalShareLink = (num: string) => `ord.link/${num}`;

type OrdinalContentTypes = "Image" | "HTML" | "Text" | "Unknown" | "JSON";

interface CheckOrdinalContentTypeProps {
  mime_type: string;
  content_type: string;
}

export const checkTextOrdinalType = (value: any) =>
  typeof value === "string" ? true : false;

export function CheckOrdinalContentType({
  content_type: contentType,
  mime_type: mimeType,
}: CheckOrdinalContentTypeProps): OrdinalContentTypes {
  const htmlDataTypes = ["text/html", "text/html;charset=utf-8"];

  const jsonDataTypes = ["application/json", "application/json;charset=utf-8"];

  const textDataTypes = ["text/plain", "text/plain;charset=utf-8"];

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
  if (
    (textDataTypes.includes(mimeType) || textDataTypes.includes(contentType),
    contentType.includes("text") || mimeType.includes("text"))
  ) {
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

export function truncateText(text: string, maxLength = 200) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  } else {
    return text;
  }
}

export function truncateWalletAddress(text: string) {
  if (text.length > 17) {
    return `${text.substring(0, 7)}...${text.substring(text.length - 11)}`;
  } else {
    return text;
  }
}

interface ValidateLightningAddressProps {
  lightningAddress: string;
}

export function validateLightningAddress(param: ValidateLightningAddressProps) {
  const data: Partial<Record<keyof ValidateLightningAddressProps, Schema>> = {
    lightningAddress: joiSchemas.lightning,
  };

  const schema = Joi.object<ValidateLightningAddressProps>(data);
  return schema.validate(param);
}

export const parseString = (value: unknown) => {
  if (typeof value === "string") {
    if (isJsonString(value)) return JSON.parse(value);
    else return value;
  } else {
    return JSON.stringify(value);
  }
};

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
