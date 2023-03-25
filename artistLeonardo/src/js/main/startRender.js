var ReactDOM = require("react-dom"),
    React = require("react"),
    MainPage = require("./../pages/main/main"),
    AlbumsPage = require("./../pages/photoGallery-albums/albumsPage"),
    PhotosPage = require("./../pages/photoGallery-photos/photosPage"),
    PhotoTitle = require("./../components/photoGallery/photos/photo-title"),
    BlogsPage = require("./../pages/blog/blog"),
    MaterialsPage = require("./../pages/materials/materials"),
    BooksPage = require("./../pages/books/books"),
    AboutPage = require("./../pages/about/aboutPage"),
    SideMenu = require("./../components/menu/side-menu"),
    SubscribeForm = require("./../pages/subscribe/subscribe"),
    OtherPage = require("./../pages/other/otherPage"),
    MediaPage = require("./../pages/mediaPage/photosPage"),
    ContactPage = require("./../pages/contact/contact-page"),
    media_album_id = require("./../api/flickr").media_album_id;

module.exports = () => {
  ReactDOM.render(<MainPage/>, document.getElementById("index-page"));
  ReactDOM.render(<AlbumsPage/>, document.getElementById("photoGallery-albums"));
  ReactDOM.render(<PhotosPage/>, document.getElementById("photoGallery-photos"));
  ReactDOM.render(<PhotoTitle/>, document.getElementById("photoGallery-photos-title"));
  ReactDOM.render(<BlogsPage/>, document.getElementById("blog"));
  ReactDOM.render(<MaterialsPage/>, document.getElementById("materials"));
  ReactDOM.render(<BooksPage/>, document.getElementById("books"));
  ReactDOM.render(<AboutPage/>, document.getElementById("about"));
  ReactDOM.render(<SideMenu/>, document.getElementById("side-menu"));
  ReactDOM.render(<SubscribeForm/>, document.getElementById("subscribe"));
  ReactDOM.render(<OtherPage/>, document.getElementById("other"));
  ReactDOM.render(<ContactPage/>, document.getElementById("contact"));
  ReactDOM.render(<MediaPage id={media_album_id}/>, document.getElementById("media"));
};
