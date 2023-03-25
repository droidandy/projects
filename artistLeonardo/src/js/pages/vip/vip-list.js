/**
 * Created by developercomputer on 28.11.15.
 */
var React = require("react"),
    VipVideos = require("./../../components/vip/vip-videos");

class VipListPage extends React.Component {
  render() {
    return (
        <div className="page-content white">
          <form
              className="searchbar searchbar-init"
              data-search-list=".__vip"
              data-search-in=".title"
              data-found=".__vip"
              data-not-found=".searchbar-not-found"
              >
            <div className="searchbar-input">
              <input type="search" placeholder="Search"/>
              <a href="#" className="searchbar-clear"></a>
            </div>
            <a href="#" className="searchbar-cancel">Cancel</a>
          </form>

          <div className="searchbar-overlay"></div>
          <VipVideos/>
        </div>
    );
  }
}

module.exports = VipListPage;
