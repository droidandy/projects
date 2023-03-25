/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    ContactForm = require("./../../components/contact/contact");

class ContactPage extends React.Component {
  render() {
    return (
        <div className="page-content white">
          <ContactForm/>
        </div>
    );
  }
}

module.exports = ContactPage;
