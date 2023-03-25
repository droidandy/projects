import buildConfig from "../../../build_config";
import initErrorLogger from "@Core/app/analytics/errorLogger";
import init from "./init";

const initProps = () => {
  //https://shopify.dev/docs/themes/liquid/reference/objects/shop-locale
  // this window.theme and window.locale values are set it src/snipptets/_js_data.liquid
  const localeURIRoot =
    window.locale && window.locale.root ? window.locale.root : "/";
  const localeLanguageCode =
    window.locale && window.locale.iso_code ? window.locale.iso_code : "ru";

  return { ...window.theme, localeURIRoot, localeLanguageCode };
};

const indexInit = () => {
  const props = initProps();

  if (window.location.hostname !== "localhost") {
    initErrorLogger(
      props.shopifyThemeName,
      buildConfig.git.hash,
      false //getIsDebugOnFlag()
    );
  }

  init(props);
};

//this is loaded by src/scripts/layout/theme.js
indexInit();
