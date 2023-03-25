var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var PropTypes = React.PropTypes;

var Word = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('App')],

  getStateFromFlux: function() {
    var applicationStore = this.getFlux().store('App');
    return {
      favorites: applicationStore.favorites,
      langTo: applicationStore.langTo,
      langFrom: applicationStore.langFrom,
      pickup: applicationStore.pickup,
      swear_words: applicationStore.swear_words
    };
  },

  addFavorites: function (e) {
    this.props.addFavorites(this.props.wordObj.id);
    var className = Dom7(e.target).attr('class');
    var action;
    if (Dom7('#' + this.props.wordObj.id).hasClass('favorite-inactive')) {
      Dom7('#' + this.props.wordObj.id).removeClass('favorite-inactive');
      Dom7('#' + this.props.wordObj.id).addClass('favorite-active');
      action = 'add to ';
    } else {
      Dom7('#' + this.props.wordObj.id).removeClass('favorite-active');
      Dom7('#' + this.props.wordObj.id).addClass('favorite-inactive');
      action = 'remove from ';
    }
    flurry.logEvent(action + 'favorites ' + this.props.wordObj.English, function() {
      console.log('event sent');
    }, function(err) {
      console.log(err);
    });
  },

  handleTTS: function (e) {
    var value = this.props.wordObj[this.state.langTo];
    console.log(value);
    var locale = 'en-GB';
    switch (this.state.langTo) {
      case 'English':
        locale = 'en-GB';
        break;
      case 'French':
        locale = 'fr-FR';
        break;
    }
    TTS.speak({
      text: value,
      locale: locale
    }, function () {

    }, function () {

    });

    flurry.logEvent('speech-button-click word: ' + value, function() {
      console.log('event sent');
    }, function(err) {
      console.log('speech-button-click word: ' + value + 'failed: ', err);
    });
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    var favoriteToggled = nextState.favorites.indexOf(this.props.wordObj.id) != this.state.favorites.indexOf(this.props.wordObj.id);
    var changedLang = nextState.langFrom != this.state.langFrom || nextState.langTo != this.state.langTo;
    return favoriteToggled || changedLang;
  },

  render: function() {
    var wordObj = this.props.wordObj;
    var langFrom = wordObj[this.state.langFrom];
    var langTo = wordObj[this.state.langTo];
    var phonetics = wordObj[this.state.langTo + "_phonetics"];
    var starClass = 'favorite-inactive';
    if (this.state.favorites.indexOf(wordObj.id) > -1) {
      starClass = 'favorite-active';
    }
    return (
      <li className="item-content word-base">
        <div className="item-media speach-block">
          <span className="tts-speakers" onClick={this.handleTTS}/>
        </div>
        <div className="item-inner word-inner">
            <div className="item-title lang-from searched-lang">{langFrom}</div>
            <div className="">
              <span className="lang-to">
                  <b style={{color: "black"}} className="searched-lang">{langTo}</b>
              </span>
              <span className="phonetics">
                {phonetics}
              </span>
            </div>
        </div>
        <div className="item-after"><span onClick={this.addFavorites} id={wordObj.id} className={starClass}/></div>
      </li>
    );
  }

});

module.exports = Word;
