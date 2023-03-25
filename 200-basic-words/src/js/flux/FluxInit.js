var Fluxxor = require('fluxxor');

var AppStore = require('../store/App.js');

var favorites_actions = require('../actions/favorites.js');

var stores = {
  App: AppStore,
};

var actions = {
  app: favorites_actions,
};

var flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

module.exports = flux;
