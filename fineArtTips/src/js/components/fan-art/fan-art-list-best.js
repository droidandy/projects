/**
 * Created by developercomputer on 05.11.15.
 */
var React = require("react"),
    app = require("./../../f7init/f7init"),
    VirtualList = require("./VirtualList"),
    Store = require("./../../stores/store");

const AUTO_HIDE_INDICATOR_TIME = 5000; //ms

function preventLongIndication() {
  setTimeout(app.f7.hideIndicator, AUTO_HIDE_INDICATOR_TIME);
}

const FIRST_LIMIT = 80;

function arrayUnique(array) {
  var a = array.concat();
  for(var i = 0; i < a.length; ++i) {
    for(var j = i + 1; j< a.length; ++j) {
      if(a[i].id === a[j].id) {
        a.splice(j--, 1);
      }
    }
  }
  return a;
}

const getSkipIndex = (num, lim) => {
  return Math.floor(num/lim);
};

class FanArt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      skipIndex: 0,
      listPicsURL: [],
    };
    this.fetchFanArt = this.fetchFanArt.bind(this);
    this.setItemsLimited = this.setItemsLimited.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    Store.bind("fetchFanArt", this.fetchFanArt);
    var data = {picsURLList: []};
    Store.fanArtSetImages(data);
    $$('.infinite-scroll').on('infinite', this.fetchFanArt);
  }

  setItemsLimited(items) {
    var merged = arrayUnique(this.state.items.concat(items.slice(0, FIRST_LIMIT)));
    merged.sort((a, b) => {return (b.qtylikes != a.qtylikes) ? (b.qtylikes - a.qtylikes) : (b.createdAt.getTime() - a.createdAt.getTime())} );
    return this.setState({
      items: merged,
      skipIndex: getSkipIndex(merged.length, FIRST_LIMIT)
    });
  }

  fetchFanArt() {
    if(window.Parse) {
      var d = new Date();
      var likes = {};
      var time = (30 * 24 * 3600 * 1000);
      var DateX = new Date(d.getTime() - (time));
      app.f7.showIndicator();
      preventLongIndication();
      var FanArt = Parse.Object.extend("FanArt");
      var query = new Parse.Query(FanArt);
      var LikeFanArt = Parse.Object.extend("LikeFanArt");
      var LikeFanArtquery = new Parse.Query(LikeFanArt);
      query.greaterThanOrEqualTo("createdAt", DateX);
      query.limit(FIRST_LIMIT);
      query.descending("qtylikes");
      query.skip(this.state.skipIndex * FIRST_LIMIT);
      query.find({
        success: results => {
          app.f7.hideIndicator();
          app.f7.pullToRefreshDone();
          return results;
        },
        error: error => {
          app.f7.hideIndicator();
          app.f7.pullToRefreshDone();
          this.setItemsLimited([]);
          console.log("Error: " + error.code + " " + error.message);
        }
      })
      .then(results => {
        for (var i = results.length - 1; i >= 0; i--) {
          results[i].qtylikes = 0;
        }
        var promises = results.map(ph_res => {
          return new Promise((resolve, reject) => {
            LikeFanArtquery.equalTo("fanArtId", ph_res.toJSON().objectId);
            LikeFanArtquery.find({
              success: like_res => {
                var numberOfLikes = like_res.length;
                likes[ph_res.toJSON().objectId] = numberOfLikes;
                resolve();
              },
              error: error => {
                this.clearState();
                console.log("Error: " + error.code + " " + error.message);
                reject(error);
              }
            })
            .then(like_results => {
              for (var i = results.length - 1; i >= 0; i--) {
                if (results[i].id == ph_res.id) {
                  results[i].qtylikes = like_results.length
                }
              }
            }, () => console.log('Error 2, sort results'));
          });
        });
        Promise.all(promises)
          .then(() => {
            results.sort((a,b) => {return (b.qtylikes != a.qtylikes) ? (b.qtylikes - a.qtylikes) : (b.createdAt.getTime() - a.createdAt.getTime())} );
            this.setItemsLimited(results);
            let listPicsURL = [];
            this.state.items.forEach((item, i) => {
              listPicsURL.push(item.toJSON().photo.url)
            });
            var data = {picsURLList: listPicsURL};
            Store.fanArtBestSetImages(data);
          });
      }, () => console.log('Error likes fill') )
    }
  }

  renderItem (item) {
      let url;
      try {
        url = item.toJSON().photo.url;
      } catch(e) {
        try {
          url = item.photo.url;
        } catch(e) {
          console.log(e);
          url = "";
        }
      }
      let bg = {
            backgroundImage: 'url("'+url+'")'
      };
      return(
        <a className="fanArtList--elem" key={item.id} href={'#fan-art-details?id='+item.id+'&url='+url+'&tab=best'} >
          <div className="thumbnail" style={bg}></div>
        </a>
      );
  }


  render() {
    return (
        <div className="fanArtList">
          <VirtualList style={{width: "100%"}}
            items={this.state.items}
            renderItem={this.renderItem}
            itemHeight={1}
            className={"virtualList"}
            />
        </div>
    );
  }
}

module.exports = FanArt;
