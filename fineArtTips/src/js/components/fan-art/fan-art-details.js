/**
 * Created by developercomputer on 05.11.15.
 */
var React = require("react"),
    app = require("./../../f7init/f7init"),
    Store = require("./../../stores/store"),
    Authorizator = require("./authorizator"),
    CommentPoster = require("./commentPoster"),
    Liker = require("./like"),
    Sharer = require("./share"),
    Reporter = require("./report"),
    moment = require("moment"),
    back  = require("./../../router_back"),
    words = require("./../../words");

const AUTO_HIDE_INDICATOR_TIME = 5000; //ms

function preventLongIndication() {
  setTimeout(app.f7.hideIndicator, AUTO_HIDE_INDICATOR_TIME);
}

var NoComments = () => {
  return (
      <div className="noComment">{words.fanArt_noComments[LN]}</div>
  );
};

var Comment = props => {
  return (
      <div className="comment">
        <div className="comment--avatar" style={{backgroundImage: `url("${props.buddyIcon}")`}}/>
        <div className="comment--textField">
          <div className="author">{props.author}</div>
          <div className="content">{props.content}</div>
          <br/>
          <div className="posted">{props.date}</div>
        </div>
      </div>
  );
};

class ActionsPanel extends React.Component {
  render() {
    return (
        <div className="actionsPanel">
          <Liker/>
          <Sharer/>
          <Reporter/>
        </div>
    );
  }
}

function browsePhoto() {
  var picsListURL;
  switch (Store.currentFanArtTab) {
    case "all":
      picsListURL = Store.FanArtListURL;
      break;
    case "my":
      picsListURL = Store.FanArtMyListURL;
      break;
    case "best":
      picsListURL = Store.FanArtBestListURL;
      break;
    default:
      picsListURL = Store.FanArtListURL;
      break;
  }
  var browser = app.f7.photoBrowser({
    photos : picsListURL,
    initialSlide: picsListURL.indexOf(this.url),
    theme: 'dark',
    navbarTemplate: `
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="link close-popup photo-browser-close-link">
                        <span>${words.close[LN]}</span>
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
      };
      $$(document).off("backbutton", back);
      $$(document).on("backbutton", browser.close);
    },
    onClose: () => {
      $$(".statusbar-overlay").css({ background: "#f7f7f8" });
      try {
        AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
      } catch(e) {
        console.log(e);
      };
      $$(document).off("backbutton", browser.close);
      $$(document).on("backbutton", back);
    }
  });
  browser.open();
}

var ArtCard = props => {
  return (
      <div className="fanArt--card">
        <div className="author">
          <div className="author--avatar" style={{backgroundImage: `url("${props.buddyIcon}")`}}/>
          <div className="author--names">
            <div className="author--names--nick">{props.username}</div>
            <div className="author--names--real">{props.realname}</div>
          </div>
          <div className="author--date">{props.date}</div>
        </div>
        <div className="fanArt--card--image"
             style={{backgroundImage: `url("${props.imgUrl}")`}}
             onClick={browsePhoto.bind({listOfPics: props.listOfPics, url: props.imgUrl})}
            />
        <div className="fanArt--card--title">{props.title}</div>
        <div className="fanArt--card--desc">{props.desc}</div>
        <ActionsPanel/>
      </div>
  );
};

class CommentBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: []
    };
    this.fetchComments = this.fetchComments.bind(this);
    this._renderComments = this._renderComments.bind(this);
  }

  componentDidMount() {
    Store.bind("fetchFanArtDetails", this.fetchComments);
    Store.bind("commentPosted", this.fetchComments);
  }

  fetchComments() {
    this.setState({ comments: [] });
    if(window.Parse) {
      var CommentFanArt = Parse.Object.extend("CommentFanArt");
      var query = new Parse.Query(CommentFanArt);
      query.equalTo("fanArtId", Store.currentFanArtId);
      query.find({
        success: results => {
          this.setState({ comments: results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) });
        },
        error: error => {
          this.setState({ comments: [] });
          console.log("Error: " + error.code + " " + error.message);
        }
      });
    }
  }

  _renderComments() {
    if(this.state.comments.length === 0) {
      return <NoComments/>;
    }
    return this.state.comments.map((comment, i) => {
      return (
          <Comment
              key={i}
              author={comment.toJSON().username}
              content={comment.toJSON().content}
              buddyIcon={comment.toJSON().avatar}
              date={moment(comment.createdAt).format("LL")}
              />
      );
    });
  }

  render() {
    return (
        <div className="commentBlock">
          <div className="commentBlock--arrow"/>
          <CommentPoster />
          {this._renderComments()}
        </div>
    );
  }
}


class FanArtDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null
    };
    this.fetchFanArtDetails = this.fetchFanArtDetails.bind(this);
    this._renderCard = this._renderCard.bind(this);
  }

  componentDidMount() {
    Store.bind("fetchFanArtDetails", this.fetchFanArtDetails);
  }

  componentDidUpdate() {
    $$(`[data-page="fan-art-details"]>.page-content`).scrollTo(0, 0, 300);
  }

  fetchFanArtDetails() {
    if(window.Parse) {
      app.f7.showIndicator();
      preventLongIndication();
      $$('.fanArt--card, .commentBlock').css('visibility', 'hidden');
      var FanArt = Parse.Object.extend("FanArt");
      var query = new Parse.Query(FanArt);
      query.equalTo("objectId", Store.currentFanArtId);
      query.find({
        success: results => {
          $$('.fanArt--card, .commentBlock').css('visibility', 'visible');
          app.f7.hideIndicator();
          app.f7.pullToRefreshDone();
          this.setState({ info: results[0] });
        },
        error: error => {
          app.f7.hideIndicator();
          app.f7.pullToRefreshDone();
          this.setState({ info: null });
          console.log("Error: " + error.code + " " + error.message);
        }
      });
    }
  }

  _renderCard() {
    if(this.state.info == null) {
      return null;
    }
    var info = this.state.info.toJSON();
    return (
        <ArtCard
            buddyIcon={info.avatar}
            username={info.username}
            realname={info.realname}
            imgUrl={Store.currentFanArtURL}
            title={info.title}
            desc={info.description}
            date={moment(info.createdAt).format("LL")}
            listOfPics={Store.FanArtListURL}
            />
    );
  }

  showMyUploads(){}  //this needed as props...

  render() {
    return (
        <div className="fanArt">
          <Authorizator
            showMyUploads={this.showMyUploads}/>
          {this._renderCard()}
          <CommentBlock/>
        </div>
    );
  }
}

module.exports = FanArtDetails;
