const fs = require("fs");
const fetch = require("cross-fetch");

const WEBSITE_PROJECT_ID = "964c27a7-ec8a-4593-b169-05eea5c7b196";
const WEBSITE_API_KEY = "df8fcb67-7b7c-4266-83be-2be83a56b441";

const LEGAL_API_KEY = "62b90ea4-bae1-445b-b397-945010ddebf9";
const LEGAL_PROJECT_ID = "33470d34-ac36-4829-ae78-0713dc468147";

const getTranslated = async () => {
  const namespaces = await getNamespaces(WEBSITE_PROJECT_ID, WEBSITE_API_KEY);
  await getByLang("ru", namespaces, WEBSITE_PROJECT_ID, WEBSITE_API_KEY);
  await getByLang("en", namespaces, WEBSITE_PROJECT_ID, WEBSITE_API_KEY);
  await getByLang("lv", namespaces, WEBSITE_PROJECT_ID, WEBSITE_API_KEY);

  const legalNamespaces = await getNamespaces(LEGAL_PROJECT_ID, LEGAL_API_KEY);
  await getByLang("ru", legalNamespaces, LEGAL_PROJECT_ID, LEGAL_API_KEY);
  await getByLang("en", legalNamespaces, LEGAL_PROJECT_ID, LEGAL_API_KEY);
  await getByLang("lv", legalNamespaces, LEGAL_PROJECT_ID, LEGAL_API_KEY);

  createIndexFile("ru", namespaces.concat(legalNamespaces));
  createIndexFile("en", namespaces.concat(legalNamespaces));
  createIndexFile("lv", namespaces.concat(legalNamespaces));
};

const getNamespaceUsingStats = (projectId, apikey) => {
  return fetch(`https://api.locize.app/stats/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${apikey}`,
    },
  })
    .then((r) => {
      console.log("response", r.json());
      return r;
    })
    .then((r) => r.json())
    .then((data) => Object.keys(data.latest.ru));
};

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    "use strict";

    if (search instanceof RegExp) {
      throw TypeError("first argument must not be a RegExp");
    }
    if (start === undefined) {
      start = 0;
    }
    return this.indexOf(search, start) !== -1;
  };
}

const getNamespaceUsingDownloads = (
  projectId,
  apikey,
  version = "latest",
  lang = "ru"
) => {
  return fetch(`https://api.locize.app/download/${projectId}/${version}`, {
    headers: {
      Authorization: `Bearer ${apikey}`,
    },
  })
    .then((r) => r.json())
    .then((list) => {
      const search = `${projectId}/${version}/${lang}/`;

      return list
        .filter((item) => item.key.indexOf(search) !== -1)
        .map((item) => item.key.replace(search, ""));
    });
};

const getNamespaces = async (projectId, apikey) => {
  return getNamespaceUsingDownloads(projectId, apikey);
};

const getByLang = (lang, namespaces, projectId, apikey) =>
  Promise.all(
    namespaces.map(async (ns) => {
      return await fetch(
        `https://api.locize.app/${projectId}/latest/${lang}/${ns}`,
        {
          headers: {
            Authorization: `Bearer ${apikey}`,
          },
        }
      )
        .then((r) => r.json())
        .then((data) => {
          if (ns === "shopify" && (lang === "ru" || lang === "lv")) {
            createShopifyLocaleFile(lang, data)
          }
          createNamespaceFile(lang, ns, data);
          console.log(`${lang} ${ns} successfully added`);
        });
    })
  ).catch((e) => console.error(e));

function createShopifyLocaleFile(lang, translations) {
  const path = `./src/locales/${lang}.json`;
  fs.writeFile(path, JSON.stringify(translations, null, 2), () => {
    console.log(`locale saved ${path}`);
  });
}

function createNamespaceFile(lang, namespace, translations) {
  const path = `./src/scripts/core/i18n/translations/${lang}/${namespace}.js`;
  fs.writeFile(
    path,
    "module.exports=" + JSON.stringify(translations, null, 2),
    () => {
      console.log(`saved ${path}`);
    }
  );
}

function createIndexFile(lang, namespaces) {
  const path = `./src/scripts/core/i18n/translations/${lang}/index.js`;

  const importsContent = namespaces.map((ns) => `import ${ns} from "./${ns}";`);

  const exportsContent = namespaces.map((ns) => {
    return `${ns},`;
  });

  const content =
    importsContent.join("\n") +
    "\n\nexport default {\n" +
    exportsContent.join("\n") +
    "\n}";

  fs.writeFile(path, content, () => {
    console.log(`index for ${lang} updated`);
  });
}

getTranslated();
