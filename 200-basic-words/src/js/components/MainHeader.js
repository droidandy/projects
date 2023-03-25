var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var app = require('../f7init/f7init');

var MainHeader = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('App')],

  getStateFromFlux: function() {
    var store = this.getFlux().store('App');
    return {
      langFrom: store.langFrom,
      langTo: store.langTo,
    };
  },

  switchLanguages: function () {
    var flux = this.getFlux();
    flux.actions.app.switchLanguages();
  },

  render: function(){

    return(
      <div className="center" style={{justifyContent: "space-between"}}>
        <div className="open-popover" data-popover=".popover-lang-from">{this.state.langFrom}</div>
         <span className="swap-arrow-white" onClick={this.switchLanguages}></span>
        <div className="open-popover" data-popover=".popover-lang-to">{this.state.langTo}</div>
      </div>
    );
  }

});

module.exports = MainHeader;
