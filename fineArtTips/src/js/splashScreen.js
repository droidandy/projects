/**
 * Created by developercomputer on 17.11.15.
 */
module.exports = () => {
  const LS_KEY_SPLASH = "__splash-num";
  var img = $$("#diff-img");
  var num = localStorage.getItem(LS_KEY_SPLASH);
  if(num == null) {
    num = 1;
    localStorage.setItem(LS_KEY_SPLASH, "2");
  } else {
    num = +num;
    const LAST_IMG_IN_ROW = 6;
    if(num === LAST_IMG_IN_ROW) {
      localStorage.setItem(LS_KEY_SPLASH, "1");
    } else {
      localStorage.setItem(LS_KEY_SPLASH, num + 1);
    }
  }
  img.css({ backgroundImage: `url("img/${num}.jpg")`});
  return img.css({ opacity: 1 });
};
