/**
 * Created by developercomputer on 23.11.15.
 */
var React = require("react"),
    Store = require("./../../stores/store"),
    app = require("./../../f7init/f7init"),
    words = require("./../../words");

class SignInForm extends React.Component {

  constructor(props) {
    super(props);
    this.signInUser = this.signInUser.bind(this);
  }

  recoveryPassword() {
    app.f7.prompt(words.email[LN], words.recoveryPassword[LN], email => {
      console.log(email);
      try {
        Parse.User.requestPasswordReset(email.toLowerCase(), {
          success: function() {
            // Password reset request was sent successfully
            app.f7.alert(words.checkYourEmail[LN], words.success[LN]);
          },
          error: function(error) {
            // Show the error message somewhere
            app.f7.alert(words.someGoesWrong[LN], words.warning[LN]);
          }
        });
      } catch(e) {
        app.f7.alert(words.someGoesWrong[LN], words.warning[LN]);
      }
    });
  }

  signInUser() {
    var usernameRef = this.refs.username,
        passwordRef = this.refs.password;
    var data = {
          username: usernameRef.value,
          password: passwordRef.value
        },
        button = this.refs.button;
    if(data.username === "" || data.password === "") {
      let message = words.emptyFieldsErr[LN],
          messageTitle = words.warning[LN];
      return app.f7.alert(message, messageTitle);
    }
    button.classList.add("disabled");
    Parse.User.logIn(data.username, data.password, {
      success(user) {
        // Do stuff after successful login.
        Store.autorization(user);
        usernameRef.value = "";
        passwordRef.value = "";
        button.classList.remove("disabled");
        app.mainView.router.back();
      },
      error(user, error) {
        // The login failed. Check error to see why.
        passwordRef.value = "";
        button.classList.remove("disabled");
        console.log(error);
        let message = words.passwordLoginErr[LN],
            messageTitle = words.warning[LN];
        app.f7.alert(message, messageTitle);
      }
    });
  }

  render() {
    return (
        <div className="signup-form">
          <div className="content-block-title">{words.fanArt_signIn[LN]}</div>
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
                    <div className="item-title label">{words.fanArt_password[LN]}</div>
                    <div className="item-input">
                      <input type="password" placeholder={words.fanArt_password[LN]} ref="password"/>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <p>
            <a href="#"
               className="button color-red"
               onClick={this.signInUser}
               style={{width: "80%", margin: "20px auto"}}
               ref="button">
              {words.fanArt_signIn[LN]}
            </a>
          </p>
          <div className="content-block-title">{words.forgotPassword[LN]}</div>
          <div className="content-block">
            <a href="#" ref="recovery" onClick={this.recoveryPassword}>{words.youCanRecover[LN]}</a>
          </div>
        </div>
    );
  }
}

module.exports = SignInForm;
