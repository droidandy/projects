/**
 * Created by developercomputer on 13.11.15.
 */
var React = require("react"),
    menuElements = require("./menu-elements");

class SideMenu extends React.Component {
  _renderList(data) {
    return data.map((item, i) => {
      return (
          <li key={i}>
            <a href={item.href} className="item-link item-content close-panel">
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

module.exports = SideMenu;
