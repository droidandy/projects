/**
 * Created by developercomputer on 05.11.15.
 */
var React = require("react"),
    Store = require("./../../stores/store"),
    Uploader = require("./uploader"),
    app = require("./../../f7init/f7init"),
    words = require("./../../words");

function checkAuthorizationStatus() {
  var isAuthorized = window.Parse ? Parse.User.current() : null;
  if(isAuthorized == null) {
    return false;
  }
  return true;
}

class Profile extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Store.bind("fetchAvatar", this.fetchAvatar);
  }

  fetchAvatar() {
    $$('.info--avatar').css('background-image', 'url(' + Store.user.toJSON().avatar.url + ')');
    $$('.avatar').css('background-image', 'url(' + Store.user.toJSON().avatar.url + ')');
  }

  unAuthorize() {
    let message = words.fanArt_sure[LN],
        messageTitle = words.fanArt_signOut[LN];
    var changeAvatar = [
      {
        text: words.fanArt_from_gallery[LN],  //'From gallery',
        onClick: function () {
          app.f7.showIndicator();
          navigator.camera.getPicture(b64 => {
            app.f7.hideIndicator();
            var res = `data:image/jpeg;base64,${b64}`;
            var file = new Parse.File("avatar", { base64: res });
            var user = Parse.User.current();
            if (user) {
              user.set("avatar", file);
              user.save(null, {
                success(user) {
                  Store.fetchAvatar(user);
                    var currentUserLocal = {},currentUserLocalKey='';
                    for ( var i = 0; i < localStorage.length; i++ ) {
                      if ( localStorage.key( i ).indexOf('/currentUser') != -1){
                        currentUserLocalKey = localStorage.key(i);
                        currentUserLocal = JSON.parse(localStorage.getItem(localStorage.key(i)));
                      }
                    }
                    if (currentUserLocal.hasOwnProperty('avatar')){
                     if (currentUserLocal.avatar.hasOwnProperty('url')){
                       currentUserLocal.avatar =  Parse.User.current().toJSON().avatar;
                     }
                     }
                    localStorage.setItem(currentUserLocalKey,JSON.stringify(currentUserLocal));
                },
                error(user, error) {
                  app.f7.alert('oooops', 'error');
                }
              });
            }
          }, err => app.f7.hideIndicator(), {
            quality: 60,
            targetWidth: 256,
            targetHeight: 256,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
          });
        }
      },
      {
        text:  words.fanArt_from_camera[LN], //'From camera',
        onClick: function () {
          app.f7.showIndicator();
          navigator.camera.getPicture(b64 => {
            app.f7.hideIndicator();
            var res = `data:image/jpeg;base64,${b64}`;
            var file = new Parse.File("avatar", { base64: res });
            var user = Parse.User.current();
            if (user) {
              user.set("avatar", file);
              user.save(null, {
                success(user) {
                  Store.fetchAvatar(user);
                    var currentUserLocal = {},currentUserLocalKey='';
                    for ( var i = 0; i < localStorage.length; i++ ) {
                      if ( localStorage.key( i ).indexOf('/currentUser') != -1){
                        currentUserLocalKey = localStorage.key(i);
                        currentUserLocal = JSON.parse(localStorage.getItem(localStorage.key(i)));
                      }
                    }
                    if (currentUserLocal.hasOwnProperty('avatar')){
                     if (currentUserLocal.avatar.hasOwnProperty('url')){
                       currentUserLocal.avatar =  Parse.User.current().toJSON().avatar;
                     }
                     }
                    localStorage.setItem(currentUserLocalKey,JSON.stringify(currentUserLocal));
                },
                error(user, error) {
                  app.f7.alert('oooops', 'error');
                }
              });
            }
          }, err => app.f7.hideIndicator(), {
            quality: 60,
            targetWidth: 256,
            targetHeight: 256,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: navigator.camera.PictureSourceType.CAMERA
          });
        }
      }
    ];
    var tapProfile = [
      {
        text: words.fanArt_change_userpic[LN],
        bold: true,
        onClick: function () {
          app.f7.actions(changeAvatar);
        }
      },
      {
        text: messageTitle,
        onClick: function () {
        app.f7.confirm(message, messageTitle, () => Store.unauthorize());
        }
      },
      {
        text: words.cancel[LN],
        color: 'red',
        onClick: function () {
        }
      }
    ];
    app.f7.actions(tapProfile);
  }

  render() {
    var props = this.props;
    return (
        <div className="authorizator authorizator__in">
          <div className="info" onClick={this.unAuthorize}>
            <div className="info--avatar" style={{backgroundImage: `url("${props.buddyIcon}")`}}/>
            <div className="info--names">
              <div className="username">{props.username}</div>
              <div className="realname">{props.realname}</div>
            </div>
          </div>
          <Uploader/>

        </div>
    );
  }
}

class Authorizator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: checkAuthorizationStatus()
    };
    this._renderDependOn = this._renderDependOn.bind(this);
    this.setAuthorized = this.setAuthorized.bind(this);
    this.setUnauthorized = this.setUnauthorized.bind(this);
  }

  componentDidMount() {
    Store.bind("authorization", this.setAuthorized);
    Store.bind("unauthorize", this.setUnauthorized);
  }

  setAuthorized() {
    this.setState({ isAuthorized: true });
    this.props.showMyUploads(true);
  }

  setUnauthorized() {
    this.setState({ isAuthorized: false });
    this.props.showMyUploads(false);
  }

  signUp() {
    app.mainView.router.loadPage("#fan-art-signup");
  }

  signIn() {
    app.mainView.router.loadPage("#fan-art-signin");
  }

  _renderUnauthorizatedState() {
    return (
        <div
            className="authorizator authorizator__un"
            >
          <div
              className="sign"
              onClick={this.signUp}
              >
            <span className="flickr">{words.fanArt_signUp[LN]}</span>
          </div>
          <div
              className="sign"
              onClick={this.signIn}
              >
            <span className="flickr">{words.fanArt_signIn[LN]}</span>
            <img src="img/flickr-invitation.png" alt="" width="40" style={{paddingLeft: 10}}/>
          </div>
        </div>
    );
  }

  _renderAuthorizatedState() {
    let data = Store.user.toJSON();
    return (
          <Profile
              username={data.username}
              realname={`${data.first_name} ${data.second_name}`}
              buddyIcon={data.avatar.url}
              />
    );
  }

  _renderDependOn() {
    if(this.state.isAuthorized) {
      return this._renderAuthorizatedState();
    }
    return this._renderUnauthorizatedState();
  }

  render() {
    return this._renderDependOn();
  }
}

module.exports = Authorizator;
