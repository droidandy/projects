//@ts-nocheck
import words from "lodash/words";
import * as i18n from "@Core/i18n";
import { omitHtmlTagsForSearch } from "./HighlighHelpers";

export interface RelatedLink {
  url: string;
  name?: string;
}
export interface FAQItem {
  name: string;
  text: string;
  relatedLinks?: Array<RelatedLink | string>;
  key: string;
  shortFAQ: string;
  isToggled: boolean;
  clearText: string;
  searchTextWords: string[];
  searchNameWords: string[];
}
export interface FAQCategory {
  id: string;
  name: string;
  icon?: string;
  items: Array<FAQItem>;
}

interface LocizeDataFAQItem {
  categories: string;
  shortFAQ?: string;
  text: string;
  title: string;
  url?: string;
}
interface LocizeDataFAQ {
  categories: {
    [key: string]: string;
  };
  items: {
    [key: string]: LocizeDataFAQItem;
  };
  order: string;
  commonURLTitle?: string;
}

const locizeData = (lang: string) => {
  const dataLang = lang === "dev" ? "ru" : lang;
  return {
    categories: i18n.getTranslation({
      key: "categories",
      namespace: "FAQ",
      lang: dataLang,
    }),
    items: i18n.getTranslation({
      key: "items",
      namespace: "FAQ",
      lang: dataLang,
    }),
    order: i18n.getTranslation({
      key: "order",
      namespace: "FAQ",
      lang: dataLang,
    }),
    commonURLTitle: i18n.getTranslation({
      key: "commonURLTitle",
      namespace: "FAQ",
      lang,
    }),
  };
};

const mapICons = {
  application: "Application",
  ingredients: "Ingredients",
  others: "OtherQuestions",
  packagingAndStorage: "Package",
  productLine: "ProductLine",
  shipping: "Shipping",
  videoCourses: "VideoCourses",
};

const tryParseJSON = (jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    return [];
  }
  return [];
};

const sortFunc = (arr: string[], order: string[]) => {
  arr.sort((a, b) => {
    if (order.indexOf(a) > order.indexOf(b)) {
      return 1;
    } else {
      return -1;
    }
  });
  return arr;
};

export const searchPattern = /[^,?!. ]+/g;

const groupDataByCategories = (
  data: { [key: string]: LocizeDataFAQItem },
  orderArr: string[],
  commonURLTitle: string
): {
  [key: string]: FAQItem[];
} => {
  const itemKeys = Object.keys(data);
  const filteredKeys = sortFunc(itemKeys, orderArr);
  const groupedCategories = {};

  filteredKeys.forEach((itemKey: string) => {
    const { categories, text, title: name, url, shortFAQ } = data[itemKey];
    const categoryNames = tryParseJSON(categories);
    if (categoryNames && categoryNames.length) {
      categoryNames.forEach((category: string) => {
        const clearText = omitHtmlTagsForSearch(text).toLowerCase();
        groupedCategories[category] = [
          ...(groupedCategories[category] || []),
          {
            name,
            text,
            key: itemKey,
            relatedLinks: url ? [{ url, name: commonURLTitle }] : null,
            shortFAQ,
            clearText,
            isToggled: false,
            searchNameWords: words(name.toLowerCase(), searchPattern),
            searchTextWords: words(clearText.toLowerCase(), searchPattern),
          },
        ];
      });
    }
  });

  return groupedCategories;
};

const filterCategoriesBy = (data: FAQItem[], isOnlySortItems: boolean) => {
  if (isOnlySortItems) {
    return data.filter((item: FAQItem) => item && item.shortFAQ === "true");
  }
  return data;
};

const mapCategories = (
  data: LocizeDataFAQ,
  isOnlySortItems = false
): FAQCategory[] => {
  const sortingArr = data && data.order ? tryParseJSON(data.order) : [];
  const categories =
    data && data.items
      ? groupDataByCategories(data.items, sortingArr, data.commonURLTitle)
      : null;
  const categoriesKeys = Object.keys(categories);

  if (categoriesKeys && Array.isArray(categoriesKeys)) {
    return categoriesKeys.map((category: string) => ({
      id: category,
      name: data.categories[category] || "",
      icon: mapICons[category] || "",
      items: categories[category]
        ? filterCategoriesBy(categories[category], isOnlySortItems)
        : [],
    }));
  }
  return [];
};

const data = (lang = "ru", isShortFaq = false): FAQCategory[] =>
  mapCategories(locizeData(lang), isShortFaq) || [];

export default data;
