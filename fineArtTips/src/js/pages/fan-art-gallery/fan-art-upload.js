/**
 * Created by developercomputer on 09.11.15.
 */
var React = require("react"),
    UploadForm = require("./../../components/fan-art/uploadForm");

class FanArtUploadPage extends React.Component {
  render() {
    return (
        <div className="page-content  page-content__fanArtGallery">
          <UploadForm/>
        </div>
    );
  }
}

module.exports = FanArtUploadPage;