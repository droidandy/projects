"use strict";

var MicroEvent, Store, app;
app = require("./../f7init/f7init");
MicroEvent = require("./../microevent");

Store = {
  fetchPlayLists() {
    return app.AppDispatcher.dispatch({
      eventName: "fetchPlayLists"
    });
  },
  fetchVideos(query) {
    return app.AppDispatcher.dispatch({
      eventName: "fetchVideos",
      query
    });
  },
  fetchPhotosets() {
    return app.AppDispatcher.dispatch({
      eventName: "fetchPhotosets"
    });
  },
  fetchPhotosInPhotoset(query) {
    return app.AppDispatcher.dispatch({
      eventName: "fetchPhotosInPhotoset",
      query
    });
  },
  fetchBlog() {
    return app.AppDispatcher.dispatch({
      eventName: "fetchBlog"
    });
  },
  fetchMaterials() {
    return app.AppDispatcher.dispatch({
      eventName: "fetchMaterials"
    });
  },
  booksWatch() {
    return app.AppDispatcher.dispatch({
      eventName: "booksWatch"
    });
  },
  coursesWatch() {
    return app.AppDispatcher.dispatch({
      eventName: "coursesWatch"
    });
  },
  fetchFanArt() {
    return app.AppDispatcher.dispatch({
      eventName: "fetchFanArt"
    });
  },
  fetchFanArtDetails(query) {
    return app.AppDispatcher.dispatch({
      eventName: "fetchFanArtDetails",
      query
    });
  },
  autorization(user) {
    return app.AppDispatcher.dispatch({
      eventName: "authorization",
      user
    });
  },
  pickPhoto(photo_url) {
    return app.AppDispatcher.dispatch({
      eventName: "pickPhoto",
      photo_url
    });
  },
  commentPosted() {
    return app.AppDispatcher.dispatch({
      eventName: "commentPosted"
    });
  },
  unauthorize() {
    return app.AppDispatcher.dispatch({
      eventName: "unauthorize"
    });
  },
  fetchVip() {
    return app.AppDispatcher.dispatch({
      eventName: "fetchVip"
    });
  },
  keepVipData(data) {
    return app.AppDispatcher.dispatch({
      eventName: "keepVipData",
      data
    });
  },
  vipData: null,
  tutorialsTitle: "",
  tutorialsId: "",
  photosTitle: "",
  photosetId: "",
  currentFanArtId: "",
  currentFanArtURL: "",
  photo_url: "",
  buddyIcon: "",
  user: window.Parse != null ? Parse.User.current() : null
};

MicroEvent.mixin(Store);

app.AppDispatcher.register((payload) => {
  switch (payload.eventName) {
    case "fetchPlayLists":
      Store.trigger("fetchPlayLists");
      break;
    case "fetchVideos":
      Store.tutorialsTitle = payload.query.title;
      if(Store.tutorialsId !== payload.query.id) {
        Store.tutorialsId = payload.query.id;
        Store.trigger("fetchVideos");
      }
      break;
    case "fetchPhotosets":
        Store.trigger("fetchPhotosets");
      break;
    case "fetchPhotosInPhotoset":
      Store.photosTitle = payload.query.title;
      if(Store.photosetId !== payload.query.id) {
        Store.photosetId = payload.query.id;
        Store.trigger("fetchPhotosInPhotoset");
      }
      break;
    case "fetchBlog":
        Store.trigger("fetchBlog");
      break;
    case "fetchMaterials":
        Store.trigger("fetchMaterials");
      break;  
    case "booksWatch":
      Store.trigger("booksWatch");
      break;
    case "coursesWatch":
      Store.trigger("coursesWatch");
      break;
    case "fetchFanArt":
      Store.trigger("fetchFanArt");
      break;
    case "fetchFanArtDetails":
      if(Store.currentFanArtId !== payload.query.id) {
        Store.currentFanArtId = payload.query.id;
        Store.currentFanArtURL = payload.query.url;
        console.log("Store triggers fetchFanArtDetails");
        Store.trigger("fetchFanArtDetails");
      }
      break;
    case "authorization":
      Store.user = payload.user;
      Store.trigger("authorization");
      break;
    case "pickPhoto":
      Store.photo_url = payload.photo_url;
      Store.trigger("pickPhoto");
      break;
    case "commentPosted":
      Store.trigger("commentPosted");
      break;
    case "unauthorize":
      Parse.User.logOut();
      Store.trigger("unauthorize");
      break;
    case "fetchVip":
      Store.trigger("fetchVip");
      break;
    case "keepVipData":
      Store.vipData = payload.data;
      Store.trigger("keepVipData");
      break;
    default:
      break;
  }
  return true;
});

module.exports = Store;
