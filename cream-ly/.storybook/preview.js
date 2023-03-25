import React from "react";
import { Provider } from "react-redux";
import { addDecorator } from "@storybook/react";
import { projectId } from "../src/scripts/core/i18n";
import loadArticles from "@Core/app/init/blog";

import {
  INITIAL_VIEWPORTS,
  MINIMAL_VIEWPORTS,
} from "@storybook/addon-viewport";

//https://codekbyte.com/techbytes/devices-viewport-sizes/
const customViewports = {
  ...MINIMAL_VIEWPORTS,
  MacBookAir13inch: {
    name: "MacBook Air 13-inch",
    styles: {
      width: "1440",
      height: "770px",
    },
  },
  ultraWide: {
    name: "Ultra Wide",
    styles: {
      width: "2560",
      height: "1080px",
    },
  },
};

export const parameters = {
  viewport: {
    viewports: customViewports,
  },
  chromatic: { viewports: [320, 768, 1200] },
};

import { createGlobalStyle, css } from "styled-components";

import cssFile from "../src/styles/theme.scss";

import { newStore } from "../src/scripts/core/redux";

export const bodyStyles = css`
  ${cssFile}
`;

export const GlobalStyle = createGlobalStyle`
.sb-heading.#error-message {color:#fff}
  .sb-show-main.sb-main-padded {padding:0}
  #storybook-preview-wrapper {padding:0 !important;}

  body {
    ${bodyStyles}
  }
`;

const getLangFromParameters = (args) => {
  const lang = args && args.parameters.lang ? args.parameters.lang : undefined;
  return lang;
};

export const globalDecorator = (story, args) => {
  const lang = getLangFromParameters(args);
  const store = newStore(lang);

  // set articles for blog
  loadArticles();

  return (
    <>
      <GlobalStyle />
      <Provider store={store}>{story()}</Provider>
    </>
  );
};

addDecorator(globalDecorator);
