/**
 * Created by developercomputer on 27.10.15.
 */
var React = require("react"),
    menuElements = require("./menu-elements");

class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  /*
   *rendering of elements
   * @param {array} data -  array of objects
   */
  _renderList(data) {
    return data.map((item, i) => {
      return (
        <li key={i}>
          <a href={item.href} className="item-link item-content">
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
