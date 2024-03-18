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
