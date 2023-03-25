/**
 * Created by developercomputer on 12.11.15.
 */
var React = require("react"),
    Store = require("./../../stores/store"),
    words = require("./../../words");

function checkAuthorizationStatus() {
  var isAuthorized = window.Parse ? Parse.User.current() : null;
  if(isAuthorized == null) {
    return false;
  }
  return true;
}

class CommentPoster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: checkAuthorizationStatus(),
      buddyIcon: Store.user == null ? "" : Store.user.toJSON().avatar.url
    };
    this.setAuthorized = this.setAuthorized.bind(this);
    this._renderAuthorizedState = this._renderAuthorizedState.bind(this);
    this.postComment = this.postComment.bind(this);
    this.setUnauthorized = this.setUnauthorized.bind(this);
  }

  componentDidMount() {
    Store.bind("authorization", this.setAuthorized);
    Store.bind("unauthorize", this.setUnauthorized);
  }

  setAuthorized() {
    this.setState({ isAuthorized: true });
    this.setState({ buddyIcon: Store.user.toJSON().avatar.url });
  }


  setUnauthorized() {
    this.setState({ isAuthorized: false });
  }

  postComment() {
    var textRef = this.refs.text,
        content = textRef.value;
    if(content === "") {
      return false;
    }
    var userInfo = Store.user.toJSON();
    var CommentFanArt = Parse.Object.extend("CommentFanArt");
    var commentFanArt = new CommentFanArt();
    commentFanArt.set("fanArtId", Store.currentFanArtId);
    commentFanArt.set("content", content);
    commentFanArt.set("username", userInfo.username);
    commentFanArt.set("realname", `${userInfo.first_name} ${userInfo.second_name}`);
    commentFanArt.set("avatar", userInfo.avatar.url);
    commentFanArt.set("createdBy", Parse.User.current());
    commentFanArt.save(null, {
      success(comment) {
        // Execute any logic that should take place after the object is saved.
        console.log('New object created with objectId: ' + comment.id);
        textRef.value = "";
        Store.commentPosted();
      },
      error(comment, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        console.log(error);
        console.log('Failed to create new object, with error code: ' + error.message);
      }
    });
  }


  _renderUnauthorizedState() {
    return (
        <div className="postComment postComment__un">
          {words.fanArt_canPostMsg[LN]}
        </div>
    );
  }


  _renderAuthorizedState() {
    //TODO: translate
    return (
        <div className="postComment postComment__in">
          <div className="avatar" style={{backgroundImage: `url("${this.state.buddyIcon}")`}}/>
          <div className="input">
            <textarea placeholder={words.fanArt_placeholder[LN]} ref="text"/>
            <div className="submit" onClick={this.postComment}>{words.fanArt_post[LN]}</div>
          </div>
        </div>
    );
  }

  render() {
    return this.state.isAuthorized ? this._renderAuthorizedState() : this._renderUnauthorizedState();
  }
}

module.exports = CommentPoster;