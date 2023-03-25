var Fluxxor = require('fluxxor');
var favoritesConstants = require('../constants/favorites.js');
var appConstatnts = require('../constants/app.js');

var AppStore = Fluxxor.createStore({

  initialize: function() {
    this.initInappStore();
    this.initLocalStorage();
    this.langTo = 'English';
    this.langFrom = 'French';
    this.langs = ['English', 'French'];
    this.swear_words = store.get('swear_words');
    this.pickup = store.get('pickup');
    this.offline = store.get('offline.mode');
    this.bindActions(
      favoritesConstants.ADD, this.addFavorite,
      appConstatnts.SETLANGFROM, this.setLangFrom,
      appConstatnts.SETLANGTO, this.setLangTo,
      appConstatnts.SWITCHLANG, this.switchLanguages
    );
  },

  initLocalStorage: function () {
    var favoritesData = JSON.parse(localStorage.getItem('favorites'));
    if (favoritesData) {
      this.favorites = favoritesData;
    } else {
      localStorage.setItem('favorites', JSON.stringify([]));
      this.favorites = [];
    }
    var remindOffline = JSON.parse(localStorage.getItem('remind-offline'));
    if (!remindOffline) {
      localStorage.setItem('remind-offline', "0");
    }
    var offlineMode = localStorage.getItem('offline-mode');
    if (!offlineMode) {
      localStorage.setItem("offline-mode", "0");
    }
    var appRated = localStorage.getItem('app-rated');
    if (!appRated) {
      localStorage.setItem("app-rated", "0");
    }
    var pickup = localStorage.getItem('pickup');
    if (!pickup) {
      localStorage.setItem("pickup", "0");
      this.pickup = 0;
    }
    if (store.get('pickup').owned) {
      localStorage.setItem("pickup", "1");
      this.pickup = 1;
    }
    var swear_words = localStorage.getItem('swear_words');
    if (!swear_words) {
      localStorage.setItem("swear_words", "0");
      this.swear_words = 0;
    }
    if (store.get('swear_words').owned) {
      localStorage.setItem("swear_words", "1");
      this.swear_words = 1;
    }
  },

  initInappStore: function () {
    var self = this;
    if (!window.store) {
      console.log('store is not available');
    } else {
      store.register({
        id: 'swear_words',
        alias: "swear_words",
        type: store.NON_CONSUMABLE
      });
      store.register({
        id: 'offline.mode',
        alias: "offline.mode",
        type: store.NON_CONSUMABLE
      });
      store.register({
        id: 'pickup',
        alias: "pickup",
        type: store.NON_CONSUMABLE
      });
      store.refresh();
    }
    store.when("offline.mode").updated(function () {
      var title = store.get('offline.mode').title;
      if(title){
        Dom7('#offline-title').html(title);
      }
    });
    store.when("pickup").updated(function () {
      var title = store.get('pickup').title;
      if(title){
        Dom7('#pickup-title').html(title);
      }
    });

    store.when("swear_words").updated(function () {
      var title = store.get('swear_words').title;
      if(title){
        Dom7('#swear-words-title').html(title);
      }
    });
    store.when('offline.mode').approved(function (product) {
      product.finish();
      localStorage.setItem('offline-mode', "1");
    });
    store.when('swear_words').approved(function (product) {
      product.finish();
      localStorage.setItem('swear_words', "1");
      self.swear_words = 1;
      self.emit('change');
    });
    store.when('pickup').approved(function (product) {
      product.finish();
      localStorage.setItem('pickup', "1");
      self.pickup = 1;
      self.emit('change');
    });
  },

  addFavorite: function (idx) {
    if (this.favorites.indexOf(idx) > -1) {
      this.favorites.splice(this.favorites.indexOf(idx), 1);
    } else {
      this.favorites.push(idx);
    }
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    this.emit('change');
  },

  setLangFrom: function (lang) {
    if (this.langTo == lang) {
      this.langTo = this.langFrom;
    }
    this.langFrom = lang;
    this.emit('change');
  },

  setLangTo: function (lang) {
    if (this.langFrom == lang) {
      this.langFrom = this.langTo;
    }
    this.langTo = lang;
    this.emit('change');
  },

  switchLanguages: function () {
    var langTo = this.langFrom;
    this.langFrom = this.langTo;
    this.langTo = langTo;
    this.emit('change');
  }

});

module.exports = new AppStore();
