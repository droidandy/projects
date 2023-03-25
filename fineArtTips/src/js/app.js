/**
 * Created by developercomputer on 27.10.15.
 * yep
 * ANDROID:
 * allmax.arte.devierte3
 * allmax.arte.devierte.free3
 * com.allmax.al
 * com.allmax.al.free
 * allmax.fine.art.tips2
 * allmax.fine.art.tips.free2
 *
 *
 * IOS:
 * com.allmax.ad.free
 * com.allmax.ad
 * com.allmax.al
 * com.allmax.al.free
 * com.allmax.fat.free
 * com.leonardo.fat
 */
  // document.addEventListener("DOMContentLoaded", () => { //DOMContentLoaded deviceready
 document.addEventListener("deviceready", () => { //DOMContentLoaded deviceready
  let PromiseShimmer = require("./promiseShimmer");
  PromiseShimmer();
  let lang = "en",
      free = true,
      Parse = require("./api/parse"),
      words = require("./words"),
      flickr = require("./api/flickr"),
      youtube = require("./api/youtube"),
      iContact = require("./api/iContact"),
      adMob = require("./api/admob"),
      translate = require("./translate"),
      push = require("./api/push");
  window.FREE = free;
  Parse.init(lang);
  words.init(lang);
  flickr.init(lang);
  youtube.init(lang);
  iContact.init(lang);
  translate(lang);
  let app = require("./f7init/f7init"),
      Main = require("./main/startRender"),
      Router = require("./router"),
      Splash = require("./splashScreen");
  Splash();
  app.f7.init();
  Main();
  Router();
  push.init(lang, free);
  adMob(free);
}, false);
