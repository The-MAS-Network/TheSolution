import Joi from "joi";

export function addSpaceBeforeCapitalLetters(str: string) {
  return str.replace(/([A-Z])/g, " $1").trim();
}

export function generateRandomNumber(min: number, max: number) {
  // Generate a random number between min (inclusive) and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const convertSVGtoURL = (value: string) => {
  const svg = new Blob([value], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svg);
  return url;
};

export const joiPasswordValidation = Joi.string()
  .min(8)
  .max(255)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain at least one lowercase letter, one uppercase letter, and one number.",
    "any.required": "Password is required.",
  });

export const joiLightningSchema = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: false,
  })
  .required()
  .min(3)
  .max(250)
  .messages({
    "string.email": "Lightning address is invalid.",
  });
