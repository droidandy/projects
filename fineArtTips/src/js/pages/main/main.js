/**
 * Created by developercomputer on 27.10.15.
 */
var React = require("react"),
    Menu = require("./../../components/menu/menu"),
    { f7 } = require("./../../f7init/f7init");

class MainPage extends React.Component {
  render() {
    const platform = f7.device.ios ? "ios" : "android";
    return (
        <div className="page-content home-menu">
          <Menu platform={platform}/>
        </div>
    );
  }
}

module.exports = MainPage;