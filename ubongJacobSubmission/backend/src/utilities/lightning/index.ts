export function convertNumbTO64Int(num: number) {
  const floatValue = 0.000753;

  // Find the number of decimal places
  const decimalPlaces = num?.toString().split(".")[1].length;

  // Calculate the multiplier to shift the decimal point to the right
  const multiplier = Math.pow(10, decimalPlaces);

  // Multiply the floating-point number by the multiplier
  const intValue = floatValue * multiplier;

  // Convert to int64 if necessary
  const int64Value = BigInt(parseInt(intValue?.toString()));

  return int64Value;
}

export function convertStringTo32Byte(string: string) {
  const byteArray = new TextEncoder().encode(string);
  const result = byteArray.slice(0, 32);

  return result;
}
