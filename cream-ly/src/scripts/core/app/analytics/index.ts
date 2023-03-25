//@ts-nocheck
//import FacebookPixel from "react-facebook-pixel";
//import store from "../../redux";

export default (window, user): void => {
  googleAnalytics(window, user);
  displayHotJar(window);
  //facebookPixel();
};

export function displayHotJar(window) {
  // Hotjar Tracking Code for Cream.ly

  (function(window, document, t, j, a, r) {
    window.hj =
      window.hj ||
      function() {
        (window.hj.q = window.hj.q || []).push(arguments);
      };
    window._hjSettings = { hjid: 1227799, hjsv: 6 };
    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.setAttribute("async", "1");
    script.setAttribute("defer", "1");
    script.setAttribute(
      "src",
      t + window._hjSettings.hjid + j + window._hjSettings.hjsv
    );
    head.appendChild(script);
  })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
}

export function googleAnalytics(window, user) {
  if (user && user.id && window.ShopifyAnalytics)
    window.ShopifyAnalytics.merchantGoogleAnalytics = function() {
      ga("set", "userId", user.id);
    };
}

export function facebookPixel() {
  let isPixelShowed = false;
  const ukrainePixel = 913504309482067;

  store.subscribe(() => {
    const state: ReduxShape = store.getState();
    if (isPixelShowed || state.app.localizationSettings.fulfillmentCode != "UA")
      return;

    isPixelShowed = true;

    FacebookPixel.init(ukrainePixel);
    FacebookPixel.pageView();
  });
}

export function sendEvent(eventLabel) {
  if (typeof ga === "function")
    ga("send", {
      hitType: "event",
      eventCategory: "Video View",
      eventAction: "Video Play",
      eventLabel,
    });
}
