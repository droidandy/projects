/**
 * Created by developercomputer on 27.11.15.
 */
var React = require("react"),
    OtherApps = require("./../../components/otherApps/other"),
    { f7 } = require("./../../f7init/f7init");

class OtherPage extends React.Component {
  render() {
    const platform = f7.device.ios ? "ios" : "android";
    return (
        <div className="page-content white">
          <OtherApps platform={platform}/>
        </div>
    );
  }
}

module.exports = OtherPage;
