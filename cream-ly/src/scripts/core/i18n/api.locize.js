import i18next from "i18next";
import { projectId } from ".";

export const fetchNamespace = (lang, namespace) => {
  return fetch(
    `https://api.locize.app/${projectId}/latest/${lang}/${namespace}`
  ).then((r) => r.json());
};

export const fetchAndAddToResources = (lang, namespace) => {
  return fetchLocize(lang, namespace).then((labels) => {
    i18next.addResourceBundle(lang, namespace, labels, true, true);
  });
};

const namespaces = ["common", "PageAbout", "PromoAdvantages", "MessageUs"];

export const fetchTranslations = async (lang = "ru") => {
  const fetchListResults = (namespaceTranslations) => {
    return namespaceTranslations.reduce((acc, translations, index) => {
      acc[namespaces[index]] = translations;
      return acc;
    }, {});
  };

  const fetchList = namespaces.map((namespace) =>
    fetchNamespace(lang, namespace)
  );
  return Promise.all(fetchList).then(fetchListResults);
};
