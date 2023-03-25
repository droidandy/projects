import "framework7"
import { f7init } from "./f7init.js"
import Render from "./render.js"
import RouterInit from "./router.js"
import polyfills from "./polyfills.js";
import screen from "./api/screen.js";

document.addEventListener("deviceready", () => { //deviceready
  polyfills();
  screen.landscape();
  Render();
  f7init();
  RouterInit();
  try {
    StatusBar.hide();
  } catch(e) {
    console.log(e);
  }
});
