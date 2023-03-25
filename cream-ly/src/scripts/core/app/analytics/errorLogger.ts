import * as Sentry from "@sentry/browser";

export default (
  shopifyThemeName: string,
  release: string,
  isDebug: boolean = false
): void => {
  Sentry.init({
    dsn: "https://04a1029249684da9a22072503524d120@sentry.io/1551137",
    environment: shopifyThemeName,
    release,
    //integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    debug: isDebug,
  });
};
