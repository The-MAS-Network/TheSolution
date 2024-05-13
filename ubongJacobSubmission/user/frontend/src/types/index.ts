import { CreateInvoicePurpose, VerifyInvoiceParams } from "./api/auth.types";

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
  modalChildComponent?: JSX.Element;
  shouldBackgroundClose?: boolean;
}

export interface ChangePasswordPageState {
  token: string;
}
export interface VerifyLightningAddressPageState {
  lightningAddress: string;
  invoiceId: string;
  purpose: CreateInvoicePurpose;
}

export interface SatsReceivedPageState extends VerifyInvoiceParams {
  purpose: CreateInvoicePurpose;
}
