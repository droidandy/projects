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
    words = require("./../../../words");


function prepareItemsForCaching(items) {
  var copy = items.slice();
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
    var { id } = this.props;
    if(id) {
      return this.fetchPhotosInPhotoset();
    }
    Store.bind("fetchPhotosInPhotoset", this.fetchPhotosInPhotoset);
  }

  componentDidUpdate() {
    $$(`[data-page="photoGallery-photos"]>.page-content`).scrollTo(0,0);
  }

  fetchPhotosInPhotoset() {
    this.setState({ items: [] });
    var photosetId;
    var { id } = this.props;
    if(!id) {
      photosetId = Store.photosetId;
    } else {
      photosetId = id;
    }
    var networkState;
    if(navigator.connection) {
      networkState = navigator.connection.type;
    } else {
      networkState = false;
    }
    let CONNECTION_NONE;
    if(window.Connection) {
      CONNECTION_NONE = Connection.NONE;
    } else {
      CONNECTION_NONE = true;
    }
    if(networkState == CONNECTION_NONE) {
      if(localStorage.getItem(ls.LS_PHOTOS_KEY + photosetId) != null) {
        this.setState({ items: JSON.parse(localStorage.getItem(ls.LS_PHOTOS_KEY + photosetId)) });
      }
    } else {
      let url = flickr.photosets_getPhotos(photosetId, flickr.user_id);
      $$.ajax({
        url,
        success: data => {
          data = JSON.parse(data);
          let items = data.photoset.photo;
          this.setState({ items });
          let thisLSKey = ls.LS_PHOTOS_KEY + photosetId;
          if(localStorage.getItem(thisLSKey) == null) {
            console.log("caching albums information");
            let prefixName = prefixes.photo + photosetId;
            cache(thisLSKey, prepareItemsForCaching(items), prefixName);
          }
        },
        beforeSend: () => {
          if(!id) return false;
          setTimeout(() => app.f7.hideIndicator(), 2);
        },
        error: () => this.setState({ items: [] })
      });
    }
  }

  browsePhoto() {
    let currentImageIndex = 0;
    this.photos.forEach((item, i) => item === this.url ? currentImageIndex = i : 0);
    const getDescription = (id) => {
      let descContainer = document.getElementById("desc-container");
      descContainer.innerHTML = "";
      $$.ajax({
        url: flickr.photosets_getInfo(id),
        success: data => {
          data = JSON.parse(data);
          let desc = data.photo.description._content.split("\n").map((item) => {
            if(item === "") {
              return ``;
            }
            return `<span>${item}</span>`;
          });
          descContainer.innerHTML = `<span class="title">${data.photo.title._content}</span>${desc.join("")}`;
        }
      });
    };
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
      toolbarTemplate: this.flag ? "<div></div>" : `
        <div class="toolbar tabbar high-tower">
          <div class="toolbar-inner">
            <div class="photo-desc-container" id="desc-container"></div>
          </div>
        </div>`,
      onOpen: () => this.flag ? (() => {})() : getDescription(this.idCollection[currentImageIndex]),
      //onClose: () => $$(".statusbar-overlay").css({ background: "#f7f7f8" }),
      onSlideChangeEnd: (s) => {
        currentImageIndex = s.activeIndex;
        return this.flag ? (() => {})() : getDescription(this.idCollection[currentImageIndex]);
      }
    });
    browser.open(currentImageIndex);
    const pin_url = "http://www.artistleonardo.com/";
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
      let idCollection = this.state.items.map((item) => item.id);
      let context = {
        photos: otherPhotos,
        currentId: item.id,
        idCollection,
        url,
        flag: this.props.id ? true : false
      };
      return (
          <li className="photoGallery--photo" key={i} onClick={this.browsePhoto.bind(context)}>
            <div className="thumbnail" style={bg}></div>
          </li>
      );
    });
  }
  
  render() {
    let num;
    if(!this.props.id) {
      num = <div className="photos--num">{this.state.items.length} photos:</div>;
    }
    return (
        <div className="wrapper">
          {num}
          <ul className="photoGallery photo-search">
            {this._renderPhotos()}
          </ul>
        </div>
    );
  }
}

module.exports = PhotosList;
