/**
 * Created by developercomputer on 27.10.15.
 */

module.exports = () => {
  var app = require("./f7init/f7init"),
      Store = require("./stores/store"),
      { mainView } = app,
      backIsExit = true;
  const back = (e) => {
    e.preventDefault();
    if(!backIsExit) {
      return mainView.router.back();
    }
    return navigator.app.exitApp();
  };
  $$(document).on("backbutton", back);
  app.f7.onPageBeforeAnimation('*', page => {
    $$(".searchbar").each((a, b) => {
      try {
        b.f7Searchbar.disable();
      } catch(e) {
      }
    });
    switch (page.name) {
      case "index":
        backIsExit = true;
        break;
      case "photoGallery-albums":
        backIsExit = false;
        Store.fetchPhotosets();
        break;
      case "photoGallery-photos":
        backIsExit = false;
        if(page.query) {
          Store.fetchPhotosInPhotoset(page.query);
        }
        break;
      case "blog":
        backIsExit = false;
        Store.fetchBlog();
        break;
      case "materials":
        backIsExit = false;
        Store.fetchMaterials();
        break;
      case "books":
        backIsExit = false;
        Store.booksWatch();
        break;
      case "courses":
        backIsExit = false;
        Store.coursesWatch();
        break;
      case "fan-art":
        backIsExit = false;
        require("./pages/fan-art-gallery/community")();
        Store.fetchFanArt();
        break;
      case "vip-zone":
        backIsExit = false;
        Store.fetchVip();
        break;
      case "fan-art-details":
        backIsExit = false;
        //prevent bug when we get back from upload page we lost info about it
        if(page.query.hasOwnProperty("id")) {
          Store.fetchFanArtDetails(page.query);
        }
        break;
      default:
        backIsExit = false;
        break;
    }
  });
};
