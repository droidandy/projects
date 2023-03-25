/**
 * Created by developercomputer on 27.10.15.
 */

module.exports = () => {
  var app = require("./f7init/f7init"),
      Store = require("./stores/store"),
      { mainView } = app;

  const back = require("./router_back");

  app.f7.onPageBeforeAnimation('*', page => {
    $$(".searchbar").each((a, b) => {
      try {
        b.f7Searchbar.disable();
      } catch(e) {
        console.log("Failed to get searchbar instance.");
      }
    });
    switch (page.name) {
      case "index":
        $$(document).off("backbutton", back);
        break;
      case "videoTutorials-themes":
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        Store.fetchPlayLists();
        break;
      case "videoTutorials-tutorials":
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        if(page.query) {
          Store.fetchVideos(page.query);
        }
        break;
      case "photoGallery-albums":
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        Store.fetchPhotosets();
        break;
      case "photoGallery-photos":
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        if(page.query) {
          Store.fetchPhotosInPhotoset(page.query);
        }
        break;
      case "blog":
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        Store.fetchBlog();
        break;
      case "materials":
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        Store.fetchMaterials();
        break;
      case "books":
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        Store.booksWatch();
        break;
      case "courses":
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        Store.coursesWatch();
        break;
      case "fan-art":
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        require("./pages/fan-art-gallery/community")();
        if (page.fromPage) {
          if(page.fromPage.name !== "fan-art-details") {
            Store.fetchFanArt();
          }
        }
        break;
      case "vip-zone":
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        Store.fetchVip();
        break;
      case "fan-art-details":
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        //prevent bug when we get back from upload page we lost info about it
        if(page.query.hasOwnProperty("id")) {
          Store.fetchFanArtDetails(page.query);
        }
        break;
      default:
        $$(document).off("backbutton", back);
        $$(document).on("backbutton", back);
        break;
    }
  });
};
