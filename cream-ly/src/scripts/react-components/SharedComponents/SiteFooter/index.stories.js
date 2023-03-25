import React from "react";
import Footer from ".";

export const getTitleData = lang => {
  return "Sections/SiteFooter/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: "Sections/SiteFooter/" + lang.toUpperCase(),
  component: Footer,
  excludeStories: /.*Data$/
};

const configs = {
  lang,
  host: "cream.ly",
};

export const defaultState = (extraData) => <Footer {...configs} {...extraData} />;

export const userLoggedIn = (extraData) => <Footer {...configs} {...extraData} isCustomerLoggedIn />;

export const creamlyRU = (extraData) => <Footer {...configs} {...extraData} host="creamly.ru" />;
export const creamlyBY = (extraData) => <Footer {...configs} {...extraData} host="creamly.by" />;
export const creamlyUK = (extraData) => <Footer {...configs} {...extraData} host="creamly.by" />;

// export const english = () => <InstagramFeedback lang="en" />;
