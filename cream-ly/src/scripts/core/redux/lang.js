let initialLang = "ru";

export const setLang = (newLang) => {
  initialLang = newLang;
};

export const getLang = () => {
  return initialLang;
};
