import PageProductsList from ".";
import * as stories from "./index.stories";

const lang = "lv";

export default {
  title: "Pages/ProductsList/" + lang.toUpperCase(),
  component: PageProductsList,
  excludeStories: /.*Data$/,
};

const extraProps = { lang };

export const defaultPage = (props) => {
  return stories.defaultPage({ ...props, ...extraProps });
};
export const outOfStock = (props) => {
  return stories.outOfStock({ ...props, ...extraProps });
};
export const recommendedProducts = (props) => {
  return stories.recommendedProducts({ ...props, ...extraProps });
};
