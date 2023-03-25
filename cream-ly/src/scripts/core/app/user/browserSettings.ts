let defaultLangs = ["ru", "en", "lv", "dev"];

export const getLanguageCodes = (windowNavigator) => {
  const languages = setLanguageCodesFromGlobalOjbect(windowNavigator);
  return languages.length ? languages : defaultLangs;
};

export const setLanguageCodesFromGlobalOjbect = (navigator) => {
  if (Array.isArray(navigator.languages) && navigator.languages.length)
    return parseLanguagesFromNavigator(navigator.languages);

  if (navigator.language)
    return [parseLanguageCodeFromNavigatorString(navigator.language)];
};

export const parseLanguageCodeFromNavigatorString = (
  navigatorLanguge: string
): string => {
  //as provided by NavigatorLanguage.language
  //https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language
  //Examples of valid language codes include "en", "en-US", "fr", "fr-FR", "es-ES", etc.

  if (navigatorLanguge && !navigatorLanguge.includes("-"))
    return navigatorLanguge;

  const matches = navigatorLanguge.match(/^([a-z]{2})-?([A-Z|a-z]{2})?$/);
  return matches[1];
};

/**
 *
 * @param navigatorLanguages representing the user's preferred languages. e.g ["en-US", "zh-CN", "ja-JP"]
 */
export const parseLanguagesFromNavigator = (
  navigatorLanguages: Array<string>
) => {
  //representing the user's preferred languages
  //as provied by Navigator.languages
  //expected input ["en-US", "zh-CN", "ja-JP"]
  //as per https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages

  return navigatorLanguages.map(parseLanguageCodeFromNavigatorString);
};
