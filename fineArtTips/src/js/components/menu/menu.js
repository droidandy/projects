/**
 * Created by developercomputer on 27.10.15.
 */
var React = require("react"),
    menuElements = require("./menu-elements"),
    app = require("./../../f7init/f7init"),
    words = require("./../../words");

class Menu extends React.Component {

  componentDidMount() {
    const { platform } = this.props;
    $$(".vip-zone").on("click", function() {
      let messageTitle = "VIP",
          message = words.upgradeMessageVip[LN];
      app.f7.confirm(message, messageTitle, () => {
        app.f7.showIndicator();
        var Upgrade = Parse.Object.extend("Upgrade");
        var query = new Parse.Query(Upgrade);
        query.find({
          success: results => {
            var url;
            try {
              url = results[0].toJSON()[`url_${platform}`];
            } catch(e) {
              console.log(e);
              url = "https://itunes.com";
            }
            app.f7.hideIndicator();
            cordova.InAppBrowser.open(url, "_system", 'location=no');
          },
          error: error => {
            app.f7.hideIndicator();
            console.log("Error: " + error.code + " " + error.message);
          }
        });
      });
    });
  }

  /*
   *rendering of elements
   * @param {array} data -  array of objects
   */
  _renderList(data) {
    return data.map((item, i) => {
      var isVip = "";
      if(item.hasOwnProperty("free")) {
        if(item.free) {
          isVip = "vip-zone";
        }
      }
      return (
          <li key={i}>
            <a href={item.href} className={`item-link item-content ${isVip}`}>
              <div className="item-media">
                <i className={item.iconClass}></i>
              </div>
              <div className="item-inner">{item.name}</div>
            </a>
          </li>
      );
    });
  }

  render() {
    return (
      <div className="list-block home-menu">
        <ul>
          {this._renderList(menuElements)}
        </ul>
      </div>
    );
  }
}

module.exports = Menu;
