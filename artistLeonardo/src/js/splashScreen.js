/**
 * Created by developercomputer on 17.11.15.
 */
module.exports = (callback) => {
  const LS_KEY_SPLASH = "__splash-num";
  let img = document.getElementById("diff-img");
  let splash = document.getElementById("splash");
  let langPanel = document.getElementById("lang-panel");
  let num = localStorage.getItem(LS_KEY_SPLASH);
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
  img.style.backgroundImage = `url("img/${num}.jpg")`;
  img.style.opacity = 1;
  setTimeout(() => {
    splash.classList.add("choose_stage");
    langPanel.classList.add("active");
    img.style.opacity = 0;
  }, 3000);
  $$(".lang--flag").on("click", (e) => {
    const { lang } = e.target.dataset;
    splash.style.opacity = 0;
    splash.style.visibility = "hidden";
    langPanel.style.opacity = 0;
    langPanel.style.visibility = "hidden";
    callback(lang);
  });
};
