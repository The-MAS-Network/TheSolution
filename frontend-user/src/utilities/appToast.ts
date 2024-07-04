import { toast, ExternalToast } from "sonner";

const Default = (message: string, options?: ExternalToast) =>
  toast(message, { ...options });

const Error = (message: string, options?: ExternalToast) =>
  toast.error(message, { ...options });

const Info = (message: string, options?: ExternalToast) =>
  toast.info(message, { ...options });

const Success = (message: string, options?: ExternalToast) =>
  toast.success(message, { ...options });

const Warning = (message: string, options?: ExternalToast) =>
  toast.warning(message, { ...options });

export const appToast = { Default, Warning, Success, Info, Error };
