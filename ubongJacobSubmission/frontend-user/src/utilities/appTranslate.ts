import translate from "translate";

const appTranslate = async (value: string, language: string) => {
  const result = await translate(value, language);
  return result;
};

export default appTranslate;
