/**
 * Created by 1 on 06.12.2015.
 */
import { f7 } from "./f7init.js";
import screen from "./api/screen.js";
import store from "./store";

export default () => {
  f7.onPageBeforeAnimation('*', page => {
    switch (page.name) {
      case "capitals-test":
        store.dispatch({type: "TEST_START"});
        break;
    }
  });
};