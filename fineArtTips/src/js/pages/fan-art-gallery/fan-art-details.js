/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    FanArtDetails = require("./../../components/fan-art/fan-art-details");

class FanArtDetailsPage extends React.Component {
  render() {
    return (
        <div className="page-content">
          <FanArtDetails />
        </div>
    );
  }
}

module.exports = FanArtDetailsPage;