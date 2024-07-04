import { appToast } from "./appToast";

export const handleApiErrors = (props: any, falbackMessage?: string) => {
  const message =
    props.data?.message ??
    props?.message ??
    falbackMessage ??
    props.problem ??
    "FATAL: Invalid error received.";

  const newMessage = props.data?.message ?? JSON.stringify(message);

  appToast.Error(newMessage);
};
