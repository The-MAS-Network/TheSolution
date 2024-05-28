import { CurrentLanguageDetails } from "@/types";

const demoLanguages: CurrentLanguageDetails[] = [
  {
    countryName: "United Kingdom (British)",
    languageCode: "en",
    countryFlag: "emojione-v1:flag-for-united-states",
    language: "English",
  },
  {
    countryName: "Spanish (Español)",
    languageCode: "es",
    countryFlag: "emojione-v1:flag-for-spain",
    language: "Spanish",
  },
  {
    countryName: "France (French)",
    languageCode: "fr",
    countryFlag: "emojione-v1:flag-for-france",
    language: "French",
  },
  {
    countryName: "Japan",
    languageCode: "ja",
    countryFlag: "emojione-v1:flag-for-japan",
    language: "Japanese",
  },
  {
    countryName: "Norway",
    languageCode: "no",
    countryFlag: "emojione-v1:flag-for-norway",
    language: "Norwegian",
  },
  {
    countryName: "Germany",
    languageCode: "de",
    countryFlag: "emojione-v1:flag-for-germany",
    language: "German",
  },
  {
    countryName: "Russia",
    languageCode: "ru",
    countryFlag: "emojione-v1:flag-for-russia",
    language: "Russian",
  },
  {
    countryName: "Poland",
    languageCode: "pl",
    countryFlag: "emojione-v1:flag-for-poland",
    language: "Polish",
  },
  {
    countryName: "Italy",
    languageCode: "it",
    countryFlag: "emojione-v1:flag-for-italy",
    language: "Italian",
  },
  {
    countryName: "(Portugal, Brazil)",
    languageCode: "pt",
    countryFlag: "emojione-v1:flag-for-portugal",
    language: "Portuguese",
  },
] as const;

export default demoLanguages;
