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
    let win = (res) => { console.log(res); app.f7.alert(successMessage, successTitle) };
    let errorMessage = words.errorOccurred[LN];
    let errorTitle = words.warning[LN];
    let fail = () => app.f7.alert(errorMessage, errorTitle);
    let choice = [LN];
    iContact.subscribe(data.email, data.firstName, win, fail, choice);
  }

  render() {
    return (
        <div className="sub2">
          <div className="sub2-head">{words.subscribe_head_text[LN]}</div>
          <div className="sub2-form">
            <div className="input" ref="lightErrorEmail">
              <input ref="email" placeholder={words.sub_email_placeholder[LN]} type="email"/>
            </div>
            <div className="input" ref="lightErrorName">
              <input ref="firstName" placeholder={words.sub_name_placeholder[LN]} type="text"/>
            </div>
          </div>
          <div className="sub2-submit">
            <div className="button" onClick={this.subscribe.bind(this)}>{words.contact_submit[LN]}</div>
          </div>
        </div>
    );
  }
}

module.exports = SubscribeForm;
