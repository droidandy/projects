/**
 * Created by developercomputer on 26.11.15.
 */
var React = require("react"),
    iContact = require("./../../api/iContact"),
    app = require("./../../f7init/f7init"),
    words = require("./../../words");

function validateEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

class SubscribeForm extends React.Component {

  subscribe() {
    var data = {
      email: this.refs.email.value,
      firstName: this.refs.firstName.value
    };
    var errorFlag = {
      email: false,
      firstName: false
    };
    if(!validateEmail(data.email)) {
      errorFlag.email = true;
    }
    if(data.firstName === "") {
      errorFlag.firstName = true;
    }
    var animationTime = 900;
    if(errorFlag.email && errorFlag.firstName) {
      this.refs.lightErrorEmail.classList.add("error");
      this.refs.lightErrorName.classList.add("error");
      return setTimeout(() => {
        this.refs.lightErrorEmail.classList.remove("error");
        this.refs.lightErrorName.classList.remove("error");
      }, animationTime);
    }
    if(errorFlag.email && !errorFlag.firstName) {
      this.refs.lightErrorEmail.classList.add("error");
      return setTimeout(() => {
        this.refs.lightErrorEmail.classList.remove("error");
      }, animationTime);
    }
    if(!errorFlag.email && errorFlag.firstName) {
      this.refs.lightErrorName.classList.add("error");
      return setTimeout(() => {
        this.refs.lightErrorName.classList.remove("error");
      }, animationTime);
    }
    let successMessage = words.success_sub_msg[LN];
    let successTitle = words.success[LN];
    var win = () => app.f7.alert(successMessage, successTitle);
    let errorMessage = words.errorOccurred[LN];
    let errorTitle = words.warning[LN];
    var fail = () => app.f7.alert(errorMessage, errorTitle);
    iContact.subscribe(data.email, data.firstName, win, fail);
  }

  render() {
    return (
        <div className="sub">
          <div className="sub--head"><div className="sub--head--arrow"/></div>
          <div className="sub--join">{words.joinMyEmail[LN]}</div>
          <div className="sub--text">{words.subscribeText[LN]}</div>
          <div className="sub--form">
            <div className="sub--form--input" ref="lightErrorEmail">
              <input type="email" placeholder={words.sub_email_placeholder[LN]} ref="email"/>
            </div>
            <div className="sub--form--input" ref="lightErrorName">
              <input type="text" placeholder={words.sub_name_placeholder[LN]} ref="firstName"/>
            </div>
          </div>
          <div className="sub--accept" onClick={this.subscribe.bind(this)}>{words.subscribe[LN]}</div>
        </div>
    );
  }
}

module.exports = SubscribeForm;
