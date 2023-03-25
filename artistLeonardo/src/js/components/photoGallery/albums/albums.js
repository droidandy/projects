/**
 * Created by developercomputer on 28.10.15.
 */
var React = require("react"),
    Store = require("./../../../stores/store"),
    app = require("./../../../f7init/f7init"),
    flickr = require("./../../../api/flickr"),
    cache = require("./../../../offline/cache"),
    ls = require("./../../../offline/lsKeys"),
    prefixes = require("./../../../offline/name-prefix");


function prepareItemsForCaching(items) {
  var copy = items.slice();
  copy.forEach(item => item.cacheURL = flickr.getAlbumThumbnail(item.farm, item.server, item.primary, item.secret));
  return copy;
}

class AlbumList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.fetchPhotosets = this.fetchPhotosets.bind(this);
    this._renderAlbums = this._renderAlbums.bind(this);
  }

  componentDidMount() {
    Store.bind("fetchPhotosets", this.fetchPhotosets);
  }

  fetchPhotosets() {
    if(this.state.items.length !== 0) {
      return false;
    }
    //here (and in future) we are using ajax instead of $$.getJSON cause getJSON by some reason do not work correctly
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
      if(localStorage.getItem(ls.LS_ALBUMS_KEY) != null) {
        this.setState({ items: JSON.parse(localStorage.getItem(ls.LS_ALBUMS_KEY)) });
      }
    } else {
      $$.ajax({
        url: flickr.photosets_getList(flickr.user_id),
        success: data => {
          /*
           * Note: No need to have photos of “Basics” and “Culture”.
           * Basics id: "72157649785340820"
           * Culture id: "72157650184328022"
           * FanArt id: "72157661026630422"
           * */
          data = JSON.parse(data);
          //const basicsId = "72157649785340820";
          //const cultureId = "72157650184328022";
          //const fanArtId = "72157661060234675";
          const mediaId = LN === "en" ? "72157662165724815" : "72157662419542046";
          let items = data.photosets.photoset.filter(item => item.id !== mediaId);
          console.log("caching albums information");
          cache(ls.LS_ALBUMS_KEY, prepareItemsForCaching(items), prefixes.album);
          this.setState({ items });
        },
        error() {
          console.warn("Error: could not load albums.");
        }
      });
    }
  }

  _renderAlbums() {
    if(this.state.items.length === 0) {
      return null;
    }
    return this.state.items.map((item, i) => {
      let url = item.cacheURL ? item.cacheURL : flickr.getAlbumThumbnail(item.farm, item.server, item.primary, item.secret);
      let bg = {
        backgroundImage: `url("${url}")`
      };
      return (
          <a href={`#photoGallery-photos?title=${item.title._content}&id=${item.id}`} className="photoGallery--elem" key={i}>
            {/*plain comment ha ha ha*/}
            <div className="title">{item.title._content}</div>
            <hr/>
            <div className="thumbnail" style={bg}></div>
          </a>
      );
    });
  }

  render() {
    return (
        <div className="photoGallery">
          {this._renderAlbums()}
        </div>
    );
  }
}

module.exports = AlbumList;
