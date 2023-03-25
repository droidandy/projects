import buildConfig from "../../../build_config";

export interface ThemeShape {
  name: string;
  host: string;
  assetURL: string;
  lang: string;
  currency: {
    isoCode: string;
    format: string;
    exchangeEUR: number;
    exchangeBYN: number;
    isShopifyCurrency: boolean;
  };
  build: {
    production: boolean;
    git: {
      hash: string;
      branch: string;
    };
  };
}

const initialState: ThemeShape = {
  name: undefined,
  host: undefined,
  assetURL: "/",
  lang: "ru",
  currency: {
    isoCode: "EUR",
    exchangeEUR: 1,
    exchangeBYN: 1,
    isShopifyCurrency: true,
    format: "€ {{amount_no_decimals}} EUR",
  },
  build: {
    production: false,
    git: {
      hash: undefined,
      branch: undefined,
    },
  },
};

const ACTION_SET_THEME = "ACTION_SET_THEME";
const ACTION_SET_CURRENCY = "ACTION_SET_CURRENCY";
export const types = {
  ACTION_SET_THEME,
  ACTION_SET_CURRENCY,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ACTION_SET_THEME:
      return {
        ...state,
        name: action.theme.name,
        assetURL: action.theme.assetURL,
        host: action.theme.host,
        lang: action.theme.locale,
        build: buildConfig,
      };
    case types.ACTION_SET_CURRENCY:
      return {
        ...state,
        currency: {
          isoCode: action.currency.code,
          format: action.currency.format,

          exchange: action.currencyExchange, //where is it used?

          exchangeEUR: action.currency.rateExchange.EUR,
          exchangeBYN: action.currency.rateExchange.BYN,

          isShopifyCurrency: action.currencyExchange == 1 ? true : false,
        },
      };

    default:
      return state;
  }
};
