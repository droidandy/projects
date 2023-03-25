/**
 * Created by developercomputer on 10.12.15.
 */
module.exports = function() {
  var app = require("./../../f7init/f7init");
  const words = require("./../../words");
  const LS_KEY = "__isAgreeCommunity?";
  var isAgree = localStorage.getItem(LS_KEY);
  if(isAgree != null) {
    return false;
  }
  var popupHTML = `
      <div class="popup navbar-fixed agree--popup tablet-fullscreen">
        <div class="page white">
            <div class="page-content white warning-page">
              <div class="content-block-warning">
                <p class="message">${words.adultWarning[LN]}</p>
                <p class="buttons-row choose">
                  <a href="#" class="button color-white decline-button close-popup">${words.leaveApp[LN]}</a>
                  <a href="#" class="button color-white agree-button close-popup">${words.continue[LN]}</a>
                </p>
              </div>
              <div class="bg"></div>
            </div>
          </div>
      </div>`;
  app.f7.popup(popupHTML);
  app.f7.sizeNavbars($$(".agree--popup"));
  $$(".agree-button").on("click", () => {
    localStorage.setItem(LS_KEY, "agree");
    app.mainView.router.loadPage("#index");
    app.mainView.history = ["#index"];
  });
  $$(".decline-button").on("click", () => {
    try {
      if(!app.f7.device.ios) {
        navigator.app.exitApp();
        var flag = true;
      }
    } catch(e) {
      console.log(e);
      flag = false;
    }
    if(flag) return false;
    app.mainView.router.loadPage("#warning");
    app.mainView.history = ["#warning"];
  });
};
