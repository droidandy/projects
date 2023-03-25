/**
 * Created by developercomputer on 24.11.15.
 */
var React = require("react"),
    app = require("./../../f7init/f7init"),
    Store = require("./../../stores/store");

function checkAuthorizationStatus() {
  var isAuthorized = window.Parse ? Parse.User.current() : null;
  if(isAuthorized == null) {
    return false;
  }
  return true;
}

class Liker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      didUserLike: false,
      numberOfLikes: 0,
      isAuthorized: checkAuthorizationStatus()
    };
    this.sendLike = this.sendLike.bind(this);
    this.sendDisLike = this.sendDisLike.bind(this);
    this.fetchLikes = this.fetchLikes.bind(this);
    this.clearState = this.clearState.bind(this);
    this.setAuthorized = this.setAuthorized.bind(this);
    this.setUnauthorized = this.setUnauthorized.bind(this);
    this.initialFetch = this.initialFetch.bind(this);
  }

  componentDidMount() {
    this.fetchLikes();
    Store.bind("authorization", this.setAuthorized);
    Store.bind("unauthorize", this.setUnauthorized);
    Store.bind("fetchFanArtDetails", this.initialFetch);
  }

  initialFetch() {
    this.clearState();
    this.fetchLikes();
  }

  setAuthorized() {
    this.setState({
      isAuthorized: true
    });
    this.fetchLikes();
  }

  setUnauthorized() {
    this.setState({
      isAuthorized: false
    });
  }


  clearState() {
    this.setState({
      didUserLike: false,
      numberOfLikes: 0,
      canPost: false
    });
  }

  fetchLikes() {
    if(window.Parse) {
      var LikeFanArt = Parse.Object.extend("LikeFanArt");
      var query = new Parse.Query(LikeFanArt);
      query.equalTo("fanArtId", Store.currentFanArtId);
      query.find({
        success: results => {
          var usersLike = [];
          if(this.state.isAuthorized) {
            usersLike = results.filter(item => item.toJSON().owner_username.objectId === Store.user.toJSON().objectId);
          }
          var didUserLike = usersLike.length !== 0;
          var numberOfLikes = results.length;
          this.setState({
            numberOfLikes,
            didUserLike
          });
        },
        error: error => {
          this.clearState();
          console.log("Error: " + error.code + " " + error.message);
        }
      });
    }
  }

  sendLike() {
    this.setState({ didUserLike: true });
    var LikeFanArt = Parse.Object.extend("LikeFanArt");
    var likeFanArt = new LikeFanArt();
    likeFanArt.set("fanArtId", Store.currentFanArtId);
    likeFanArt.set("owner_username", Parse.User.current());
    likeFanArt.save(null, {
      success: like => {
        // Execute any logic that should take place after the object is saved.
        console.log('New object created with objectId: ' + like.id);
        this.fetchLikes();
      },
      error(like, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        console.log(error);
        console.log('Failed to create new object, with error code: ' + error.message);
      }
    });
  }

  sendDisLike() {
    if(window.Parse) {
      var LikeFanArt = Parse.Object.extend("LikeFanArt");
      var query = new Parse.Query(LikeFanArt);
      query.equalTo("fanArtId", Store.currentFanArtId);
      query.equalTo("owner_username", Parse.User.current());
      this.setState({ didUserLike: false });
      query.find({
        success: results => {
          var usersLike = results[0];
          usersLike.destroy({
            success: like => {
              console.log("Dislike was sent: ", like);
              this.fetchLikes();
            },
            error: (like, error) => {
              console.log("Could not send dislike: ", error);
            }
          });
        },
        error: error => {
          this.clearState();
          console.log("Error: " + error.code + " " + error.message);
        }
      });
    }
  }

  _renderUnAuthorized() {
    return (
        <div className="actionsPanel--button like disabled"
            style={{backgroundImage: `url(img/icon-like-on.svg)`}}
            >
          <div className="numberOfLikes">{this.state.numberOfLikes}</div>
        </div>
    );
  }

  _renderAuthorized() {
    var tapHandler = this.state.didUserLike ? this.sendDisLike :this.sendLike;
    var bgi = this.state.didUserLike ? "img/icon-like-on.svg" : "img/icon-like-off.svg";
    return (
        <div className="actionsPanel--button like"
             onClick={tapHandler}
             style={{backgroundImage: `url(${bgi})`}}
            >
          <div className="numberOfLikes">{this.state.numberOfLikes}</div>
        </div>
    );
  }

  render() {
    return this.state.isAuthorized ? this._renderAuthorized() : this._renderUnAuthorized();
  }
}

module.exports = Liker;
