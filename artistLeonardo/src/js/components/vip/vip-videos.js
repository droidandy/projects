/**
 * Created by developercomputer on 28.11.15.
 */
var React = require("react"),
    Store = require("./../../stores/store"),
    app = require("./../../f7init/f7init");

class VipVideos extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this._renderElements = this._renderElements.bind(this);
    this.fetchVideos = this.fetchVideos.bind(this);
  }

  componentDidMount() {
    Store.bind("keepVipData", this.fetchVideos);
  }

  fetchVideos() {
    this.setState({ items: Store.vipData.items });
  }

  showVideo() {
    var browser = app.f7.photoBrowser({
      photos: [
        {
          html: `<iframe src="https://www.youtube.com/embed/${this.videoId}/?autoplay=1&controls=1&showinfo=0&autohide=1&feature=player_embedded&rel=0" allowfullscreen frameborder="0"></iframe>`
        }
      ],
      theme: 'dark',
      navbarTemplate: `
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="link close-popup photo-browser-close-link">
                        <span>Close</span>
                    </a>
                </div>
            </div>
        </div>`,
      toolbarTemplate: "<div></div>",
      onOpen: () => $$(".statusbar-overlay").css({ background: "#000" }),
      onClose: () => $$(".statusbar-overlay").css({ background: "#f7f7f8" })
    });
    browser.open();
  }

  _renderElements() {
    if(this.state.items.length === 0) {
      return (
          <div></div>
      );
    }
    return this.state.items.map((item, i) => {
      var bg = {
        backgroundImage: `""`
      };
      if(item.snippet.hasOwnProperty("thumbnails")) {
        bg = {
          backgroundImage: `url(${item.snippet.thumbnails.high.url})`
        };
      }
      var context = {
        videoId: item.snippet.resourceId.videoId
      };
      return (
          <li key={i} onClick={this.showVideo.bind(context)}>
            <div className="thumbnail" style={bg}></div>
            <div className="title">{item.snippet.title}</div>
          </li>
      );
    });
  }

  render() {
    return (
        <div className="video--tutorials">
          <div className="video--tutorials--num">{this.state.items.length} videos:</div>
          <ul className="video--tutorials--list __vip">
            {this._renderElements()}
          </ul>
        </div>
    );
  }
}

module.exports = VipVideos;
