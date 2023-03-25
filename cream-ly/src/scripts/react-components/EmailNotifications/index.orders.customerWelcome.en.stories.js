import * as stories from "./index.orders.customerWelcome.stories";

const lang = "en";

export default {
  title: stories.getTitleData(lang),
};

export const example1 = (props) => {
  return stories.example1({ ...props, lang });
};
