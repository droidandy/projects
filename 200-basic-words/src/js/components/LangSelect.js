var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var app = require('../f7init/f7init');

var LangPopover = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('App')],

  getStateFromFlux: function() {
    var store = this.getFlux().store('App');
    return {
      langFrom: store.langFrom,
      langTo: store.langTo,
      languages: store.langs,
    };
  },

  setLangFrom: function (e) {
    var flux = this.getFlux();
    var lang = Dom7(e.target).text();
    flux.actions.app.setLangFrom(lang);
    this.sendFlurryEvent(e);
  },

  setLangTo: function (e) {
    var flux = this.getFlux();
    var lang = Dom7(e.target).text();
    flux.actions.app.setLangTo(lang);
    this.sendFlurryEvent(e);
  },

  sendFlurryEvent: function (e) {
    var lang = Dom7(e.target).text();
    var type;
    switch (this.props.type) {
      case 'langFrom':
        type = 'from ';
        break;
      case 'langTo':
        type = 'to ';
        break;
      default:

    }
    flurry.logEvent('click translate ' + type + lang, function() {
      console.log('event sent');
    }, function(err) {
      console.log(err);
    });
  },

  render: function(){
    var self=this;
    var languages = [];
    var clickCallback;
    var type = this.props.type;
    if (this.props.type == 'langFrom') {
      clickCallback = this.setLangFrom;
    } else {
      clickCallback = this.setLangTo;
    }
    Dom7.each(this.state.languages, function (idx, lang) {
      var selected = false;
      var className = ' inactive-language';
      if (lang == self.state[type]) {
        selected = true;
        className = ' active-language';
      }
      languages.push(
        <li key={idx}><a  href="#" onClick={clickCallback} className={"list-button item-link close-popover" + className}>{lang}</a></li>
      );
    });
    return(
      <div>
        <div className="popover-angle"/>
        <div className="popover-inner">
          <div className='list-block'>
            <ul>
              {languages}
            </ul>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = LangPopover;
