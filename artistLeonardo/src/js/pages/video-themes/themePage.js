/**
 * Created by developercomputer on 27.10.15.
 */
var React = require("react"),
    Themes = require("./../../components/video/themes/themes");

class ThemesPage extends React.Component {
  render() {
    return (
        <div className="page-content white">
          <Themes/>
        </div>
    );
  }
}

module.exports = ThemesPage;