/**
 * Created by developercomputer on 27.11.15.
 */
var React = require("react"),
    app = require("./../../f7init/f7init"),
    drive = require("./../../api/drive"),
    words = require("./../../words");

class LastVideoFetcher extends React.Component {

  constructor(props) {
    super(props);
    this.state =  {
      ios: app.f7.device.ios
    };
  }

  downloadLastVideo() {
    $$.ajax({
      url: drive.query(),
      success(res) {
        res = JSON.parse(res);
        cordova.InAppBrowser.open(res.webContentLink, "_system", 'location=no');
      }
    });
  }

  render() {
    let visibilityState = this.state.ios ? "none" : "";
    return (
        <div className="vip--fetcher" onClick={this.downloadLastVideo} style={{display: visibilityState}}>
          {words.weeklyVideoDownload[LN]}
          <img src="img/icon-download.svg" alt="" style={{marginLeft: 15}}/>
        </div>
    );
  }
}

module.exports = LastVideoFetcher;
