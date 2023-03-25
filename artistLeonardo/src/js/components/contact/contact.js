/**
 * Created by developercomputer on 09.12.15.
 */
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

  send() {
    let { contName, contEmail, contSubj, contMessage } = this.refs;
    let data = {
      email: this.refs.email.value,
      name: this.refs.name.value,
      subject: this.refs.subject.value,
      message: this.refs.message.value
    };
    const animationTime = 900;
    let refs = {
      email: contEmail,
      name: contName,
      subject: contSubj,
      message: contMessage
    };
    let errorFlag = {
      email: false,
      name: false,
      subject: false,
      message: false
    };
    if(!validateEmail(data.email)) {
      errorFlag.email = true;
    }
    if(data.name === "") {
      errorFlag.name = true;
    }
    if(data.subject === "") {
      errorFlag.subject = true;
    }
    if(data.message === "") {
      errorFlag.message = true;
    }

    for(let key in errorFlag) {
      if(errorFlag.hasOwnProperty(key)) {
        if(errorFlag[key]) {
          refs[key].classList.add("error");
          setTimeout(() => {
            refs[key].classList.remove("error");
          }, animationTime);
        }
      }
    }
    for(let key in errorFlag) {
      if(errorFlag.hasOwnProperty(key)) {
        if(errorFlag[key]) {
          return false;
        }
      }
    }
    try {
      cordova.plugins.email.open({
        to:      words.contact_head_email[LN],
        cc:      data.email,
        subject: data.subject,
        body:    data.message
      }, () => {
        //let message = words.message_sent[LN],
        //    messageTitle = words.success[LN];
        //app.f7.alert(message, messageTitle);
      });
      let { name, email, subject, message } = this.refs;
      name.value = "";
      email.value = "";
      subject.value = "";
      message.value = "";
    } catch(e) {
      console.log(e);
      let message = words.errorOccurred[LN],
          messageTitle = words.warning[LN];
      app.f7.alert(message, messageTitle);
    }
  }

  render() {
    return (
        <div className="contact">
          <div className="contact-head">
            <span className="main">{words.contact_head[LN]}</span>
            <span className="mark">{words.contact_head_mark[LN]}</span>
            <div className="arrow"></div>
          </div>
          <div className="contact-form">
            <div className="to">{words.to[LN]}: <span className="email">{words.contact_head_email[LN]}</span></div>
            <div className="input" ref="contName">
              <input type="text" placeholder={words.contact_placeholder1[LN]} ref="name"/>
            </div>
            <div className="input" ref="contEmail">
              <input type="text" placeholder={words.contact_placeholder2[LN]} ref="email"/>
            </div>
            <div className="input" ref="contSubj">
              <input type="text" placeholder={words.contact_placeholder3[LN]} ref="subject"/>
            </div>
            <div className="text-area" ref="contMessage">
              <textarea placeholder={words.contact_placeholder4[LN]} ref="message"/>
            </div>
          </div>
          <div className="contact-submit">
            <div className="button" onClick={this.send.bind(this)}>{words.contact_submit[LN]}</div>
          </div>
        </div>
    );
  }
}

module.exports = SubscribeForm;
