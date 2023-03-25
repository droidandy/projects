var Dispatcher = require("./../dispatcher").Dispatcher;

var f7 = new Framework7({
  swipePanelCloseOpposite: true
});

window.$$ = Dom7;

var mainView = f7.addView('.view-main', {
  init: false,
  dynamicNavbar: true,
  domCache: true
});

$$(document).on('ajaxStart', () => {
  f7.showIndicator();
});

$$(document).on('ajaxComplete ajaxError', () => {
  f7.hideIndicator();
});

module.exports = {
  f7,
  mainView,
  AppDispatcher: new Dispatcher(),
  init() {
    f7.init();
  }
};
