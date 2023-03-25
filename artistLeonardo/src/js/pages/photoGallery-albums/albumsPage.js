/**
 * Created by developercomputer on 28.10.15.
 */
var React = require("react"),
    AlbumsList = require("./../../components/photoGallery/albums/albums");

class AlbumsPage extends React.Component {
  render() {
    return (
        <div className="page-content white">
          <AlbumsList/>
        </div>
    );
  }
}

module.exports = AlbumsPage;