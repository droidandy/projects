import { blogArticles } from "@Core/api/shopify.storefront/blog";

const initialState = {
  articles: blogArticles,
};

const ACTION_SET_ARTICLES = "ACTION_SET_ARTICLES";

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_ARTICLES:
      return {
        ...state,
        articles: action.payload,
      };
    default:
      return state;
  }
};
