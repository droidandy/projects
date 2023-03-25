/**
 * Created by developercomputer on 23.11.15.
 */
var React = require("react"),
    SignInForm = require("./../../components/fan-art/signin");

class SignInPage extends React.Component {
  render() {
    return (
        <div className="page-content  page-content__fanArtGallery">
          <SignInForm/>
        </div>
    );
  }
}

module.exports = SignInPage;
