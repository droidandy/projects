/**
 * Created by developercomputer on 27.10.15.
 * This is entry file. Here is file where app begins
 * Sorry for this bad code.
 * Callback hell... Fi.
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
  let PromiseShimmer = require("./promiseShimmer"),
      app = require("./f7init/f7init"),
      push = require("./api/push"),
      free = true;
  push.init(free);
  PromiseShimmer();
  let Splash = require("./splashScreen");
  Splash((lang) => {
    let Parse = require("./api/parse"),
        words = require("./words"),
        flickr = require("./api/flickr"),
        youtube = require("./api/youtube"),
        iContact = require("./api/iContact"),
        adMob = require("./api/admob"),
        translate = require("./translate"),
        warning = require("./pages/warning/warning");
    window.FREE = free;
    Parse.init(lang);
    adMob(free);
    words.init(lang);
    translate(lang);
    flickr.init(lang);
    youtube.init(lang);
    iContact.init(lang);
    let Main = require("./main/startRender"),
        Router = require("./router"),
        notify = require("./notify");
    app.init();
    Main();
    Router();
    warning();
    $$("#get-access").on("click", () => warning());
  });

}, false);
