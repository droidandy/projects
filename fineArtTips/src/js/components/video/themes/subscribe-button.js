/**
 * Created by developercomputer on 18.12.15.
 */
import React, { Component } from "react"
var words = require("./../../../words"),
    { f7 } = require("./../../../f7init/f7init");

class SubscribeButton extends Component {

  openSubscribePage() {
    var ref = window.open(`subscribe-page.html?LN=${LN}`, '_blank', 'location=no');
    const callback = (e) => {
      console.log(e);
      if(e.url === "https://www.youtube.com/post_login?mode=subscribe") {
        ref.close();
        ref.removeEventListener("loadstart", callback);
        return window.open('subscribe-page.html', '_system', 'location=no');
      }
    };
    ref.addEventListener('loadstart', callback);
  }

  androidHookSub() {
    var urlEN = "https://www.youtube.com/user/fineartebooks?sub_confirmation=1";
    var urlES = "http://www.youtube.com/user/artedivierte?sub_confirmation=1";
    var url = LN === "en" ? urlEN : urlES;
    window.open(url, '_blank', 'location=no');
  }

  render() {
    var { onLine } = this.props;
    var visibility = onLine ? "block" : "none";
    var cb = f7.device.ios ? this.openSubscribePage.bind(this) : this.androidHookSub;
    return (
        <div
            style={{
             display: visibility,
             height: "50px",
             width: "100%",
             padding: "10px"
            }}>
          <div
              className="button button-big color-red"
              onClick={cb}>
            {words.yt_sub[LN]}
          </div>
        </div>
    );
  }
}

module.exports = SubscribeButton;
