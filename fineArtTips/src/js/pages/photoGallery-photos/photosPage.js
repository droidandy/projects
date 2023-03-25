/**
 * Created by developercomputer on 28.10.15.
 */
var React = require("react"),
    PhotosList = require("./../../components/photoGallery/photos/photos");

class PhotosPage extends React.Component {
  render() {
    return (
        <div className="page-content white">
          <form
              className="searchbar searchbar-init"
              data-search-list=".photo-search"
              data-search-in=".title"
              data-found=".photo-search"
              data-not-found=".searchbar-not-found"
              >
            <div className="searchbar-input">
              <input type="search" placeholder="Search"/>
              <a href="#" className="searchbar-clear"></a>
            </div>
            <a href="#" className="searchbar-cancel">Cancel</a>
          </form>

          <div className="searchbar-overlay"></div>
          <PhotosList/>
        </div>
    );
  }
}

module.exports = PhotosPage;
