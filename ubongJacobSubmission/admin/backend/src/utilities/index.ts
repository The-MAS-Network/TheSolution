import { createId } from "@paralleldrive/cuid2";
import { customAlphabet } from "nanoid";

export const omitValuesFromObj = <T extends object, K extends keyof T>(
  param: T,
  keysToRemove: K[]
): Omit<T, K> => {
  return Object.entries(param).reduce((acc, [key, value]) => {
    return keysToRemove.includes(key as K) ? acc : { ...acc, [key]: value };
  }, {} as Omit<T, K>);
};

export function generateRandomNumber(min = 1_000, max = 9_999) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// "234678ABCDEFGHKMNPRTUVWXYabcdefghkmnprtuvwxy",

const alphabets = "234678ABCDEFGHKMNPRTUVWXY";

export function generatePrimaryKey() {
  const customId = customAlphabet(alphabets, 6);
  return createId() + customId();
}

export function generateOTP() {
  const cutomId = customAlphabet(alphabets?.toLowerCase() + "234678", 6);
  return cutomId();
}

// Function to format the difference in a user-friendly way
export function calculateTimeDifferenceInSeconds(value: Date) {
  const regStartDate = new Date(value);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  let milliseconds = currentDate.getTime() - regStartDate.getTime();

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  // String formatting (adjust as needed)
  const formattedDifference = `${days} days, ${hours
    .toString()
    .padStart(2, "0")} hours, ${minutes
    .toString()
    .padStart(2, "0")} minutes, and ${seconds
    .toString()
    .padStart(2, "0")} seconds`;

  return { formattedDifference, minutes, milliseconds };
}

export function removeHashAndComma(str: string) {
  return str.replace(/[#,]/g, "");
}
