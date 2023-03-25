import { urlQuizOrResults } from ".";

export const PAGE_HOME = "PAGE_HOME";
export const PAGE_QUIZ = "PAGE_QUIZ";
export const PAGE_QUIZ_RESULTS = "PAGE_QUIZ_RESULTS";
export const PAGE_QUIZ_OR_RESULTS = "PAGE_QUIZ_OR_RESULTS";
export const PAGE_PRODUCTS = "PAGE_PRODUCTS";
export const PAGE_PRODUCT_DETAILS = "PAGE_PRODUCT_DETAILS";
export const PAGE_CART = "PAGE_CART";
export const PAGE_CHECKOUT = "PAGE_CHECKOUT";
export const PAGE_CONTACT = "PAGE_CONTACT";
export const PAGE_CUSTOMER_LOGIN = "PAGE_CUSTOMER_LOGIN";

export const PAGE_CUSTOMER_FORGOT_PASSORD = "PAGE_CUSTOMER_FORGOT_PASSORD";
export const PAGE_CUSTOMER_LOGOUT = "PAGE_CUSTOMER_LOGOUT";
export const PAGE_CUSTOMER_REGISTER = "PAGE_CUSTOMER_REGISTER";
export const PAGE_CUSTOMER_ACCOUNT = "PAGE_CUSTOMER_ACCOUNT";
export const PAGE_CUSTOMER_VIDEO = "PAGE_CUSTOMER_ACCOUNT";
export const PAGE_INFO_DELIVERY = "PAGE_INFO_DELIVERY";
export const PAGE_INFO_TERMS = "PAGE_INFO_TERMS";
export const PAGE_INFO_PRIVACY = "PAGE_INFO_PRIVACY";
export const PAGE_BLOG = "PAGE_BLOG";
export const PAGE_LANDING = "PAGE_LANDING";

export const PAGES = {
  PAGE_HOME,
  PAGE_CART,
  PAGE_CHECKOUT,
  PAGE_CUSTOMER_ACCOUNT,
  PAGE_CUSTOMER_LOGIN,
  PAGE_CUSTOMER_FORGOT_PASSORD,
  PAGE_CUSTOMER_LOGOUT,
  PAGE_CUSTOMER_REGISTER,
  PAGE_CUSTOMER_VIDEO,
  PAGE_INFO_DELIVERY,
  PAGE_INFO_PRIVACY,
  PAGE_INFO_TERMS,
  PAGE_PRODUCT_DETAILS,
  PAGE_PRODUCTS,
  PAGE_QUIZ,
  PAGE_QUIZ_RESULTS,
  PAGE_QUIZ_OR_RESULTS,
  PAGE_BLOG,
  PAGE_LANDING
};

export const getURLForPageType = (pageType, pageOptions = {}) => {
  const pageConfig = getPageConfig(pageType, pageOptions);
  if (typeof pageConfig == "undefined")
    throw Error(`Can't get page config for page type ${pageType}`);

  if (typeof pageConfig == "string") return pageConfig;

  const uriPart = generateURIpartFromOptions(pageOptions, pageConfig.options);

  return `${pageConfig.path}${uriPart ? `?${uriPart}` : ""}`;
};

export const extractOptionsFromURL = (
  url,
  pageType = null,
  knownPageOptions = {}
) => {
  url = new URL(url, "http://website.com");

  if (pageType == null) pageType = findPageTypeByURL();
  if (pageType == null) throw Error("can't find page type");

  const options = getPageConfig(pageType, knownPageOptions).options.map(
    standardizeOptionConfig
  );

  if (!options) return {};

  const getParams = options
    .filter((optionConfig) => optionConfig.getParam)
    .map((optionConfig) => {
      return url.searchParams.has(optionConfig.getParam)
        ? {
            [optionConfig.pageOptionKey]: url.searchParams.get(
              optionConfig.getParam
            ),
          }
        : null;
    });
  const regexpOptions = options
    .filter((optionConfig) => optionConfig.regexp)
    .map((optionConfig) => {
      return url.pathname
        .match(optionConfig.regexp)
        .filter((el) => el)
        .filter((el, index) => index == 1)
        .map((optionValue) => ({ [optionConfig.pageOptionKey]: optionValue }))
        .shift();
    });

  return getParams
    .concat(regexpOptions)
    .filter((el) => el)
    .reduce((acc, option) => ({ ...acc, ...option }), {});
};

