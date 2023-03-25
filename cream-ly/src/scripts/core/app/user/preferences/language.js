import { getPreference, setPreference } from ".";

const DEFAULT_LANG = "ru";
const allowedLanguages = ["ru", "en", "lv", "dev"];

const KEY = "languageCode";

export default (newLang = null) => {
  if (newLang && allowedLanguages.includes(newLang)) {
    setPreference(KEY, newLang, false);
    return newLang;
  }

  const storedValue = getPreference(KEY);
  const storedLang = storedValue.value;
  if (storedLang && allowedLanguages.includes(storedLang)) return storedLang;

  return DEFAULT_LANG;
};
