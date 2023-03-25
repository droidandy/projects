import getLocationData from "./getLocationData";
import getSettingsData from "./getSettingsData";
import initAnalytics from "@Core/app/analytics";

export default async (props) => {
  console.log("init app props", props);

  const locationData: app.ILocation = await getLocationData(
    window.location.hostname
  );

  console.log("locationData", locationData);

  const currentCurrencyCode = props.currency.code ? props.currency.code : "EUR";
  const shopifyLocaleURI = props.localeURIRoot ? props.localeURIRoot : "/";
  const shopifyLanguageCode = props.localeLanguageCode
    ? props.localeLanguageCode
    : "ru";

  const settings = await getSettingsData(
    locationData,
    currentCurrencyCode,
    shopifyLanguageCode
  );
  console.log("settings after getSettingsData", settings);

  if (!settings) return; //perform redirect
  importStyles();

  await importRedux(locationData, settings, shopifyLocaleURI);
  await importReactComponents();

  //@ts-ignore
  initAnalytics(window, window.theme.customer);
};

const importStyles = () => {
  return import(
    /* webpackChunkName: "styles" */
    /* webpackPreload: true */
    "../../../../styles/theme.scss"
  );
};

const importRedux = (locationData, settings, localeRoot) => {
  return import(
    /* webpackChunkName: "initRedux" */
    /* webpackPreload: true */
    "./initRedux"
  ).then((initModule) =>
    initModule.default(locationData, settings, localeRoot)
  );
};

const importReactComponents = () => {
  return import(
    /* webpackChunkName: "renderReactComponent" */
    /* webpackPreload: true */
    "./renderReactComponent"
  ).then((initModule) => {
    initModule.default();
  });
};