export const findPageTypeByURL = (url) => {
  const trace = (e) => {
    console.log(e);
    return e;
  };

  const getRegExpPattern = (config) => {
    if (typeof config == "object" && config.pathRegexp)
      return config.pathRegexp;
    return typeof config == "object" ? config.path : config;
  };

  return (
    Object.values(PAGES)
      .map((pageType) => {
        return {
          pageType,
          pattern: getRegExpPattern(getPageConfig(pageType)),
        };
      })
      //.map(trace);
      .map((e) => (url.match("^" + e.pattern) ? e.pageType : null))
      .filter((e) => e)
      .shift()
  );
};

export function getPageConfig(pageType, pageOptions = {}) {
  switch (pageType) {
    case PAGE_HOME:
      return {
        path: `/`,
        pathRegexp: `/$`,
        options: [],
      };
    case PAGE_QUIZ:
      return { path: "/pages/quiz", options: ["redo"] };
    case PAGE_QUIZ_RESULTS:
      return {
        path: "/pages/recommendations",
        options: ["skinType", { skinGoals: "skinGoals=[]" }],
      };
    case PAGE_QUIZ_OR_RESULTS:
      return urlQuizOrResults(pageOptions.skinType, pageOptions.skinGoals);
    case PAGE_CART:
      return {
        path: "/cart/",
        options: ["step", { addProductVariantId: "add" }],
      };
    case PAGE_CHECKOUT:
      return "/checkout";
    case PAGE_CUSTOMER_LOGIN:
      return { path: "/account/login", options: [{ backURL: "checkout_url" }] };

    case PAGE_CUSTOMER_FORGOT_PASSORD:
      return {
        path: "/account/login#recover",
        options: [{ backURL: "checkout_url" }],
      };

    case PAGE_CUSTOMER_REGISTER:
      return { path: "/account/register/", options: ["email"] };
    case PAGE_CUSTOMER_LOGOUT:
      return "/account/logout";
    case PAGE_CUSTOMER_ACCOUNT:
      return { path: "/account/", options: [] };
    case PAGE_CUSTOMER_VIDEO:
      return { path: "/pages/video", options: [{ videoHandle: "v" }] };
    case PAGE_INFO_DELIVERY:
      return "/pages/delivery";
    case PAGE_INFO_PRIVACY:
      return "/pages/privacy";
    case PAGE_INFO_TERMS:
      return "/pages/terms";
    case PAGE_PRODUCT_DETAILS:
      return {
        path: `/products/${pageOptions.handle}/`,
        pathRegexp: `/product/(.+)/`,
        options: ["variantId", { handle: { regexp: /^\/product\/(.+)\// } }],
      };
    case PAGE_PRODUCTS:
      return "/pages/products";
    case PAGE_BLOG:
      return {
        path: "/blogs/beauty",
        options: ["filter", "pageNumber"],
      };
    case PAGE_LANDING:
      return "/pages/landing";
  }

  return;
}

export const standardizeOptionConfig = (optionConfig) => {
  if (typeof optionConfig == "string")
    return {
      getParam: optionConfig,
      pageOptionKey: optionConfig,
    };

  if (typeof optionConfig == "object") {
    const pageOptionKey = Object.keys(optionConfig)[0];

    let config = {
      pageOptionKey,
    };
    if (typeof optionConfig[pageOptionKey] == "string")
      config.getParam = optionConfig[pageOptionKey];
    if (typeof optionConfig[pageOptionKey] == "object")
      config = { ...config, ...optionConfig[pageOptionKey] };

    return config;
  }
};

export function generateURIpartFromOptions(options, acceptedOptionsList) {
  if (!Array.isArray(acceptedOptionsList)) return "";

  return acceptedOptionsList
    .map(standardizeOptionConfig)
    .filter(
      (config) =>
        config != null &&
        options[config.pageOptionKey] != null &&
        config.getParam
    )
    .map((config) => {
      const paramPrepare = (value) => `${config.getParam}=${encodeURI(value)}`;

      const value = options[config.pageOptionKey];
      if (Array.isArray(value)) return value.map(paramPrepare).join("&");
      return paramPrepare(value);
    })
    .join("&");
}
