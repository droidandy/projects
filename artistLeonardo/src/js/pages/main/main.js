/**
 * Created by developercomputer on 27.10.15.
 */
var React = require("react"),
    Menu = require("./../../components/menu/menu");

class MainPage extends React.Component {
  render() {
    return (
        <div className="page-content home-menu">
          <Menu/>
        </div>
    );
  }
}

module.exports = MainPage;