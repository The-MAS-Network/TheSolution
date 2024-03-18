import { countries } from "./countries";

const languages = [
  {
    name: "Abkhazian",
    code: "ab",
  },
  {
    name: "Afar",
    code: "aa",
  },
  {
    name: "Afrikaans",
    code: "af",
  },
  {
    name: "Akan",
    code: "ak",
  },
  {
    name: "Albanian",
    code: "sq",
  },
  {
    name: "Amharic",
    code: "am",
  },
  {
    name: "Arabic",
    code: "ar",
  },
  {
    name: "Aragonese",
    code: "an",
  },
  {
    name: "Armenian",
    code: "hy",
  },
  {
    name: "Assamese",
    code: "as",
  },
  {
    name: "Avaric",
    code: "av",
  },
  {
    name: "Avestan",
    code: "ae",
  },
  {
    name: "Aymara",
    code: "ay",
  },
  {
    name: "Azerbaijani",
    code: "az",
  },
  {
    name: "Bambara",
    code: "bm",
  },
  {
    name: "Bashkir",
    code: "ba",
  },
  {
    name: "Basque",
    code: "eu",
  },
  {
    name: "Belarusian",
    code: "be",
  },
  {
    name: "Bengali",
    code: "bn",
  },
  {
    name: "Bislama",
    code: "bi",
  },
  {
    name: "Bosnian",
    code: "bs",
  },
  {
    name: "Breton",
    code: "br",
  },
  {
    name: "Bulgarian",
    code: "bg",
  },
  {
    name: "Burmese",
    code: "my",
  },
  {
    name: "Catalan, Valencian",
    code: "ca",
  },
  {
    name: "Chamorro",
    code: "ch",
  },
  {
    name: "Chechen",
    code: "ce",
  },
  {
    name: "Chichewa, Chewa, Nyanja",
    code: "ny",
  },
  {
    name: "Chinese",
    code: "zh",
  },
  {
    name: "Church Slavonic, Old Slavonic, Old Church Slavonic",
    code: "cu",
  },
  {
    name: "Chuvash",
    code: "cv",
  },
  {
    name: "Cornish",
    code: "kw",
  },
  {
    name: "Corsican",
    code: "co",
  },
  {
    name: "Cree",
    code: "cr",
  },
  {
    name: "Croatian",
    code: "hr",
  },
  {
    name: "Czech",
    code: "cs",
  },
  {
    name: "Danish",
    code: "da",
  },
  {
    name: "Divehi, Dhivehi, Maldivian",
    code: "dv",
  },
  {
    name: "Dutch, Flemish",
    code: "nl",
  },
  {
    name: "Dzongkha",
    code: "dz",
  },
  {
    name: "English",
    code: "en",
  },
  {
    name: "Esperanto",
    code: "eo",
  },
  {
    name: "Estonian",
    code: "et",
  },
  {
    name: "Ewe",
    code: "ee",
  },
  {
    name: "Faroese",
    code: "fo",
  },
  {
    name: "Fijian",
    code: "fj",
  },
  {
    name: "Finnish",
    code: "fi",
  },
  {
    name: "French",
    code: "fr",
  },
  {
    name: "Western Frisian",
    code: "fy",
  },
  {
    name: "Fulah",
    code: "ff",
  },
  {
    name: "Gaelic, Scottish Gaelic",
    code: "gd",
  },
  {
    name: "Galician",
    code: "gl",
  },
  {
    name: "Ganda",
    code: "lg",
  },
  {
    name: "Georgian",
    code: "ka",
  },
  {
    name: "German",
    code: "de",
  },
  {
    name: "Greek, Modern (1453–)",
    code: "el",
  },
  {
    name: "Kalaallisut, Greenlandic",
    code: "kl",
  },
  {
    name: "Guarani",
    code: "gn",
  },
  {
    name: "Gujarati",
    code: "gu",
  },
  {
    name: "Haitian, Haitian Creole",
    code: "ht",
  },
  {
    name: "Hausa",
    code: "ha",
  },
  {
    name: "Hebrew",
    code: "he",
  },
  {
    name: "Herero",
    code: "hz",
  },
  {
    name: "Hindi",
    code: "hi",
  },
  {
    name: "Hiri Motu",
    code: "ho",
  },
  {
    name: "Hungarian",
    code: "hu",
  },
  {
    name: "Icelandic",
    code: "is",
  },
  {
    name: "Ido",
    code: "io",
  },
  {
    name: "Igbo",
    code: "ig",
  },
  {
    name: "Indonesian",
    code: "id",
  },
  {
    name: "Interlingua (International Auxiliary Language Association)",
    code: "ia",
  },
  {
    name: "Interlingue, Occidental",
    code: "ie",
  },
  {
    name: "Inuktitut",
    code: "iu",
  },
  {
    name: "Inupiaq",
    code: "ik",
  },
  {
    name: "Irish",
    code: "ga",
  },
  {
    name: "Italian",
    code: "it",
  },
  {
    name: "Japanese",
    code: "ja",
  },
  {
    name: "Javanese",
    code: "jv",
  },
  {
    name: "Kannada",
    code: "kn",
  },
  {
    name: "Kanuri",
    code: "kr",
  },
  {
    name: "Kashmiri",
    code: "ks",
  },
  {
    name: "Kazakh",
    code: "kk",
  },
  {
    name: "Central Khmer",
    code: "km",
  },
  {
    name: "Kikuyu, Gikuyu",
    code: "ki",
  },
  {
    name: "Kinyarwanda",
    code: "rw",
  },
  {
    name: "Kirghiz, Kyrgyz",
    code: "ky",
  },
  {
    name: "Komi",
    code: "kv",
  },
  {
    name: "Kongo",
    code: "kg",
  },
  {
    name: "Korean",
    code: "ko",
  },
  {
    name: "Kuanyama, Kwanyama",
    code: "kj",
  },
  {
    name: "Kurdish",
    code: "ku",
  },
  {
    name: "Lao",
    code: "lo",
  },
  {
    name: "Latin",
    code: "la",
  },
  {
    name: "Latvian",
    code: "lv",
  },
  {
    name: "Limburgan, Limburger, Limburgish",
    code: "li",
  },
  {
    name: "Lingala",
    code: "ln",
  },
  {
    name: "Lithuanian",
    code: "lt",
  },
  {
    name: "Luba-Katanga",
    code: "lu",
  },
  {
    name: "Luxembourgish, Letzeburgesch",
    code: "lb",
  },
  {
    name: "Macedonian",
    code: "mk",
  },
  {
    name: "Malagasy",
    code: "mg",
  },
  {
    name: "Malay",
    code: "ms",
  },
  {
    name: "Malayalam",
    code: "ml",
  },
  {
    name: "Maltese",
    code: "mt",
  },
  {
    name: "Manx",
    code: "gv",
  },
  {
    name: "Maori",
    code: "mi",
  },
  {
    name: "Marathi",
    code: "mr",
  },
  {
    name: "Marshallese",
    code: "mh",
  },
  {
    name: "Mongolian",
    code: "mn",
  },
  {
    name: "Nauru",
    code: "na",
  },
  {
    name: "Navajo, Navaho",
    code: "nv",
  },
  {
    name: "North Ndebele",
    code: "nd",
  },
  {
    name: "South Ndebele",
    code: "nr",
  },
  {
    name: "Ndonga",
    code: "ng",
  },
  {
    name: "Nepali",
    code: "ne",
  },
  {
    name: "Norwegian",
    code: "no",
  },
  {
    name: "Norwegian Bokmål",
    code: "nb",
  },
  {
    name: "Norwegian Nynorsk",
    code: "nn",
  },
  {
    name: "Sichuan Yi, Nuosu",
    code: "ii",
  },
  {
    name: "Occitan",
    code: "oc",
  },
  {
    name: "Ojibwa",
    code: "oj",
  },
  {
    name: "Oriya",
    code: "or",
  },
  {
    name: "Oromo",
    code: "om",
  },
  {
    name: "Ossetian, Ossetic",
    code: "os",
  },
  {
    name: "Pali",
    code: "pi",
  },
  {
    name: "Pashto, Pushto",
    code: "ps",
  },
  {
    name: "Persian",
    code: "fa",
  },
  {
    name: "Polish",
    code: "pl",
  },
  {
    name: "Portuguese",
    code: "pt",
  },
  {
    name: "Punjabi, Panjabi",
    code: "pa",
  },
  {
    name: "Quechua",
    code: "qu",
  },
  {
    name: "Romanian, Moldavian, Moldovan",
    code: "ro",
  },
  {
    name: "Romansh",
    code: "rm",
  },
  {
    name: "Rundi",
    code: "rn",
  },
  {
    name: "Russian",
    code: "ru",
  },
  {
    name: "Northern Sami",
    code: "se",
  },
  {
    name: "Samoan",
    code: "sm",
  },
  {
    name: "Sango",
    code: "sg",
  },
  {
    name: "Sanskrit",
    code: "sa",
  },
  {
    name: "Sardinian",
    code: "sc",
  },
  {
    name: "Serbian",
    code: "sr",
  },
  {
    name: "Shona",
    code: "sn",
  },
  {
    name: "Sindhi",
    code: "sd",
  },
  {
    name: "Sinhala, Sinhalese",
    code: "si",
  },
  {
    name: "Slovak",
    code: "sk",
  },
  {
    name: "Slovenian",
    code: "sl",
  },
  {
    name: "Somali",
    code: "so",
  },
  {
    name: "Southern Sotho",
    code: "st",
  },
  {
    name: "Spanish, Castilian",
    code: "es",
  },
  {
    name: "Sundanese",
    code: "su",
  },
  {
    name: "Swahili",
    code: "sw",
  },
  {
    name: "Swati",
    code: "ss",
  },
  {
    name: "Swedish",
    code: "sv",
  },
  {
    name: "Tagalog",
    code: "tl",
  },
  {
    name: "Tahitian",
    code: "ty",
  },
  {
    name: "Tajik",
    code: "tg",
  },
  {
    name: "Tamil",
    code: "ta",
  },
  {
    name: "Tatar",
    code: "tt",
  },
  {
    name: "Telugu",
    code: "te",
  },
  {
    name: "Thai",
    code: "th",
  },
  {
    name: "Tibetan",
    code: "bo",
  },
  {
    name: "Tigrinya",
    code: "ti",
  },
  {
    name: "Tonga (Tonga Islands)",
    code: "to",
  },
  {
    name: "Tsonga",
    code: "ts",
  },
  {
    name: "Tswana",
    code: "tn",
  },
  {
    name: "Turkish",
    code: "tr",
  },
  {
    name: "Turkmen",
    code: "tk",
  },
  {
    name: "Twi",
    code: "tw",
  },
  {
    name: "Uighur, Uyghur",
    code: "ug",
  },
  {
    name: "Ukrainian",
    code: "uk",
  },
  {
    name: "Urdu",
    code: "ur",
  },
  {
    name: "Uzbek",
    code: "uz",
  },
  {
    name: "Venda",
    code: "ve",
  },
  {
    name: "Vietnamese",
    code: "vi",
  },
  {
    name: "Volapük",
    code: "vo",
  },
  {
    name: "Walloon",
    code: "wa",
  },
  {
    name: "Welsh",
    code: "cy",
  },
  {
    name: "Wolof",
    code: "wo",
  },
  {
    name: "Xhosa",
    code: "xh",
  },
  {
    name: "Yiddish",
    code: "yi",
  },
  {
    name: "Yoruba",
    code: "yo",
  },
  {
    name: "Zhuang, Chuang",
    code: "za",
  },
  {
    name: "Zulu",
    code: "zu",
  },
];

export const lanuguagesWitnFlag = languages.map(({ name, code }) => {
  const country = countries.find(({ name: countryName }) =>
    countryName.includes(name)
  );
  if (country) {
    return {
      name,
      code,
      flag: country.flag_url,
    };
  } else {
    return { name, code };
  }
});
