import { getList } from "../../products";
import { getVideosList } from "../../products/video";
import { getLang } from "../lang";

const initialState = {
  list: [],
  videos: [],
};

const ACTION_SET_PRODUCTS = "ACTION_SET_PRODUCTS";

export const types = {
  ACTION_SET_PRODUCTS,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_PRODUCTS:
      const currencyCode = action.currencyCode ? action.currencyCode : "EUR";
      const currencyExchange =
        currencyCode == "BYN" ? action.currencyExchangeBYN : 1;
      const skuPricesPairs = action.skuPricesPairs;

      return {
        list: getList(null, currencyCode, currencyExchange, skuPricesPairs),
        videos: getVideosList(
          getLang(),
          currencyCode,
          currencyExchange,
          skuPricesPairs
        ),
      };

    default:
      if (state.list.length == 0) {
        const lang = getLang();

        return {
          list: getList(),
          videos: getVideosList(lang),
        };
      }

      return state;
  }
};
