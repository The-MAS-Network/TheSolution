export const handleApiErrors = (
  props: any,
  falbackMessage?: string,
): string => {
  const message =
    props.data?.message ??
    falbackMessage ??
    props.problem ??
    "FATAL: Invalid error received.";

  return message;
};
