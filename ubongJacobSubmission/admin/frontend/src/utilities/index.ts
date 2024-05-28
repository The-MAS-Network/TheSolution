import Joi from "joi";
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
};

export async function pasteFromClipboard() {
  const text = await navigator.clipboard.readText();
  return text;
}

export function copyTextToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(function () {
      appToast.Success("Link successfully copied to clipboard");
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

type OrdinalContentTypes = "Image" | "HTML" | "Text" | "Unknown";

interface CheckOrdinalContentTypeProps {
  mime_type: string;
  content_type: string;
}

export function CheckOrdinalContentType({
  content_type: contentType,
  mime_type: mimeType,
}: CheckOrdinalContentTypeProps): OrdinalContentTypes {
  const htmlDataTypes = ["text/html", "text/html;charset=utf-8"];

  const textDataTypes = [
    "application/json",
    "application/json;charset=utf-8",
    "text/plain",
    "text/plain;charset=utf-8",
  ];

  const imageDataTypes = [
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
    "image/jpeg",
    "image/svg+xml",
  ];

  const threeDimensionDataTypes = ["model/gltf+json"];

  if (
    threeDimensionDataTypes.includes(mimeType) ||
    threeDimensionDataTypes.includes(contentType)
  ) {
    return "Unknown";
  }

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
    contentType.includes("plain") || mimeType.includes("plain"))
  ) {
    return "Text";
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
