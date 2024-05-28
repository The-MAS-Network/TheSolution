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
