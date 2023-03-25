/**
 * Created by developercomputer on 22.11.15.
 */
var React = require("react"),
    SignUpForm = require("./../../components/fan-art/signup");

class SignUpPage extends React.Component {
  render() {
    return (
        <div className="page-content  page-content__fanArtGallery">
          <SignUpForm/>
        </div>
    );
  }
}

module.exports = SignUpPage;
