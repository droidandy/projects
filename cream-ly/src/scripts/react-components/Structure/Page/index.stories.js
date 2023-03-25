import React from "react";
import Page from "./index";

export default {
  title: "@Components/Structure/Page",
  component: Page,
};

const props = {
  header: "header text...",
};

export const deafultPage = () => <Page {...props} />;
