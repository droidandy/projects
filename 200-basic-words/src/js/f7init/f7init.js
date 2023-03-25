var f7 = new Framework7({material: true, materialRipple: false});

var $$ = Dom7;

var mainView = f7.addView('.view-main', {
  dynamicNavbar: true,
  domCache: true,
  init: false
});

module.exports = {
  f7,
  mainView,
};
