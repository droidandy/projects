var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var app = require('../f7init/f7init');
var dict = require('../dictionary.json');
var Word = require('./Word.js');

var WordsList = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('App')],

  getStateFromFlux: function() {
    var applicationStore = this.getFlux().store('App');
    return {
      favorites: applicationStore.favorites,
      langTo: applicationStore.langTo,
      langFrom: applicationStore.langFrom,
      pickup: applicationStore.pickup,
      swear_words: applicationStore.swear_words,
      offline: applicationStore.offline,
    };
  },

  addFavorites: function (idx) {
    var flux = this.getFlux();
    flux.actions.app.addFavorite(idx);
  },

  render: function(){
    var wordsList = [];
    var self = this;
    var favorites = this.state.favorites;
    var applicationStore = this.getFlux().store('App');
    Dom7.each(dict, function (idx, wordObj) {
      var wordAvailable = true;
      if (wordObj.mode) {
        if (!applicationStore[wordObj.mode]) {
          wordAvailable = false;
        }
      }
      if (wordAvailable) {
        switch (self.props.type) {
          case "all":
            wordsList.push(<Word flux={self.props.flux} key={wordObj.id} addFavorites={self.addFavorites} wordObj={wordObj} />);
            break;
          case "favorites":
            if (favorites.indexOf(wordObj.id) > -1) {
              wordsList.push(<Word flux={self.props.flux} key={wordObj.id} addFavorites={self.addFavorites} wordObj={wordObj} />);
            }
            break;
          default:
        }
      }
    });
    return(
      <div>
        {wordsList}
      </div>
    );
  }

});

module.exports = WordsList;
