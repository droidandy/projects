import React from "react";

import { action, actions } from "@storybook/addon-actions";

import PageLink from ".";

export default {
  title: "@Components/Structure/PageLink",
  component: PageLink,
};

const defaultProps = {
  lang: "ru",

  onClick: action("onClick"),
};

const withTextPropData = {
  ...defaultProps,
  text: "link text...",
};

export const withTextProp = () => <PageLink {...withTextPropData} />;

export const withChildren = () => (
  <PageLink {...defaultProps}>
    <span>text in children</span>
  </PageLink>
);

const withPageTypePropData = {
  ...defaultProps,
  pageType: "PAGE_QUIZ_OR_RESULTS",
  pageOptions: { skinType: "normal", skinGoals: ["wrinkles"] },
};
export const withPageType = () => (
  <PageLink {...withPageTypePropData}>some text</PageLink>
);
