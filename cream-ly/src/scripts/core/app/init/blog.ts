import store from "@Core/redux";
import { getArticles } from "@Core/api/shopify.storefront/blog";

const loadArticles = async () => {
  const articles = await getArticles();

  store.dispatch({
    type: "ACTION_SET_ARTICLES",
    payload: articles,
  });
};
export default loadArticles;
