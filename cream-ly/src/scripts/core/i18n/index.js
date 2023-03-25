import i18next from "i18next";
//import Locize from "i18next-locize-backend";
import { initTimer } from "@Core/app/analytics/timer";
import React from "react";
import ReactDOM from "react-dom";

import { renderToString } from "react-dom/server";
import { isValidElement } from "react";

//import localTranslate from "@Core/locize.json";

import translations from "./translations";
//import * as api from "./api.locize";
export const projectId = "964c27a7-ec8a-4593-b169-05eea5c7b196";
export const apikey = "df8fcb67-7b7c-4266-83be-2be83a56b441";

i18next
  .init({
    lng: "ru",
    // load: "all",
    preload: ["en", "ru", "lv"],

    // fallbackLng: "dev",
    // keySeparator: false,
    fallbackLng: false,
    /*  overloadTranslationOptionHandler(val) {
      return {
        defaultValue: val[0],
      };
    }, */
    debug: false,
    partialBundledLanguages: true,
    //saveMissing: true,
    resources: { ...translations },
    /*
    interpolation: {
      format: function(value, format, lng) {
        if (format === "uppercase") return value.toUpperCase();
        if (value instanceof Date) return moment(value).format(format);
        return value;
      },
    },
    */
  })
  .then((t) => {
    // initialized and ready to go!
    // document.getElementById("output").innerHTML = i18next.t("key");
  });

// i18next.use(Locize).init({
//   backend: {
//     projectId,
//     apiKey: apikey,
//     referenceLng: "ru"
//   }
// });

/*

function changeLng(lng) {
  i18next.changeLanguage(lng);
}

 <script id="locizify" projectid="964c27a7-ec8a-4593-b169-05eea5c7b196" debug="false" apikey="df8fcb67-7b7c-4266-83be-2be83a56b441" saveMissing="true" referencelng="ru" fallbacklng="ru" src="https://unpkg.com/locizify@^4.0.7"></script>

  */

const setTranslateFromJson = () => {
  Object.keys(localTranslate).map((lang) => {
    Object.keys(localTranslate[lang]).forEach((namespace) => {
      i18next.addResourceBundle(
        lang,
        namespace,
        localTranslate[lang][namespace],
        true,
        true
      );
    });
  });
};

let context = null;
export const setContext = (newContext) => {
  context = newContext;
};

let keys = null;
export const setKeys = (newKeys) => {
  keys = newKeys;
};

let count = null;
export const setCount = (newCount) => {
  count = newCount;
};

let pageName = null;
export const setPageContext = (newPageName) => {
  pageName = newPageName;
};

const changeReactElements2Strings = (options) => {
  if (options === null || typeof options != "object") return options;

  const newOptions = {};
  Object.keys(options).map((key) => {
    const option = options[key];
    newOptions[key] = isValidElement(option) ? renderToString(option) : option;
  });

  newOptions.interpolation = { escapeValue: false };

  return newOptions;
};

export const getTranslationsWithKeyPrefix = (keyPrefix, namespace, lang) => {
  const bundleLang = lang != "dev" ? lang : "ru";
  const bundle = i18next.getResourceBundle(bundleLang, namespace);

  const prefixGroup = bundle[keyPrefix] ? bundle[keyPrefix] : {};

  return Object.keys(prefixGroup).reduce((acc, groupKey) => {
    let translateToLang = lang;
    if (namespace == "products" && lang == "dev") {
      if (
        ["feedbacks", "videoParts", "videoPartsTimingsList"].includes(groupKey)
      )
        translateToLang = "ru";
    }

    const translation = getTranslation({
      key: keyPrefix + "." + groupKey,
      namespace,
      lang: translateToLang,
    });

    return { ...acc, [groupKey]: translation };
  }, {});
};

export const getTranslation = ({
  key,
  namespace,
  lang,
  options,
  translationIfMissing = null,
}) => {
  const fullKey = key.includes(":") ? key : `${namespace}:${key}`;

  const optionReturnObject = { returnObjects: true };
  options = options
    ? { ...options, ...optionReturnObject }
    : optionReturnObject;

  if (i18next.exists(fullKey)) {
    return i18next.t(fullKey, {
      ...changeReactElements2Strings(options),
      lng: lang,
    });
  } else {
    return translationIfMissing !== null && lang != "dev"
      ? translationIfMissing
      : fullKey;
  }
};

export const useTranslate = (
  namespace = "common",
  lang = "ru",
  defaultRUtranslations = {}
) => {
  loadDefaultRUTranslations(namespace, defaultRUtranslations);

  return (key, options, translationIfMissing) =>
    getTranslation({
      key,
      options,
      namespace,
      lang,
      translationIfMissing,
    });
};

export const loadDefaultRUTranslations = (namespace, defaultRUtranslations) => {
  if (i18next.hasResourceBundle("ru", namespace)) {
    const resourcesFromFile = i18next.getResourceBundle("ru", namespace);
    defaultRUtranslations = {
      ...defaultRUtranslations,
      ...resourcesFromFile,
    };
  }
  i18next.addResourceBundle("ru", namespace, defaultRUtranslations, true, true);
};

export const translate = (
  defaultRUtranslations = {},
  namespaceOwerwrite = null
) => (Component) => (props) => {
  const namespace = namespaceOwerwrite
    ? namespaceOwerwrite
    : Component.prototype.constructor.name;
  const lang = props && props.lang ? props.lang : "ru";
  i18next.changeLanguage(lang);

  loadDefaultRUTranslations(namespace, defaultRUtranslations);

  const formatTranslate = (labels, previousKey) => {
    return Object.keys(labels).reduce((obj, key) => {
      return {
        ...obj,
        [key]:
          typeof labels[key] === "string"
            ? i18next.t(
                `${namespace}:${previousKey ? previousKey + "." : ""}${key}`,
                { context, pageName, ...keys }
              )
            : formatTranslate(labels[key], key),
      };
    }, {});
  };

  Component.prototype.i18n = formatTranslate(defaultRUtranslations);
  Component.prototype.translate = ({
    key,
    options,
    namespace,
    lang,
    translationIfMissing,
  }) => {
    return getTranslation({
      key,
      options,
      namespace,
      lang,
      translationIfMissing,
    });
  };

  Component.prototype.t = (key, options, translationIfMissing) => {
    return getTranslation({
      key,
      options,
      namespace,
      lang,
      translationIfMissing,
    });
  };

  const object = new Component(props);

  // i18next.on("loaded", loaded => {
  //   console.log("loaded", loaded);
  // });

  // i18next.on("failedLoading", (lng, ns, msg) => {
  //   console.log("failedLoading", lng, ns, msg);
  // });

  // i18next.on("missingKey", (lngs, namespace, key, res) => {
  //   console.log("missingKey", lngs, namespace, key, res);
  // });

  // i18next.store.on("added", (lng, ns) => {
  //   console.log("added", lng, ns);
  // });

  // i18next.store.on("removed", (lng, ns) => {
  //   console.log("removed", lng, ns);
  // });

  // i18next.on("loaded", loaded => {
  //   if (loaded[lang]) {
  //     object.setState({ updatedTranslate: new Date() });
  //   }
  // });

  /*
  fetchTranslations(lang, namespace).then(() => {
    object.setState({ updatedTranslate: new Date() });
  });
  */
  /*
  i18next.store.on("added", (addedLang, addedNamespace) => {
    if (addedNamespace === namespace) {
      // object.setState({ updatedTranslate: new Date() });
    }
  }); */

  return object;
};
