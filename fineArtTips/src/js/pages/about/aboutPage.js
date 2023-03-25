/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    About = require("./../../components/about/leonardo");

class AboutPage extends React.Component {
  render() {
    return (
        <div className="page-content white">
          <About/>
        </div>
    );
  }
}

module.exports = AboutPage;