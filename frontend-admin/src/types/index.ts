import { AppPromptModalProps } from "@/components/modals/AppPromptModal";

export interface CurrentLanguageDetails {
  countryName: string;
  languageCode: string;
  countryFlag: string;
  language: string;
}

export interface ILocationParams<Data> {
  pathname: string;
  state: Data;
  search: string;
  hash: string;
  key: string;
}

export interface AppModalProps {
  modalType: "EMPTY_MODAL" | "PROMPT_MODAL" | "REASON_MODAL";
  shouldBackgroundClose?: boolean;
  emptyModalComponent?: JSX.Element;
  promptModal?: AppPromptModalProps;
}

type ChangePasswordPurpose = "Change Password" | "Set New Password";

export interface ChangePasswordPageState {
  token: string;
  purpose: ChangePasswordPurpose;
  id?: string;
}
export interface VerifyOTPPageState {
  email: string;
  purpose: ChangePasswordPurpose;
}
export interface OrdinalsCollectionPageState {
  collectionIndex: number;
}

export type QuickActionTypes = "Type one" | "Type Two";

export interface QuickActionOption {
  icon?: string;
  title: string;
  onClick: () => void;
  shouldBackgroundNotClose?: boolean;
}
