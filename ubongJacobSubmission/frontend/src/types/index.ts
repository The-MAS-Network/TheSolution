export interface CurrentLanguageDetails {
  countryName: string;
  languageCode: string;
  countryFlag: string;
  language: string;
}

export interface NickNamePageState {
  password: string;
  lightningAddress: string;
}

export interface ILocationParams<Data> {
  pathname: string;
  state: Data;
  search: string;
  hash: string;
  key: string;
}

export interface AppModalProps {
  modalType: "Type one" | "Type two" | "Type three";
  title?: string;
  description?: string;
  onAcceptClick?: () => void;
  acceptTitle?: string;
  modalOneComponent?: JSX.Element;
  shouldBackgroundClose?: boolean;
}
