// AppRate.preferences.storeAppURL.ios = '<my_app_id>';
AppRate.preferences.storeAppURL.android = 'market://details?id=com.integral.basicwords.inapp_test';
AppRate.preferences.useLanguage = 'en';

function rateTimeout() {
  if (localStorage.getItem("rate-app") != "1") {
    AppRate.promptForRating();
    localStorage.setItem("rate-app", "1");
  }
}

function rate() {
  AppRate.promptForRating(true);
  localStorage.setItem("rate-app", "1");
}

module.exports = {rateTimeout, rate};
