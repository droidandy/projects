// @ts-nocheck

import { getTranslationsWithKeyPrefix } from "../i18n";
import { getVariantPrice, getVariantIdBySKU } from ".";

const list = [
  {
    type: "master",
    title: "ТИПЫ СТАРЕНИЯ",
    handle: "video-aging",
    demoVimeo: {
      imageId:
        "896453161-8d1ce1de50b3da4e091724f0d60a39eddfa7ab68c0438da79ad77eddd0bef113",
      videoId: 420973719,
    },
    sku: "sku-video-aging",
  },
  {
    title: "ОМОЛОЖЕНИЯ ЛИЦА",
    handle: "video-1",
    demoVimeo: {
      imageId:
        "812654848-098703abe58c26b2d52db9124bef7b29686c8a006a9f9bf6dcc7710802d6d94e",
      videoId: 358903405,
    },
    sku: "Video-FaceMassage-Level1",
  },
  {
    title: "Лимфодренаж",
    handle: "video-2-limfa",
    demoVimeo: {
      imageId:
        "823218443-ce468dc40cb74b3925d07641ced573ff31cc0009daa2f9f7b5af62e432c6ae1e",
      videoId: 366931772,
    },
    sku: "Video-Limfa-Level2",
  },
  {
    title: "Осанка",
    handle: "video-3-osanka",
    demoVimeo: {
      imageId:
        "832278387-03c96b2ccdde768832046b779c365e94969fb96dd8f3ba8af8d8cb759e33a831",
      videoId: 373977244,
    },
    sku: "Video-Osanka-Level3",
  },
  {
    title: "БУККАЛЬНЫЙ МАССАЖ",
    handle: "video-4-buccal-massage",
    demoVimeo: {
      imageId:
        "847895911-4101fcf52099cda67cca061a927c20235598122cca00868236541b55d3460448",
      videoId: 385675071,
    },
    sku: "Video-Level4-buccal-massage",
  },
  {
    title: "МАССАЖ ГУАША",
    handle: "video-5-guasha-massage",
    demoVimeo: {
      imageId:
        "858482251-4c266afb8f978d88a404320cf73923286cb028e89e0fd437bc00e471128a23fe",
      videoId: 393114480,
    },
    sku: "Video-Level5-guasha-massage",
  },
  {
    title: "АНТИЦЕЛЛЮЛИТНЫЙ CАМОМАССАЖ",
    handle: "video-6-cellulite",
    demoVimeo: {
      imageId:
        "882930544-cc24fc46cd3c165876b1ef5c8b698a4720b7c0ffe87dc957ba253672fe2905d3",
      videoId: 411038217,
    },
    sku: "Video-Level6-cellulite-massage",
  },
  {
    title: "Мьюинг 2.0",
    handle: "video-7-mewing",
    demoVimeo: {
      imageId:
        "930246111-ba8e0ab322139157a623f9a30a7bdefd44cfd4d0de173afc4f773a7b0dd36e5b",
      videoId: 441775748,
    },
    sku: "Video-Level7-mewing",
  },
  {
    title: "Тейпирование",
    handle: "video-8-taping",
    demoVimeo: {
      imageId:
        "1046432770-a54c3f5907d78e4655f94a220c11f21d640f2cf64d9590f31cdd990c92d2e608",
      videoId: 501682487,
    },
    sku: "Video-Level8-taping",
  },
  {
    title: "Тейпирование Тела",
    handle: "video-9-body-taping",
    isNotReady: false,
    demoVimeo: {
      imageId:
        "1156633060-c51709f9361db464c17bcd979bf7c627c18c3d9e6c0d667945da2ed5aa1fb538",
      videoId: 558216040,
    },
    sku: "Video-Level9-body-taping",
  },
];

const jsonArrayParser = (
  stringToParse: string,
  key: string,
  handle: string,
  lang: string,
  replaceDevArray = true
): string[] | any => {
  if (!stringToParse || typeof stringToParse !== "string") return stringToParse;

  const regexp = new RegExp(/\n/gm);
  const replacedString = stringToParse.replace(regexp, "");

  try {
    let result = JSON.parse(replacedString);

    if (replaceDevArray && lang === "dev" && Array.isArray(result)) {
      return result.map(() => handle + "." + key);
    }

    return result;
  } catch (e) {
    console.error(
      `error trying to parse translation key ${key} handle ${handle} ${replacedString}`
    );
    console.error(e);
    return [];
  }
};

export const getTranslations = (handle: string, lang = "ru"): ITranslations => {
  const translations = getTranslationsWithKeyPrefix(handle, "products", lang);

  translations.feedbacks = jsonArrayParser(
    translations.feedbacks,
    "feedbacks",
    handle,
    lang
  );
  translations.videoParts = jsonArrayParser(
    translations.videoParts,
    "videoParts",
    handle,
    lang
  );
  translations.videoPartsTimingsList = jsonArrayParser(
    translations.videoPartsTimingsList,
    "videoPartsTimingsList",
    handle,
    lang,
    false
  );

  return translations;
};

export const getVideoListRaw = () => {
  return list;
};

export const getVideosList = (
  lang = "ru",
  presentmentCurrency = "EUR",
  currencyExchange = 1,
  skuPricesPairs = null
): Array<IVideosListItem> => {
  return list
    .map((video) => ({ ...video, variantId: getVariantIdBySKU(video.sku) }))
    .map((video) => ({
      ...video,
      url: "/products/" + video.handle,
      price: getVariantPrice(
        { sku: video.sku },
        presentmentCurrency,
        currencyExchange,
        skuPricesPairs
      ),
      pageURL: "/pages/video?lang=ru#" + video.handle,
    }))
    .map((video) => {
      return {
        ...video,
        translation: getTranslations(video.handle, lang),
      };
    });
};

export function isVideoProduct(productHandle: string): boolean {
  return (
    getVideosList().filter((video) => video.handle == productHandle).length > 0
  );
}
