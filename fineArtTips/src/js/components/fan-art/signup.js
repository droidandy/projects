/**
 * Created by developercomputer on 22.11.15.
 */
var React = require("react"),
    Store = require("./../../stores/store"),
    app = require("./../../f7init/f7init"),
    words = require("./../../words");

function validateEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

class SignUpForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userAvatar: require("./defaultAvatar")
    };
    this.signUpUser = this.signUpUser.bind(this);
    this.choosePhoto = this.choosePhoto.bind(this);
  }

  signUpUser() {
    var usernameRef = this.refs.username,
        emailRef = this.refs.email,
        passwordRef = this.refs.password,
        secondPasswordRef = this.refs.passwordAgain,
        firstRef = this.refs.first,
        secondRef = this.refs.second;
    var data = {
          username: usernameRef.value,
          email: emailRef.value,
          password: passwordRef.value,
          passwordAgain: secondPasswordRef.value,
          first: firstRef.value,
          second: secondRef.value
        },
        button = this.refs.button;

    if(data.username === "" || data.password === "" || data.first === "" || data.second === "" || data.passwordAgain === "") {
      let message = words.emptyFieldsErr[LN],
          messageTitle = words.warning[LN];
      return app.f7.alert(message, messageTitle);
    }

    if(data.password.length <= 6) {
      let message = words.more6msg[LN],
          messageTitle = words.weakPassErr[LN];
      return app.f7.alert(message, messageTitle);
    }

    if(data.password !== data.passwordAgain) {
      let message = words.passwordsDismatch[LN],
          messageTitle = words.passwordsDismatch[LN];
      return app.f7.alert(message, messageTitle);
    }

    if(!validateEmail(data.email)) {
      let message = words.wrongEmailMsg[LN],
          messageTitle = words.warning[LN];
      return app.f7.alert(message, messageTitle);
    }


    button.classList.add("disabled");
    app.f7.showIndicator();
    var file = new Parse.File("avatar", { base64: this.state.userAvatar });
    var user = new Parse.User();
    user.set("username", data.username);
    user.set("email", data.email);
    user.set("password", data.password);
    user.set("first_name", data.first);
    user.set("second_name", data.second);
    user.set("avatar", file);
    user.signUp(null, {
      success(user) {
        usernameRef.value = "";
        emailRef.value = "";
        passwordRef.value = "";
        secondPasswordRef.value = "";
        firstRef.value = "";
        secondRef.value = "";
        button.classList.remove("disabled");
        app.f7.hideIndicator();
        Store.autorization(user);
        let message = words.successLoginMsg[LN],
            messageTitle = `${words.welcome[LN]} ${data.username}!`;
        app.f7.alert(message, messageTitle, () => app.mainView.router.back());
      },
      error(user, error) {
        // Show the error message somewhere and let the user try again.
        button.classList.remove("disabled");
        app.f7.hideIndicator();
        if(error.code === 202) {
          let message = words.nameTakenMsg[LN](data.username),
              messageTitle = words.someGoesWrong[LN];
          app.f7.alert(message, messageTitle);
        } else {
          let message = words.errorOccurred[LN],
              messageTitle = words.someGoesWrong[LN];
          console.log(error);
          app.f7.alert(message, messageTitle);
        }
      }
    });
  }

  choosePhoto() {
    app.f7.showIndicator();
    navigator.camera.getPicture(b64 => {
      app.f7.hideIndicator();
      var res = `data:image/jpeg;base64,${b64}`;
      this.setState({ userAvatar: `${res}` });
    }, err => app.f7.hideIndicator(), {
      quality: 60,
      targetWidth: 256,
      targetHeight: 256,
      destinationType: navigator.camera.DestinationType.DATA_URL,
      sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    });

  }

  render() {
    return (
        <div className="signup-form">
          <div className="content-block-title">{words.fanArt_signUp[LN]}</div>
          <div className="list-block">
            <ul>
              <li>
                <div className="item-content">
                  <div className="item-inner">
                    <div className="item-title label">{words.fanArt_username[LN]}</div>
                    <div className="item-input">
                      <input type="text" placeholder={words.fanArt_username[LN]} ref="username"/>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="item-content">
                  <div className="item-inner">
                    <div className="item-title label">{words.email[LN]}</div>
                    <div className="item-input">
                      <input type="email" placeholder={words.email[LN]} ref="email"/>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="item-content">
                  <div className="item-inner">
                    <div className="item-title label">{words.fanArt_password[LN]}</div>
                    <div className="item-input">
                      <input type="password" placeholder={words.fanArt_password[LN]} ref="password"/>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="item-content">
                  <div className="item-inner">
                    <div className="item-title label">{words.repeatPass[LN]}</div>
                    <div className="item-input">
                      <input type="password" placeholder={words.repeatPass[LN]} ref="passwordAgain"/>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="item-content">
                  <div className="item-inner">
                    <div className="item-title label">{words.fanArt_firstName[LN]}</div>
                    <div className="item-input">
                      <input type="text" placeholder={words.fanArt_firstName[LN]} ref="first"/>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="item-content">
                  <div className="item-inner">
                    <div className="item-title label">{words.fanArt_lastName[LN]}</div>
                    <div className="item-input">
                      <input type="text" placeholder={words.fanArt_lastName[LN]} ref="second"/>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="item-content" style={{height: "80px"}}>
                  <div className="item-inner">
                    <div className="item-title label">
                      <div className="default-user-avatar"
                           style={{backgroundImage: `url("${this.state.userAvatar}")`}}
                          />
                    </div>
                    <div className="item-input">
                      <p>
                        <a href="#"
                           className="button color-red"
                           onClick={this.choosePhoto}
                            >
                          {words.fanArt_choosePhoto[LN]}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <p>
            <a href="#"
               className="button color-red"
               onClick={this.signUpUser}
               style={{width: "80%", margin: "20px auto"}}
               ref="button"
                >
              {words.fanArt_signUp[LN]}
            </a>
          </p>
        </div>
    );
  }
}

module.exports = SignUpForm;
