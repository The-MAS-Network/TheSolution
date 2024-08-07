export function calculateTimeDifference(value: string | Date) {
  const inputDate = new Date(value);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const milliseconds = currentDate.getTime() - inputDate.getTime();

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const newHours = milliseconds / (1000 * 60 * 60);
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

  return { formattedDifference, milliseconds, hours, newHours, minutes };
}
