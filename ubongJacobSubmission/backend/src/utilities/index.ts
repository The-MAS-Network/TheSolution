import { createId } from "@paralleldrive/cuid2";
import { AdminOTPS } from "../entities/admin/AdminOTPs.entity";

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

export function convertValueToSats(value: number) {
  const satoshiPerBitcoin = 100_000_000; //THIS MEANS THAT 100 MILLION SATOSHIS MAKES ONE BITCOIN

  return value / satoshiPerBitcoin;
}

export function getRandomPercentage() {
  // Generate a random number between 0 (inclusive) and 1 (exclusive)
  const randomNumber = Math.random();

  // Scale the random number to be between 2.0 (inclusive) and 8.0 (exclusive)
  const scaledNumber = randomNumber * 6 + 2;

  // Return the scaled number with one decimal place

  return parseFloat((scaledNumber / 10).toFixed(3));
}

// Function to format the difference in a user-friendly way
export function calculateDateTimeDifference(value: Date) {
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

const alphabets = "234678ABCDEFGHKMNPRTUVWXY";

export function generatePrimaryKey() {
  return createId() + generateRandomId(alphabets);
}

export function generateOTP() {
  return generateRandomId(alphabets?.toLowerCase() + "234678");
}

function generateRandomId(alphabets: string, size = 6) {
  const minSize = 2;
  const minAlphaLength = 10;
  const max = alphabets?.length;
  const min = 1;
  let id = "";

  if (size < minSize) throw new Error(`Minimum size should be ${minSize}`);
  if (alphabets.length < 10)
    throw new Error(`Minimum alphabets should be ${minAlphaLength}`);

  for (let i = 0; i < size; i++) {
    const index = Math.floor(Math.random() * (max - min + 1)) + min;
    id = id + alphabets[index - 1];
  }

  return id;
}

export function removeHashAndComma(str: string) {
  return str.replace(/[#,]/g, "");
}

interface ValidateOTPProps {
  dbOTP: AdminOTPS;
  OTP: string;
  expiryTimeInMinutes?: number;
  purpose?: string;
}

export function validateOTP(props: ValidateOTPProps): string | null {
  const { OTP, dbOTP, expiryTimeInMinutes = 10, purpose } = props;

  if (!dbOTP) "No Otp found.";

  if (dbOTP.otp?.toLowerCase() !== OTP?.toLowerCase()) return "Invalid OTP.";

  if (!!purpose && dbOTP?.purpose !== purpose) return "Invalid OTP.";

  if (!!dbOTP?.isUsed) return "OTP already used.";

  if (
    calculateDateTimeDifference(dbOTP?.createdAt).minutes > expiryTimeInMinutes
  )
    return "Expired OTP.";

  return null;
}

export const getISOTimeInHours = (hours = 2) =>
  new Date(Date.now() + Math.max(hours, 1) * 60 * 60 * 1000).toISOString();

export const getMinAndMax = (size: string): number => {
  const value = Number(size);
  const values = {
    min: 10,
    default: 20,
    max: 100,
  };
  if (isNaN(value)) return values?.default;

  if (value >= values?.max) return values?.max;
  if (value <= values?.min) return values?.min;
  return value;
};

interface ConvertAmountToSatsFromCurrentBtcPrice {
  dollarAmount: number;
  currentBTCPrice: string;
}

export function convertAmountToSatsFromCurrentBtcPrice({
  currentBTCPrice,
  dollarAmount,
}: ConvertAmountToSatsFromCurrentBtcPrice) {
  if (dollarAmount <= 0) {
    return 0;
  }
  const price = Number(currentBTCPrice);

  if (isNaN(price) || !price) return 0;

  const numberOfCoins = dollarAmount / price;
  const satoshiPerBitcoin = 100_000_000; //THIS MEANS THAT 100 MILLION SATOSHIS MAKES ONE BITCOIN
  const number_of_satoshis = numberOfCoins * satoshiPerBitcoin;

  return Math.floor(number_of_satoshis);
}
