import { getURLForPageType, PAGES as pageList } from "./pages";
import isbot from "isbot";
export const PAGES = pageList;

let localeRootSingleton = "/";

export const setLocaleRoot = (newRoot) => {
  localeRootSingleton = newRoot;
};

export const getLocaleRoot = () => {
  return localeRootSingleton;
};

export const goTo = (
  link,
  isAddLocaleRoot = true,
  isSkipHistoryPush = false
) => {
  const newURL = isAddLocaleRoot ? addLocale(link) : link;

  // console.log("goTo", link, isAddLocaleRoot, localeRootSingleton, newURL);

  if (isSkipHistoryPush) {
    window.location.replace(newURL);
    return;
  }

  window.location = newURL;
};

export const reloadWithNewLocalizationSettings = (
  currentURL,
  redirectHost = null,
  languageCode = null,
  currencyCode = null,
  regionCode = null
) => {
  const newURL = transformCurrentURLtoLocale(
    currentURL,
    languageCode,
    currencyCode,
    redirectHost,
    regionCode
  );

  return goTo(newURL.toString(), false, true);
};

export const transformCurrentURLtoLocale = (
  url,
  newLangCode = null,
  currencyCode = null,
  newHost = null,
  regionCode = null
) => {
  const urlObject = url ? new URL(url) : null;
  if (!urlObject) return "/";

  const regexpLangPrefix = /^(?:\/[a-z]{2}\/|\/)/gm;

  if (urlObject.pathname.match(regexpLangPrefix)) {
    urlObject.pathname = urlObject.pathname.replace(
      regexpLangPrefix,
      newLangCode === "ru" ? "/" : `/${newLangCode}/`
    );
  }

  if (currencyCode) urlObject.searchParams.set("currencyCode", currencyCode);

  if (regionCode) urlObject.searchParams.set("regionCode", regionCode);

  if (newHost) urlObject.hostname = newHost;
  if (newHost && newLangCode) urlObject.searchParams.set("lang", newLangCode);

  return urlObject;
};

export const getURLForPage = (pageType, options = {}) => {
  const isLocaleOn = pageType == "PAGE_QUIZ_OR_RESULTS" ? false : true;
  const url = getURLForPageType(pageType, options);

  return isLocaleOn ? addLocale(url) : url;
};

export const addLocale = (link, rootOverride = null) => {
  let root = rootOverride ? rootOverride : localeRootSingleton;
  if (!root || root == "/") return link;
  return root + link;
};

export const goToCart = () => {
  return goTo("/cart");
};

export const goToCheckout = () => {
  return goTo("/checkout");
};

export const goToAccountRegistration = (email) => {
  return goTo("/account/register?email=" + email);
};

export function urlQuizOrResults(skinType, skinGoals) {
  // skinGoals = trimSkinGoalsList(skinGoals);

  const URL =
    skinType && skinGoals.length
      ? `/pages/recommendations/?type=${skinType}&goals[]=${skinGoals.join(
          "&goals[]="
        )}`
      : "/pages/quiz/?redo=1";

  return addLocale(URL);
}

export function urlForBlogArticle(articleHandle, blogHandle = "beauty") {
  const URL = `/blogs/${blogHandle}/${articleHandle}/`;
  //return addLocale(URL);
  //ignore locale as all blogs are RU only
  return URL;
}

export const goToQuizOrResults = (skinType = null, skinGoals = []) => {
  return goTo(urlQuizOrResults(skinType, skinGoals), false);
};

export const getOrderConfirmationURL = (host, checkoutId) => {
  const link = addLocale(`/pages/order_thank_you?checkoutId=${checkoutId}`);
  return `https://${host}${link}`;
};

export const goToWebPayForm = (checkoutId) => {
  const url = "https://shop.creamly.by/cart/webpay?checkoutId=" + checkoutId;
  return goTo(url, false);
};

export const isGoogleBot = (userAgent) => {
  /* const botPattern =
    "(googlebot/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google)";
  const re = new RegExp(botPattern, "i");
  //var userAgent = navigator.userAgent;

  return re.test(userAgent) ? true : false; */

  return isbot(userAgent);
};
