/**
 * Created by developercomputer on 27.11.15.
 */
var React = require("react"),
    LastVideoFetcher = require("./fetcher"),
    Store = require("./../../stores/store"),
    youtube = require("./../../api/youtube"),
    words = require("./../../words");

class VipZone extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetched: false
    };
    this.fetchVip = this.fetchVip.bind(this);
    this._renderVipList = this._renderVipList.bind(this);
  }

  componentDidMount() {
    Store.bind("fetchVip", this.fetchVip);
  }

  fetchVip() {
    if(this.state.isFetched) {
      return false;
    }
    $$.getJSON(youtube.getVideos(youtube.vip_playlist_id), res => {
      Store.keepVipData(res);
      this.setState({
        isFetched: true
      });
    });
  }

  _renderVipList() {
    if(!this.state.isFetched) {
      return null;
    }
    return (
        <a href="#vip-list" className="vip--list">
          <div className="thumb" style={{backgroundImage: `url(${Store.vipData.items[0].snippet.thumbnails.high.url})`}}></div>
          <div className="title">{words.vipMemberVideo[LN]}</div>
        </a>
    );
  }

  render() {
    return (
        <div className="vip">
          {this._renderVipList()}
          <LastVideoFetcher/>
        </div>
    );
  }
}

module.exports = VipZone;
