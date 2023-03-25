/**
 * Created by developercomputer on 24.11.15.
 */
var React = require("react"),
    Store = require("./../../stores/store"),
    words = require("./../../words");

class Sharer extends React.Component {
  share() {
    window.plugins.socialsharing.share(null, null, Store.currentFanArtURL, null);
  }

  render() {
    return (
        <div className="actionsPanel--button share" onClick={this.share}>
          <div className="text">{words.share[LN]}</div>
        </div>
    );
  }
}

module.exports = Sharer;
