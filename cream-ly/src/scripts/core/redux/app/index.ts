//import buildConfig from "../../../build_config";
import * as Router from "../../app/router";
import { getAllUrlParams } from "../../url";
import { getLang } from "../lang";
import { LocalizationSettings } from "@Core/app/localization";
import { checkIfCookiesAccepted, checkIfRequired } from "@Core/app/cookies";

export interface AppShape {
  localizationSettings: LocalizationSettings;
  isRegionSelectedByUser: boolean;
  location: {
    countryCode: string;
    countryName: string;
    zip: string;
    region: string;
    city: string;
  };
  route: {
    url: string;
    hostname: string;
    path: string;
    root: string;
    pathWithoutLocale: string;
    hash: string;
    params: Object;
    pageType: string;
  };
  cookies: {
    isRequired: boolean;
    isAccepted: boolean;
  },
}

const initialState: AppShape = {
  localizationSettings: {
    regionCode: "EU",
    currencyCode: "EUR",
    languageCode: getLang(),
    fulfillmentCode: "NL",
  },
  isRegionSelectedByUser: false,
  location: {
    countryCode: "NL",
    countryName: undefined,
    zip: undefined,
    region: undefined,
    city: undefined,
  },
  route: {
    url: undefined,
    hostname: undefined,
    path: undefined,
    root: "",
    pathWithoutLocale: undefined,
    params: [],
    hash: undefined,
    pageType: undefined,
  },
  cookies: {
    isRequired: true,
    isAccepted: checkIfCookiesAccepted(),
  }
};

const ACTION_SET_APP_FULFILLMENT = "ACTION_SET_APP_FULFILLMENT";
const ACTION_SET_LOCATION = "ACTION_SET_LOCATION";
const ACTION_SET_ROUTE = "ACTION_SET_ROUTE";
const ACTION_SET_LANG = "ACTION_SET_LANG";
const ACTION_SET_LOCALIZATION_SETTING = "ACTION_SET_LOCALIZATION_SETTING";
const ACTION_IS_REGION_SELECTED = "ACTION_IS_REGION_SELECTED";
const ACTION_SET_COOKIES = "ACTION_SET_COOKIES";

export const types = {
  ACTION_SET_APP_FULFILLMENT,
  ACTION_SET_LOCATION,
  ACTION_SET_ROUTE,
  ACTION_SET_LANG,
  ACTION_SET_LOCALIZATION_SETTING,
  ACTION_SET_COOKIES,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_LANG:
      return {
        ...state,
        localizationSettings: {
          ...state.localizationSettings,
          lang: action.lang,
        },
      };

    case ACTION_SET_APP_FULFILLMENT:
      return {
        ...state,
        fulfillmentCode: action.fulfillmentCode,
      };

    case ACTION_SET_LOCALIZATION_SETTING:
      return {
        ...state,
        localizationSettings: action.settings,
        cookies: {
          ...state.cookies,
          isRequired: checkIfRequired(action.settings.regionCode)
        }
      };

    case ACTION_SET_LOCATION:
      return {
        ...state,
        location: action.location,
      };

    case ACTION_IS_REGION_SELECTED:
      return {
        ...state,
        isRegionSelectedByUser: action.isSelectedByUser,
      };

    case ACTION_SET_ROUTE:
      const urlObject = new URL(action.url);

      Router.setLocaleRoot(action.root);

      const route = {
        ...state.route,
        root: action.root != "/" ? action.root : "",
        url: action.url,
        hostname: action.hostname ? action.hostname : urlObject.hostname,
        path: action.path ? action.path : urlObject.pathname,
        hash: action.hash ? action.hash : urlObject.hash,
        params: action.params
          ? action.params
          : getAllUrlParams(urlObject.search), //urlObject.searchParams,
      };
      // route.pageType = RouterPages.findPageTypeByURL(action.path)

      route.pathWithoutLocale =
        route.root == "/" ? route.path : route.path.replace(route.root, "");

      return { ...state, route };

    case ACTION_SET_COOKIES:
      return {
        ...state,
        cookies: {
          ...state.cookies,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
