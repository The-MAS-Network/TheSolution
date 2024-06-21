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
  modalType: "Type one";
  title?: string;
  description?: string;
  onAcceptClick?: () => void;
  acceptTitle?: string;
  modalOneComponent?: JSX.Element;
  shouldBackgroundClose?: boolean;
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
