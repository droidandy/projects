document.addEventListener("DOMContentLoaded", () => {
    let app = require("./f7init/f7init");
    function changeDots(){
        var dotsBlock = Dom7('#loading-dots');
        if (dotsBlock.html() && dotsBlock.html().length < 3) {
            var dots = dotsBlock.html();
            dots += '.';
            dotsBlock.html(dots);
        } else if (dotsBlock.html()) {
            dotsBlock.html('.');
        }
    }
    changeDots();
    setInterval(changeDots, 700);
    app.f7.init();
    var rmBlur = function () {
        Dom7('.page').removeClass('blur');
    };
    var addBlur = function () {
        Dom7('.page').addClass('blur');
    };
    setTimeout(function () {
      Dom7('.splashscreen').remove();
    }, 3000);
    Dom7('.favorites-link').on('click', function (e) {
      app.mainView.router.loadPage('#favorites');
      flurry.logEvent('click favorites link', function() {
        console.log('event sent');
      }, function(err) {
        console.log(err);
      });
    });
    Dom7('.share-link').on('click', function (e) {
      addBlur();
      window.plugins.socialsharing.share('200 basic words application', null, null, 'http://www.google.com', rmBlur, rmBlur);
      flurry.logEvent('click share link', function() {
        console.log('event sent');
      }, function(err) {
        console.log(err);
      });
    });
    Dom7('#test-purchase').on('click', function (e) {
      store.order("swear_words");
    });
    Dom7('#purchase-online').on('click', function (e) {
      store.order("offline.mode");
    });
    var inAppMenu = Dom7('.in-app-purchase');
    Dom7('#upgrade-app').click(function () {
        addBlur();
        inAppMenu.show();
    });
    Dom7('.close-in-app').click(function () {
        rmBlur();
        inAppMenu.hide();
    });
    Dom7('#rate-app').on('click', function (e) {
      AppRate.promptForRating(true);
      localStorage.setItem("rate-app", "1");
    });
    Dom7('#offline-title').click(function () {
        store.order('offline.mode');
    });
    Dom7('#swear-words-title').click(function () {
        store.order('swear_words');
    });
    Dom7('#pickup-title').click(function () {
        store.order('pickup');
    });
    Dom7('#about-app').on('click', function (e) {
      Dom7('.popover-about').on('open', function () {
        app.f7.closeModal('.popover-links');
        addBlur();
      });
      app.f7.popover('.popover-about', '.page-content');
      Dom7('.popover-about').on('close', function () {
        rmBlur();
      })
    });
}, false);
//
document.addEventListener("deviceready", () => {
  let ads = require("./ads/core.js");
  let flurry = require('./flurry/core.js'),
      renderComponents = require("./main/renderComponents.js"),
      appRate = require('./rate/core.js'),
      offline = require('./offline/core.js');
  renderComponents();
  flurry.init();
  if (localStorage.getItem('offline-mode') == "1") {
    offline.hideOverlay();
  }
  setTimeout(appRate.rateTimeout, 1000 * 60 * 30);
  setTimeout(ads.showInterstitial, 3000);
  setInterval(ads.showInterstitial, 1000 * 60 * 5);
  setTimeout(ads.showBanner, 1500);
}, false);
