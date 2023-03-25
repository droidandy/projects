/**
 * Created by developercomputer on 07.01.16.
 */
import { List, Map } from "immutable";
import { MOVE, RIGHT_DROP, MAKE_MAP_OVER } from "./../actions/make-map-actions.js";
import makeMapContent from "./../content/make-map.js";

const mapReducer = (state = makeMapContent(), action = {}) => {
  switch(action.type) {
    case RIGHT_DROP:
      return state.map((item) => {
        if(item.get("id") === action.item.id) {
          if(action.item.type === "put-names") {
            return item.set("done_put_names", true);
          }
          if(action.item.type === "make-map") {
            return item.set("done_make_map", true);
          }
        }
        return item;
      });
      break;
    case MAKE_MAP_OVER:
      return makeMapContent();
    default:
        return state;
      break;
  }
};

export default mapReducer;
