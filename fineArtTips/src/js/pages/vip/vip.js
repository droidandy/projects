/**
 * Created by developercomputer on 27.11.15.
 */
var React = require("react"),
    VipZone = require("./../../components/vip/vip");

class VipZonePage extends React.Component {
  render() {
    return (
        <div className="page-content white">
          <VipZone/>
        </div>
    );
  }
}

module.exports = VipZonePage;
