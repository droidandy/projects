/**
 * Created by developercomputer on 11.12.15.
 */
import { combineReducers } from "redux";
import map from "./make-map.js";
import test from "./test";


export default combineReducers({
  map,
  test,
  putNames: map
});
