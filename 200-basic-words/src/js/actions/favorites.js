var favoritesConstants = require('../constants/favorites.js');
var appConstatnts = require('../constants/app.js');

var appActions = {

  initStore: function() {
    this.dispatch(favoritesConstants.INIT, localStorage);
  },

  addFavorite: function (idx) {
    this.dispatch(favoritesConstants.ADD, idx);
  },

  setLangFrom: function (lang) {
    this.dispatch(appConstatnts.SETLANGFROM, lang);
  },

  setLangTo: function (lang) {
    this.dispatch(appConstatnts.SETLANGTO, lang);
  },

  switchLanguages: function () {
    this.dispatch(appConstatnts.SWITCHLANG, {});
  },

};

module.exports = appActions;
