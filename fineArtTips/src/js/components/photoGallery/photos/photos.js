/**
 * Created by developercomputer on 28.10.15.
 */
var React = require("react"),
    Store = require("./../../../stores/store"),
    app = require("./../../../f7init/f7init"),
    flickr = require("./../../../api/flickr"),
    cache = require("./../../../offline/cache"),
    ls = require("./../../../offline/lsKeys"),
    prefixes = require("./../../../offline/name-prefix"),
    back = require("./../../../router_back"),
    words = require("./../../../words");


function prepareItemsForCaching(items) {
  var copy = window.FREE ? items.slice(0, 3) : items.slice();
  copy.forEach(item => item.cacheURL = flickr.getPhotoThumbnail(item.farm, item.server, item.id, item.secret));
  return copy;
}

class PhotosList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.fetchPhotosInPhotoset = this.fetchPhotosInPhotoset.bind(this);
    this._renderPhotos = this._renderPhotos.bind(this);
  }

  componentDidMount() {
    Store.bind("fetchPhotosInPhotoset", this.fetchPhotosInPhotoset);
  }

  componentDidUpdate() {
    $$(`[data-page="photoGallery-photos"]>.page-content`).scrollTo(0,0);
  }

  fetchPhotosInPhotoset() {
    this.setState({ items: [] });
    var networkState = false;
    var CONNECTION_NONE;
    if(navigator.connection) {
      networkState = navigator.connection.type;
      CONNECTION_NONE = Connection.NONE;
    }
    if(networkState == CONNECTION_NONE) {
      if(localStorage.getItem(ls.LS_PHOTOS_KEY + Store.photosetId) != null) {
        if(window.FREE) {
          let messageTitle = "VIP",
              message = words.upgradeMessageGallery[LN];
          app.f7.alert(message, messageTitle);
        }
        this.setState({ items: JSON.parse(localStorage.getItem(ls.LS_PHOTOS_KEY + Store.photosetId)) });
      } else {
        this.setState({ items: [] });
      }
    } else {
      let url = flickr.photosets_getPhotos(Store.photosetId, flickr.user_id);
      $$.ajax({
        url,
        success: data => {
          data = JSON.parse(data);
          console.log(data);
          let items = data.photoset.photo;
          this.setState({ items });
          let thisLSKey = ls.LS_PHOTOS_KEY + Store.photosetId;
          if(localStorage.getItem(thisLSKey) == null) {
            console.log("caching albums information");
            let prefixName = prefixes.photo + Store.photosetId;
            cache(thisLSKey, prepareItemsForCaching(items), prefixName);
          }
        },
        error: () => this.setState({ items: [] })
      });
    }
  }

  browsePhoto() {
    let currentImageIndex = 0;
    this.photos.forEach((item, i) => item === this.url ? currentImageIndex = i : 0);
    let browser = app.f7.photoBrowser({
      photos: this.photos,
      theme: 'dark',
      navbarTemplate: `
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="link close-popup photo-browser-close-link">
                        <span>${words.close[LN]}</span>
                    </a>
                </div>
                <div class="right">
                    <a href="#" class="link icon-only share-button">
                        <i class="icon icon-share"></i>
                    </a>
                    <a href="#" class="link icon-only pinterest-button">
                        <i class="icon icon-pinterest"></i>
                    </a>
                </div>
            </div>
        </div>`,
      toolbarTemplate: "<div></div>",
      onOpen: () => {
        $$(".statusbar-overlay").css({ background: "#000" });
        try {
          AdMob.hideBanner();
        } catch(e) {
          console.log(e);
        }
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", browser.close);
      },
      onClose: () => {
        $$(".statusbar-overlay").css({ background: "#f7f7f8" });
        try {
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        } catch(e) {
          console.log(e);
        }
        $$(document).off("backbutton", browser.close);
        $$(document).on("backbutton", back);
      },
      onSlideChangeEnd: (s) => currentImageIndex = s.activeIndex
    });
    browser.open(currentImageIndex);
    const pin_url = "http://www.fineart-tips.com/";
    const desc = "";
    $$(".pinterest-button").on("click", () => {
      try {
        PDK.pin(this.photos[currentImageIndex], desc, pin_url, () => console.log("done"));
      } catch(e) {
        console.log(e);
      }
    });
    $$(".share-button").on("click", () => {
      window.plugins.socialsharing.share(null, null, this.photos[currentImageIndex], null);
    });
  }

  _renderPhotos() {
    if(this.state.items.length === 0) {
      return (
          <div></div>
      );
    }
    return this.state.items.map((item, i) => {
      let url = item.cacheURL ? item.cacheURL : flickr.getPhotoThumbnail(item.farm, item.server, item.id, item.secret);
      let bg = {
        backgroundImage: `url("${url}")`
      };
      var otherPhotos = this.state.items.map(item => {
        return item.cacheURL ? item.cacheURL : flickr.getPhotoThumbnail(item.farm, item.server, item.id, item.secret);
      });
      let context = {
        photos: otherPhotos,
        url
      };
      return (
          <li className="photoGallery--photo" key={i} onClick={this.browsePhoto.bind(context)}>
            <div className="thumbnail" style={bg}></div>
            <div className="title">{item.title}</div>
          </li>
      );
    });
  }

  render() {
    return (
        <div className="wrapper">
          <div className="photos--num">{this.state.items.length} photos:</div>
          <ul className="photoGallery photo-search">
            {this._renderPhotos()}
          </ul>
        </div>
    );
  }
}

module.exports = PhotosList;
