import { appToast } from "./appToast";

export const handleApiErrors = (props: any, falbackMessage?: string) => {
  const message =
    props.data?.message ??
    props?.message ??
    falbackMessage ??
    props.problem ??
    "FATAL: Invalid error received.";

  appToast.Error(JSON.stringify(message));
};
