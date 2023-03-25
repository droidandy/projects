/**
 * Created by developercomputer on 28.10.15.
 */
var React = require("react"),
    PhotosList = require("./../../components/photoGallery/photos/photos");

class PhotosPage extends React.Component {
  render() {
    return (
        <div className="page-content white">
          <PhotosList id={this.props.id}/>
        </div>
    );
  }
}

module.exports = PhotosPage;
