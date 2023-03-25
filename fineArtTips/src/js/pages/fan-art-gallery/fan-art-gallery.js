/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    FanArtMain = require("./../../components/fan-art/fan-art-main"),
    Store = require("./../../stores/store");

class FanArtPage extends React.Component {

  componentDidMount() {
    $$(this.refs.fanList).on("refresh", e => Store.fetchFanArt());
  }

  render() {
    return (    
      <div
            className="page-content  page-content__fanArtGallery pull-to-refresh-content infinite-scroll"
            data-ptr-distance="55"
            data-distance="70"
            ref="fanList"
            >
          <div className="pull-to-refresh-layer">
            <div className="preloader"></div>
            <div className="pull-to-refresh-arrow"></div>
          </div>
          <FanArtMain />
        </div>
    );
  }
}

module.exports = FanArtPage;