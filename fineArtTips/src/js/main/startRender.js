var ReactDOM = require("react-dom"),
    React = require("react"),
    MainPage = require("./../pages/main/main"),
    ThemePage = require("./../pages/video-themes/themePage"),
    TutorialTitle = require("./../components/video/tutorials/tutorial-title"),
    TutorialsPage = require("./../pages/video-tutorials/tutorialsPage"),
    AlbumsPage = require("./../pages/photoGallery-albums/albumsPage"),
    PhotosPage = require("./../pages/photoGallery-photos/photosPage"),
    PhotoTitle = require("./../components/photoGallery/photos/photo-title"),
    MaterialsPage = require("./../pages/materials/materials"),
    BlogsPage = require("./../pages/blog/blog"),
    BooksPage = require("./../pages/books/books"),
    CoursesPage = require("./../pages/courses/courses"),
    AboutPage = require("./../pages/about/aboutPage"),
    FanArtPage = require("./../pages/fan-art-gallery/fan-art-gallery"),
    FanArtDetailsPage = require("./../pages/fan-art-gallery/fan-art-details"),
    FanArtUploadPage = require("./../pages/fan-art-gallery/fan-art-upload"),
    SideMenu = require("./../components/menu/side-menu"),
    SignUp = require("./../pages/fan-art-gallery/fan-art-signup"),
    SignIn = require("./../pages/fan-art-gallery/fan-art-signin"),
    SubscribeForm = require("./../pages/subscribe/subscribe"),
    OtherPage = require("./../pages/other/otherPage"),
    VipZonePage = require("./../pages/vip/vip"),
    VipListPage = require("./../pages/vip/vip-list");

module.exports = () => {
  ReactDOM.render(<MainPage/>, document.getElementById("index-page"));
  ReactDOM.render(<ThemePage/>, document.getElementById("videoTutorials-themes"));
  ReactDOM.render(<TutorialTitle/>, document.getElementById("videoTutorial-title"));
  ReactDOM.render(<TutorialsPage/>, document.getElementById("videoTutorials-tutorials"));
  ReactDOM.render(<AlbumsPage/>, document.getElementById("photoGallery-albums"));
  ReactDOM.render(<PhotosPage/>, document.getElementById("photoGallery-photos"));
  ReactDOM.render(<PhotoTitle/>, document.getElementById("photoGallery-photos-title"));
  ReactDOM.render(<MaterialsPage/>, document.getElementById("materials"));
  ReactDOM.render(<BlogsPage/>, document.getElementById("blog"));
  ReactDOM.render(<BooksPage/>, document.getElementById("books"));
  ReactDOM.render(<CoursesPage/>, document.getElementById("courses"));
  ReactDOM.render(<AboutPage/>, document.getElementById("about"));
  ReactDOM.render(<FanArtPage/>, document.getElementById("fan-art"));
  ReactDOM.render(<FanArtDetailsPage/>, document.getElementById("fan-art-details"));
  ReactDOM.render(<FanArtUploadPage/>, document.getElementById("fan-art-upload"));
  ReactDOM.render(<SideMenu/>, document.getElementById("side-menu"));
  ReactDOM.render(<SignUp/>, document.getElementById("fan-art-signup"));
  ReactDOM.render(<SignIn/>, document.getElementById("fan-art-signin"));
  ReactDOM.render(<SubscribeForm/>, document.getElementById("subscribe"));
  ReactDOM.render(<OtherPage/>, document.getElementById("other"));
  ReactDOM.render(<VipZonePage/>, document.getElementById("vip-zone"));
  ReactDOM.render(<VipListPage/>, document.getElementById("vip-list"));
};
